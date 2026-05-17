import { useState, useEffect } from 'react'
import { apiRequest } from '../services/api.js'
import { useAuth } from '../hooks/useAuth.js'
import { useToast } from '../hooks/useToast'
import MovieCard from '../components/MovieCard.jsx'
import DiscoveryControls from '../components/DiscoveryControls.jsx'
import AuthFlow from '../components/AuthFlow.jsx'

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
  const [isInteracting, setIsInteracting] = useState(false)
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const { user } = useAuth()
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
    if (!user) {
      setIsAuthOpen(true)
      return
    }
    if (isInteracting) return
    setIsInteracting(true)
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
    } finally {
      setIsInteracting(false)
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
    <div className='size-full flex flex-col items-center justify-center gap-4 xl:gap-6 p-4 xl:p-8 overflow-hidden'>
      <div className='relative flex-1 min-h-0'>
        {movies[currentIndex] &&
          <img
            src={`https://image.tmdb.org/t/p/w154${movies[currentIndex].poster_path}`}
            alt=''
            className='absolute inset-0 size-full object-cover opacity-15 scale-110 xl:scale-125 2xl:scale-150 -top-1/4 mix-blend-screen -z-10 pointer-events-none'
            style={{ filter: 'blur(80px) saturate(1.5)' }}
          />}
        <MovieCard movie={movies[currentIndex]} error={error} />
      </div>
      <DiscoveryControls interaction={handleInteraction} handleBack={handleBack} canGoBack={canGoBack} />
      {isAuthOpen && <AuthFlow onClose={() => setIsAuthOpen(false)} />}
    </div>
  )
}
