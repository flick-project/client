import { usePageTitle } from '../hooks/usePageTitle.js'
import { useState, useEffect } from 'react'
import { apiRequest } from '../services/api.js'
import { useAuth } from '../hooks/useAuth.js'
import { useToast } from '../hooks/useToast'
import DiscoveryCard from '../components/DiscoveryCard.jsx'
import DiscoveryControls from '../components/DiscoveryControls.jsx'
import AuthFlow from '../components/AuthFlow.jsx'
import RatingPanel from '../components/RatingPanel.jsx'
import Modal from '../components/Modal.jsx'
import { posterUrl } from '../utils/imageUtils.js'

/**
 * Discovery page where users swipe through movie suggestions.
 * @returns {React.ReactElement} The DiscoveryPage component.
 */
export default function DiscoveryPage () {
  const [fetchTrigger, setFetchTrigger] = useState(0)
  const [movies, setMovies] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [error, setError] = useState(null)
  const [canGoBack, setCanGoBack] = useState(false)
  const [isInteracting, setIsInteracting] = useState(false)
  const [showRating, setShowRating] = useState(false)
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const { user } = useAuth()
  const { showToast } = useToast()

  usePageTitle('Discovery')

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const result = await apiRequest('/movies/discover')
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
    loadMovies()
  }, [fetchTrigger])

  const advanceQueue = () => {
    setCurrentIndex(currentIndex + 1)
    setCanGoBack(true)
    if (currentIndex + 5 >= movies.length) {
      setFetchTrigger(prev => prev + 1)
    }
  }

  // Record save/skip interaction and advance to the next movie.
  const handleInteraction = async (type) => {
    if (!requireAuth()) return
    if (type === 'rate') {
      setShowRating(true)
      return
    }
    if (isInteracting) return
    setIsInteracting(true)
    try {
      const body = { movieId: movies[currentIndex].id, interaction: type }
      await apiRequest('/movies/interact', { method: 'POST', body: JSON.stringify(body) })

      advanceQueue()
    } catch (err) {
      console.error(err)
      showToast((err.message || 'Something went wrong. Please try again.'), 'fail')
    } finally {
      setIsInteracting(false)
    }
  }

  // Record rating and advance to the next movie.
  const handleRate = async (rating) => {
    if (!requireAuth()) return
    setShowRating(false)
    try {
      const body = { movieId: movies[currentIndex].id, rating }
      await apiRequest('/ratings', { method: 'POST', body: JSON.stringify(body) })

      advanceQueue()
    } catch (err) {
      console.error(err)
      showToast((err.message || 'Something went wrong. Please try again.'), 'fail')
    }
  }

  // Go back one movie. Only allowed once per forward move.
  const handleBack = () => {
    if (!requireAuth()) return
    if (canGoBack && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setCanGoBack(false)
    }
  }

  const requireAuth = () => {
    if (!user) {
      setIsAuthOpen(true)
      return false
    }
    return true
  }

  return (
    <div className='size-full flex flex-col items-center justify-center gap-4 xl:gap-6 p-4 xl:p-8 overflow-hidden'>
      <div className='relative flex-1 min-h-0'>
        {movies[currentIndex] &&
          <img
            src={posterUrl(movies[currentIndex].poster_path, 500)}
            srcSet={`
              ${posterUrl(movies[currentIndex].poster_path, 300)} 300w,
              ${posterUrl(movies[currentIndex].poster_path, 500)} 500w,
              ${posterUrl(movies[currentIndex].poster_path, 780)} 780w
            `}
            sizes='(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 1200px'
            alt=''
            className='absolute inset-0 size-full object-cover opacity-15 scale-110 xl:scale-125 2xl:scale-150 -top-1/4 mix-blend-screen -z-10 pointer-events-none'
            style={{ filter: 'blur(80px) saturate(1.5)' }}
            loading='eager'
          />}
        <DiscoveryCard movie={movies[currentIndex]} error={error} />
      </div>
      <DiscoveryControls interaction={handleInteraction} handleBack={handleBack} canGoBack={canGoBack} onRate={handleRate} requireAuth={requireAuth} />
      {showRating && (
        <Modal onClose={() => setShowRating(false)}>
          <RatingPanel currentRating={null} onRate={handleRate} title={movies[currentIndex]?.title} />
        </Modal>
      )}
      {isAuthOpen && <AuthFlow onClose={() => setIsAuthOpen(false)} />}
    </div>
  )
}
