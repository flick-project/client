import { useEffect, useRef, useReducer, useState } from 'react'
import { DiscoveryContext } from './DiscoveryContext.jsx'
import { apiRequest } from '../services/api.js'
import { getQueue, saveQueue } from '../services/storage.js'
import { useAuth } from '../hooks/useAuth.js'

const REFILL_THRESHOLD = 5

const queueReducer = (state, action) => {
  switch (action.type) {
    case 'APPEND_MOVIES': {
      const existingIds = new Set(state.movies.map(m => m.id))
      const newMovies = action.movies.filter(m => !existingIds.has(m.id))
      return { ...state, movies: [...state.movies, ...newMovies] }
    }
    case 'ADVANCE': {
      return { ...state, currentIndex: state.currentIndex + 1, canGoBack: true }
    }
    case 'GO_BACK': {
      if (!state.canGoBack || state.currentIndex <= 0) return state
      return { ...state, currentIndex: state.currentIndex - 1, canGoBack: false }
    }
    case 'RESET': {
      return { movies: [], currentIndex: 0, canGoBack: false }
    }
    default:
      return state
  }
}

/**
 * Provides discovery queue state and controls to the app.
 * @param {object} props - Component props.
 * @param {React.ReactElement} props.children - Child components.
 * @returns {React.ReactElement} The DiscoveryProvider component.
 */
export function DiscoveryProvider ({ children }) {
  const { user, loading } = useAuth()
  const [error, setError] = useState(null)
  const [isInteracting, setIsInteracting] = useState(false)
  const prevUserRef = useRef(user)

  const [queue, dispatch] = useReducer(queueReducer, {
    movies: getQueue() ?? [],
    currentIndex: 0,
    canGoBack: false
  })

  const loadMovies = async () => {
    try {
      const result = await apiRequest('/movies/discover')
      dispatch({ type: 'APPEND_MOVIES', movies: result.movies })
    } catch (err) {
      console.error(err)
      setError(err.message || 'Something went wrong. Please try again.')
    }
  }

  // Initial load: fetch if cache is low.
  useEffect(() => {
    if (loading) return
    const init = async () => {
      await loadMovies()
    }
    init()
  }, [loading])

  // Reset queue when user logs out or session expires.
  useEffect(() => {
    if (loading) return
    if (prevUserRef.current && !user) {
      dispatch({ type: 'RESET' })
      loadMovies()
    }
    prevUserRef.current = user
  }, [loading, user])

  // Persist queue to localStorage.
  useEffect(() => {
    saveQueue(queue.movies.slice(queue.currentIndex))
  }, [queue.movies, queue.currentIndex])

  const advance = () => {
    dispatch({ type: 'ADVANCE' })
    if (queue.currentIndex + 1 + REFILL_THRESHOLD >= queue.movies.length) {
      loadMovies()
    }
  }

  const back = () => {
    dispatch({ type: 'GO_BACK' })
  }

  const reset = async () => {
    dispatch({ type: 'RESET' })
    saveQueue([])
    await loadMovies()
  }

  const interact = async (type) => {
    if (isInteracting) return
    setIsInteracting(true)
    try {
      const movieId = queue.movies[queue.currentIndex].id
      const body = { movieId, interaction: type }
      await apiRequest('/interactions', { method: 'POST', body: JSON.stringify(body) })
      advance()
    } catch (err) {
      console.error(err)
      throw err
    } finally {
      setIsInteracting(false)
    }
  }

  const rate = async (rating) => {
    try {
      const movieId = queue.movies[queue.currentIndex].id
      const body = { movieId, rating }
      await apiRequest('/ratings', { method: 'POST', body: JSON.stringify(body) })
      advance()
    } catch (err) {
      console.error(err)
      throw err
    }
  }

  return (
    <DiscoveryContext value={{
      currentMovie: queue.movies[queue.currentIndex],
      canGoBack: queue.canGoBack,
      back,
      interact,
      rate,
      reset,
      error
    }}
    >
      {children}
    </DiscoveryContext>
  )
}
