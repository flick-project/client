import { useEffect, useRef, useReducer, useState, useCallback } from 'react'
import { DiscoveryContext } from './DiscoveryContext.jsx'
import { apiRequest } from '../services/api.js'
import { getQueue, saveQueue } from '../services/storage.js'
import { useAuth } from '../hooks/useAuth.js'

const REFILL_THRESHOLD = 5

const queueReducer = (state, action) => {
  switch (action.type) {
    case 'APPEND_MOVIES': {
      // Trim already-watched movies before appending.
      const remaining = state.movies.slice(state.currentIndex)
      const existingIds = new Set(remaining.map(m => m.id))
      const newMovies = action.movies.filter(m => !existingIds.has(m.id))
      return { ...state, movies: [...remaining, ...newMovies], currentIndex: 0 }
    }
    case 'ADVANCE':
      return { ...state, currentIndex: state.currentIndex + 1, canGoBack: true }
    case 'GO_BACK': {
      if (!state.canGoBack || state.currentIndex <= 0) return state
      return { ...state, currentIndex: state.currentIndex - 1, canGoBack: false }
    }
    case 'RESET':
      return { movies: [], currentIndex: 0, canGoBack: false, injectedMovie: false, searchOpen: false }
    case 'INJECT_MOVIE': {
      const movies = [...state.movies]
      if (state.injectedMovie) {
        movies.splice(state.currentIndex, 1)
      }
      const existingIndex = movies.findIndex(m => m.id === action.movie.id)
      if (existingIndex !== -1) {
        movies.splice(existingIndex, 1)
      }
      const insertIndex = Math.min(state.currentIndex, movies.length)
      movies.splice(insertIndex, 0, action.movie)
      return { ...state, movies, currentIndex: insertIndex, canGoBack: false, injectedMovie: true, searchOpen: true }
    }
    case 'EJECT_MOVIE': {
      if (!state.injectedMovie) return { ...state, searchOpen: false }
      const movies = [...state.movies]
      movies.splice(state.currentIndex, 1)
      return { ...state, movies, injectedMovie: false, searchOpen: false }
    }
    case 'OPEN_SEARCH':
      return { ...state, searchOpen: true }
    case 'CLOSE_SEARCH':
      return { ...state, searchOpen: false }
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
    canGoBack: false,
    injectedMovie: false,
    searchOpen: false
  })

  const loadMovies = useCallback(async () => {
    try {
      const result = await apiRequest('/movies/discover')
      dispatch({ type: 'APPEND_MOVIES', movies: result.movies })
    } catch (err) {
      console.error(err)
      setError(err.message || 'Something went wrong. Please try again.')
    }
  }, [])

  useEffect(() => {
    if (loading) return
    const init = async () => {
      const saved = getQueue()
      if (!saved?.length || saved.length <= REFILL_THRESHOLD) {
        await loadMovies()
      }
    }
    init()
  }, [loading, loadMovies])

  useEffect(() => {
    if (loading) return
    const init = async () => {
      await loadMovies()
    }
    init()
  }, [loading, loadMovies])

  useEffect(() => {
    if (loading) return
    if (prevUserRef.current && !user) {
      dispatch({ type: 'RESET' })
      loadMovies()
    }
    prevUserRef.current = user
  }, [loading, user, loadMovies])

  useEffect(() => {
    if (!queue.injectedMovie) {
      saveQueue(queue.movies.slice(queue.currentIndex))
    }
  }, [queue.movies, queue.currentIndex, queue.injectedMovie])

  const advance = useCallback(() => {
    if (queue.injectedMovie) {
      dispatch({ type: 'EJECT_MOVIE' })
      return
    }
    dispatch({ type: 'ADVANCE' })
    if (queue.currentIndex + 1 + REFILL_THRESHOLD >= queue.movies.length) {
      loadMovies()
    }
  }, [queue.injectedMovie, queue.currentIndex, queue.movies.length, loadMovies])

  const back = useCallback(() => {
    if (!queue.injectedMovie) dispatch({ type: 'GO_BACK' })
  }, [queue.injectedMovie])

  const reset = useCallback(async () => {
    dispatch({ type: 'RESET' })
    saveQueue([])
    await loadMovies()
  }, [loadMovies])

  const inject = useCallback((movie) => {
    dispatch({ type: 'INJECT_MOVIE', movie })
  }, [])

  const eject = useCallback(() => {
    dispatch({ type: 'EJECT_MOVIE' })
  }, [])

  const openSearch = useCallback(() => {
    dispatch({ type: 'OPEN_SEARCH' })
  }, [])

  const closeSearch = useCallback(() => {
    dispatch({ type: 'CLOSE_SEARCH' })
  }, [])

  const interact = useCallback(async (type) => {
    if (isInteracting) return
    setIsInteracting(true)
    try {
      const movieId = queue.movies[queue.currentIndex].id
      if (!(queue.injectedMovie && type === 'skipped')) {
        await apiRequest('/interactions', {
          method: 'POST',
          body: JSON.stringify({ movieId, interaction: type })
        })
      }
      advance()
    } catch (err) {
      console.error(err)
      throw err
    } finally {
      setIsInteracting(false)
    }
  }, [isInteracting, queue.movies, queue.currentIndex, queue.injectedMovie, advance])

  const rate = useCallback(async (rating) => {
    try {
      const movieId = queue.movies[queue.currentIndex].id
      await apiRequest('/ratings', {
        method: 'POST',
        body: JSON.stringify({ movieId, rating })
      })
      advance()
    } catch (err) {
      console.error(err)
      throw err
    }
  }, [queue.movies, queue.currentIndex, advance])

  useEffect(() => {
    const handleImport = () => reset()
    window.addEventListener('import-complete', handleImport)
    return () => window.removeEventListener('import-complete', handleImport)
  }, [reset])

  return (
    <DiscoveryContext value={{
      currentMovie: queue.movies[queue.currentIndex],
      canGoBack: queue.canGoBack,
      injectedMovie: queue.injectedMovie,
      searchOpen: queue.searchOpen,
      back,
      interact,
      rate,
      reset,
      inject,
      eject,
      openSearch,
      closeSearch,
      error
    }}
    >
      {children}
    </DiscoveryContext>
  )
}
