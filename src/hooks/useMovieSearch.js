import { useState, useEffect } from 'react'
import { apiRequest } from '../services/api.js'

/**
 * Hook for debounced movie search via TMDB.
 * @param {(movie: object) => void} onSelect - Callback when a movie is selected.
 * @param {Array} excludeIds - Movies to exclude from results.
 * @returns {object} Search state and handlers.
 */
export function useMovieSearch (onSelect, excludeIds) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!query.trim()) {
        setResults([])
        return
      }
      try {
        const data = await apiRequest(`/movies/search?query=${query}`)
        const filtered = excludeIds
          ? data.results.filter(movie => !excludeIds.includes(movie.id))
          : data.results
        setResults(filtered)
      } catch (err) {
        console.error(err)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [query, excludeIds])

  const handleSelect = (movie) => {
    onSelect(movie)
    setResults([])
    setQuery('')
  }

  const clearResults = () => {
    setResults([])
  }

  return { handleSelect, clearResults, setQuery, query, results }
}
