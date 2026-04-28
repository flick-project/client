import { useState, useEffect } from 'react'
import MovieCard from '../components/MovieCard.jsx'
import { apiRequest } from '../services/api.js'
import DiscoveryControls from '../components/DiscoveryControls.jsx'

/**
 * Discovery page where users swipe through movie suggestions.
 * @returns {React.ReactElement} The DiscoveryPage component.
 */
export default function DiscoveryPage () {
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
        setError(err.message || 'Something went wrong. Please try again.')
      }
    }
    fetchMovies()
  }, [page])

  const handleInteraction = async (type) => {
    try {
      const body = { movieId: movies[currentIndex].id, interaction: type }

      await apiRequest('/movies/interact', {
        method: 'POST',
        body: JSON.stringify(body)
      })

      setCurrentIndex(currentIndex + 1)
    } catch (err) {
      console.error(err)
      setError(err.message || 'Something went wrong. Please try again.')
    }
  }

  return (
    <div className='flex flex-col items-center gap-4'>
      <MovieCard movie={movies[currentIndex]} error={error} />
      <DiscoveryControls interaction={handleInteraction} />
    </div>
  )
}
