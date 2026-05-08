import { useState, useEffect } from 'react'
import MovieCard from '../components/MovieCard.jsx'
import { apiRequest } from '../services/api.js'
import DiscoveryControls from '../components/DiscoveryControls.jsx'
import { useToast } from '../hooks/useToast'

/**
 * Discovery page where users swipe through movie suggestions.
 * @returns {React.ReactElement} The DiscoveryPage component.
 */
export default function DiscoveryPage () {
  const [page, setPage] = useState(1)
  const [movies, setMovies] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [error, setError] = useState(null)
  const [canGoBack, setCanGoBack] = useState(false)
  const { showToast } = useToast()

  // Mount and fetch movie suggestions.
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const result = await apiRequest(`/movies/discover?page=${page}`)
        // Set for O(1) lookups. Filters duplicates since Strict Mode makes effects run twice.
        setMovies(prev => {
          const existingIds = new Set(prev.map(m => m.id))
          const newMovies = result.movies.filter(m => !existingIds.has(m.id))
          return [...prev, ...newMovies]
        })
      } catch (err) {
        console.error(err)
        setError(err.message || 'Something went wrong. Please try again.')
      }
    }
    fetchMovies()
  }, [page])

  // Record save/skip interaction and advance to the next movie.
  const handleInteraction = async (type) => {
    try {
      const body = { movieId: movies[currentIndex].id, interaction: type }

      await apiRequest('/movies/interact', { method: 'POST', body: JSON.stringify(body) })

      setCurrentIndex(currentIndex + 1)
      setCanGoBack(true)

      // Pre-fetch next page before running out of movies.
      if (currentIndex + 5 >= movies.length) {
        setPage(page + 1)
      }
    } catch (err) {
      console.error(err)
      showToast((err.message || 'Something went wrong. Please try again.'), 'fail')
    }
  }

  // Go back one movie. Only allowed once per forward move.
  const handleBack = () => {
    if (canGoBack && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setCanGoBack(false)
    }
  }

  return (
    <div className='flex flex-col items-center justify-center gap-4 xl:gap-6 h-full p-4 xl:p-8'>
      <MovieCard movie={movies[currentIndex]} error={error} />
      <DiscoveryControls interaction={handleInteraction} handleBack={handleBack} canGoBack={canGoBack} />
    </div>
  )
}
