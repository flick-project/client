import { useState, useEffect } from 'react'
import MovieCard from '../components/MovieCard.jsx'
import { apiRequest } from '../services/api.js'

/**
 * Discovery page where users swipe through movie suggestions.
 * @returns {React.ReactElement} The DiscoveryPage component.
 */
function DiscoveryPage () {
  const [page, setPage] = useState(1)
  const [movies, setMovies] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [error, setError] = useState(null)

  // Mount and fetch movie suggestions.
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const result = await apiRequest(`/movies/discover?page=${page}`)
        setMovies(result.movies)
      } catch (err) {
        console.error(err)
        setError({ general: err.message || 'Something went wrong. Please try again.' })
      }
    }
    fetchMovies()
  }, [page])

  return (
    <MovieCard movie={movies[currentIndex]} error={error} />
  )
}

export default DiscoveryPage
