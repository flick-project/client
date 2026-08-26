import { useEffect, useRef, useReducer, useState, useCallback } from 'react'
import { DiscoveryContext } from './DiscoveryContext.jsx'
import { apiRequest } from '../services/api.js'
import { getQueue, saveQueue } from '../services/storage.js'
import { useAuth } from '../hooks/useAuth.js'

// Hard cap on how many movies live in the queue at once. Prevents runaway
// growth if refill fires more than once for the same batch.
const QUEUE_LIMIT = 20

// Fetch more movies when the queue has this many or fewer left.
const REFILL_THRESHOLD = 5

const queueReducer = (state, action) => {
  switch (action.type) {
    case 'APPEND_MOVIES': {
      const hasPrevious = state.currentIndex > 0 && state.canGoBack
      const startIndex = hasPrevious ? state.currentIndex - 1 : state.currentIndex
      const remaining = state.movies.slice(startIndex)
      const existingIds = new Set(remaining.map(m => m.id))
      const newMovies = action.movies.filter(m => !existingIds.has(m.id))
      // Cap at QUEUE_LIMIT so concurrent refills can't inflate the queue.
      const combined = [...remaining, ...newMovies].slice(0, QUEUE_LIMIT)
      return {
        ...state,
        movies: combined,
        currentIndex: hasPrevious ? 1 : 0
      }
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
      if (state.injectedMovie) movies.splice(state.currentIndex, 1)
      const existingIndex = movies.findIndex(m => m.id === action.movie.id)
      if (existingIndex !== -1) movies.splice(existingIndex, 1)
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
    // Mutates the current movie in place, used for optimistic save/rating updates.
    case 'UPDATE_CURRENT': {
      const movies = [...state.movies]
      movies[state.currentIndex] = { ...movies[state.currentIndex], ...action.updates }
      return { ...state, movies }
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
 * The queue persists to localStorage between sessions and refills
 * from the server when it runs low.
 * @param {object} props - Component props.
 * @param {React.ReactElement} props.children - Child components.
 * @returns {React.ReactElement} The DiscoveryProvider component.
 */
export function DiscoveryProvider ({ children }) {
  const { user, loading } = useAuth()
  const [error, setError] = useState(null)
  const prevUserRef = useRef(user)
  const isInteractingRef = useRef(false)
  // Prevents overlapping /movies/discover calls from double-appending.
  const isLoadingRef = useRef(false)

  const [queue, dispatch] = useReducer(queueReducer, null, () => ({
    movies: getQueue() ?? [],
    currentIndex: 0,
    canGoBack: false,
    injectedMovie: false,
    searchOpen: false
  }))

  // Ref mirror of queue so async callbacks see the latest state without
  // needing to be recreated on every render.
  const queueRef = useRef(queue)
  useEffect(() => { queueRef.current = queue }, [queue])

  const retryAtRef = useRef(0)

  const loadMovies = useCallback(async () => {
    if (isLoadingRef.current || Date.now() < retryAtRef.current) return
    isLoadingRef.current = true
    try {
      const result = await apiRequest('/movies/discover')
      dispatch({ type: 'APPEND_MOVIES', movies: result.movies })
      retryAtRef.current = 0
      setError(null)
    } catch (err) {
      console.error(err)
      setError(err.message || 'Something went wrong. Please try again.')
      retryAtRef.current = Date.now() + 5000
    } finally {
      isLoadingRef.current = false
    }
  }, [])

  const advance = useCallback(() => {
    const current = queueRef.current
    if (current.injectedMovie) {
      dispatch({ type: 'EJECT_MOVIE' })
      return
    }
    dispatch({ type: 'ADVANCE' })
  }, [])

  const back = useCallback(() => {
    if (!queueRef.current.injectedMovie) dispatch({ type: 'GO_BACK' })
  }, [])

  // Clear the queue and fetch fresh movies.
  const reset = useCallback(async () => {
    dispatch({ type: 'RESET' })
    saveQueue([])
    await loadMovies()
  }, [loadMovies])

  const inject = useCallback((movie) => dispatch({ type: 'INJECT_MOVIE', movie }), [])
  const eject = useCallback(() => dispatch({ type: 'EJECT_MOVIE' }), [])
  const openSearch = useCallback(() => dispatch({ type: 'OPEN_SEARCH' }), [])
  const closeSearch = useCallback(() => dispatch({ type: 'CLOSE_SEARCH' }), [])
  const updateCurrent = useCallback((updates) => dispatch({ type: 'UPDATE_CURRENT', updates }), [])

  // Toggle the current movie's saved state. Does NOT advance the queue.
  const toggleSave = useCallback(async () => {
    if (isInteractingRef.current) return
    isInteractingRef.current = true
    const movie = queueRef.current.movies[queueRef.current.currentIndex]
    if (!movie) { isInteractingRef.current = false; return }
    const wasSaved = movie.saved
    // Optimistic update — flip immediately, roll back on error.
    dispatch({ type: 'UPDATE_CURRENT', updates: { saved: !wasSaved } })
    try {
      if (wasSaved) {
        await apiRequest(`/watchlist/${movie.id}`, { method: 'DELETE' })
      } else {
        await apiRequest('/interactions', {
          method: 'POST',
          body: JSON.stringify({ movieId: movie.id, interaction: 'saved' })
        })
      }
    } catch (err) {
      dispatch({ type: 'UPDATE_CURRENT', updates: { saved: wasSaved } })
      console.error(err)
      throw err
    } finally {
      isInteractingRef.current = false
    }
  }, [])

  // Set, change, or clear the current movie's rating. Tapping the same
  // rating twice clears it. Does NOT advance the queue.
  const setRating = useCallback(async (rating) => {
    if (isInteractingRef.current) return
    isInteractingRef.current = true
    const movie = queueRef.current.movies[queueRef.current.currentIndex]
    if (!movie) { isInteractingRef.current = false; return }
    const prevRating = movie.user_rating
    const newRating = rating === prevRating ? null : rating
    dispatch({ type: 'UPDATE_CURRENT', updates: { user_rating: newRating } })
    try {
      if (newRating === null) {
        await apiRequest(`/ratings/${movie.id}`, { method: 'DELETE' })
      } else {
        await apiRequest('/ratings', {
          method: 'POST',
          body: JSON.stringify({ movieId: movie.id, rating: newRating })
        })
      }
    } catch (err) {
      dispatch({ type: 'UPDATE_CURRENT', updates: { user_rating: prevRating } })
      console.error(err)
      throw err
    } finally {
      isInteractingRef.current = false
    }
  }, [])

  // Advance to the next movie. Records a skip only when the user hasn't
  // otherwise interacted with the current movie.
  const next = useCallback((force = false) => {
    const current = queueRef.current
    const movie = current.movies[current.currentIndex]
    if (!movie) return
    if (!force) {
      const nextExists = current.movies[current.currentIndex + 1] != null
      if (!nextExists) return
      const untouched = !movie.saved && !movie.user_rating
      if (untouched && !current.injectedMovie) {
        apiRequest('/interactions', {
          method: 'POST',
          body: JSON.stringify({ movieId: movie.id, interaction: 'skipped' })
        }).catch(console.error)
      }
    }
    advance()
  }, [advance])

  // Marks the current movie as dismissed (negative signal) and advances.
  const dismiss = useCallback(async () => {
    if (isInteractingRef.current) return
    isInteractingRef.current = true
    const movie = queueRef.current.movies[queueRef.current.currentIndex]
    if (!movie) { isInteractingRef.current = false; return }
    try {
      await apiRequest('/interactions', {
        method: 'POST',
        body: JSON.stringify({ movieId: movie.id, interaction: 'dismissed' })
      })
      advance()
    } catch (err) {
      console.error(err)
      throw err
    } finally {
      isInteractingRef.current = false
    }
  }, [advance])

  // Clear queue on logout.
  useEffect(() => {
    if (loading) return
    if (prevUserRef.current && !user) {
      dispatch({ type: 'RESET' })
      saveQueue([])
    }
    prevUserRef.current = user
  }, [loading, user])

  // Keep the queue refilled whenever it runs low. Covers initial seed,
  // mid-session drains, and retry after a failed refill. Backoff in
  // loadMovies prevents spamming the server when it returns empty/errors.
  useEffect(() => {
    if (loading) return
    const seedQueue = async () => {
      const remaining = queue.movies.length - queue.currentIndex
      if (queue.movies.length === 0 || remaining <= REFILL_THRESHOLD + 1) {
        loadMovies()
      }
    }
    seedQueue()
  }, [loading, queue.movies.length, queue.currentIndex, loadMovies])

  // Persist remaining movies to localStorage for session continuity.
  useEffect(() => {
    if (!queue.injectedMovie) {
      saveQueue(queue.movies.slice(queue.currentIndex))
    }
  }, [queue.movies, queue.currentIndex, queue.injectedMovie])

  // Reset queue when an import completes so fresh recommendations load.
  useEffect(() => {
    const handleImport = () => reset()
    window.addEventListener('import-complete', handleImport)
    return () => window.removeEventListener('import-complete', handleImport)
  }, [reset])

  return (
    <DiscoveryContext value={{
      currentMovie: queue.movies[queue.currentIndex],
      prevMovie: queue.canGoBack ? queue.movies[queue.currentIndex - 1] : null,
      nextMovie: queue.movies[queue.currentIndex + 1] ?? null,
      canGoBack: queue.canGoBack,
      injectedMovie: queue.injectedMovie,
      searchOpen: queue.searchOpen,
      back,
      toggleSave,
      setRating,
      next,
      dismiss,
      reset,
      inject,
      eject,
      openSearch,
      closeSearch,
      updateCurrent,
      error
    }}
    >
      {children}
    </DiscoveryContext>
  )
}
