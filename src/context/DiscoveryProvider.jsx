import { DiscoveryContext } from './DiscoveryContext.jsx'
import { useState, useEffect, useReducer } from 'react'
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
    case 'RESET': {
      return { movies: [] }
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
  const { loading } = useAuth()
  const [error, setError] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [queue, dispatch] = useReducer(queueReducer, { movies: getQueue() ?? [] })
  const [isInteracting, setIsInteracting] = useState(false)
  const [canGoBack, setCanGoBack] = useState(false)

  console.log('provider render', currentIndex, queue.movies.length)

  const loadMovies = async () => {
    try {
      const result = await apiRequest('/movies/discover')
      dispatch({ type: 'APPEND_MOVIES', movies: result.movies })
    } catch (err) {
      console.error(err)
      setError(err.message || 'Something went wrong. Please try again.')
    }
  }

  // Initial load: wait for auth to settle before fetching.
  useEffect(() => {
    if (loading) return
    const init = async () => {
      const saved = getQueue()
      if (saved?.length >= REFILL_THRESHOLD) return
      await loadMovies()
    }
    init()
  }, [loading])

  useEffect(() => {
    saveQueue(queue.movies.slice(currentIndex))
  }, [queue.movies, currentIndex])

  const reset = async () => {
    dispatch({ type: 'RESET' })
    setCurrentIndex(0)
    setCanGoBack(false)
    saveQueue([])
    await loadMovies()
  }

  /**
   * Advances the queue after an interaction.
   */
  const advance = () => {
    const nextIndex = currentIndex + 1
    setCurrentIndex(nextIndex)
    setCanGoBack(true)
    if (nextIndex + REFILL_THRESHOLD >= queue.movies.length) {
      loadMovies()
    }
  }

  // Go back one movie. Only allowed once per forward move.
  const back = () => {
    if (canGoBack && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setCanGoBack(false)
    }
  }

  const interact = async (type) => {
    if (isInteracting) return
    setIsInteracting(true)
    try {
      const movieId = queue.movies[currentIndex].id
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
      const movieId = queue.movies[currentIndex].id
      const body = { movieId, rating }
      await apiRequest('/ratings', { method: 'POST', body: JSON.stringify(body) })
      advance()
    } catch (err) {
      console.error(err)
      throw err
    }
  }

  return (
    <DiscoveryContext value={{ currentMovie: queue.movies[currentIndex], canGoBack, back, interact, rate, reset, error }}>
      {children}
    </DiscoveryContext>
  )
}
