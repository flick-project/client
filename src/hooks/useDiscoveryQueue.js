import { useState, useEffect, useReducer } from 'react'
import { apiRequest } from '../services/api.js'
import { getQueue, saveQueue } from '../services/storage.js'

const REFILL_THRESHOLD = 5

const queueReducer = (state, action) => {
  switch (action.type) {
    case 'APPEND_MOVIES': {
      const existingIds = new Set(state.movies.map(m => m.id))
      const newMovies = action.movies.filter(m =>
        !existingIds.has(m.id) && !state.interactedIds.has(m.id)
      )
      return { ...state, movies: [...state.movies, ...newMovies] }
    }
    case 'INTERACT': {
      return {
        ...state,
        interactedIds: new Set([...state.interactedIds, action.movieId])
      }
    }
    default:
      return state
  }
}

/**
 * Handles the discovery queue.
 * @returns {object} Queue state and controls.
 */
export function useDiscoveryQueue () {
  const [error, setError] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [queue, dispatch] = useReducer(queueReducer, { movies: getQueue() ?? [], interactedIds: new Set() })
  const [isInteracting, setIsInteracting] = useState(false)
  const [canGoBack, setCanGoBack] = useState(false)

  const loadMovies = async () => {
    try {
      const result = await apiRequest('/movies/discover')
      dispatch({ type: 'APPEND_MOVIES', movies: result.movies })
    } catch (err) {
      console.error(err)
      setError(err.message || 'Something went wrong. Please try again.')
    }
  }

  useEffect(() => {
    const init = async () => {
      try {
        const result = await apiRequest('/movies/discover')
        dispatch({ type: 'APPEND_MOVIES', movies: result.movies })
      } catch (err) {
        console.error(err)
        setError(err.message || 'Something went wrong. Please try again.')
      }
    }
    init()
  }, [])

  useEffect(() => {
    saveQueue(queue.movies)
  }, [queue.movies])

  /**
   * Advances the queue after an interaction.
   * Tracks interacted movie IDs to prevent them from appearing in future fetches.
   * @param {number} movieId - The TMDB ID of the movie just interacted with.
   */
  const advance = (movieId) => {
    dispatch({ type: 'INTERACT', movieId })
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
      advance(movieId)
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
      advance(movieId)
    } catch (err) {
      console.error(err)
      throw err
    }
  }

  return {
    currentMovie: queue.movies[currentIndex],
    canGoBack,
    back,
    interact,
    rate,
    error,
  }
}
