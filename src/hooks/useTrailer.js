import { useState, useEffect } from 'react'
import { apiRequest } from '../services/api'

/**
 * Fetches the YouTube trailer key for a movie from the backend.
 * Returns null while loading, if there is no trailer, or if the fetch fails.
 * Cancels in-flight requests when the movieId changes or the caller unmounts,
 * so state updates never fire against a stale target.
 * @param {number|string|undefined} movieId - The TMDB movie ID, or falsy to skip fetching.
 * @returns {string|null} The trailer key, or null when unavailable.
 */
export function useTrailer (movieId) {
  const [trailerKey, setTrailerKey] = useState(null)

  useEffect(() => {
    if (!movieId) return
    let cancelled = false
    const load = async () => {
      setTrailerKey(null)
      try {
        const data = await apiRequest(`/movies/${movieId}/trailer`)
        if (!cancelled) setTrailerKey(data.key)
      } catch (err) {
        if (err.status !== 404) console.error(err)
      }
    }
    load()
    return () => { cancelled = true }
  }, [movieId])

  return trailerKey
}
