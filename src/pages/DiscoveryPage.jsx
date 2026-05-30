import { usePageMetadata } from '../hooks/usePageMetadata.js'
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
import { Film } from 'lucide-react'

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

  usePageMetadata(
    'Discover Movies | Flick',
    'Find your next movie tonight. Personalized recommendations. Swipe to discover.'
  )

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
    <div className='size-full flex flex-col'>
      {/* Mobile */}
      <div className='lg:hidden flex items-center gap-2 p-4'>
        <Film size={28} className='text-brand rotate-90' />
        <h1 className='text-xl font-semibold'>Flick</h1>
      </div>
      <div className='lg:hidden flex flex-col flex-1 min-h-0 justify-center'>

        <div className='flex flex-col items-center justify-center gap-4 px-2 overflow-hidden'>
          <div
            className='relative shrink min-h-0 aspect-2/3'
            style={{
              width: 'min(95vw, calc((100dvh) * 2 / 3))',
              maxHeight: 'calc(100dvh - 150px)'
            }}
          >
            {movies[currentIndex] && (
              <DiscoveryCard movie={movies[currentIndex]} error={error} />
            )}
          </div>
        </div>

        <div className='shrink-0 p-4'>
          <DiscoveryControls
            interaction={handleInteraction}
            handleBack={handleBack}
            canGoBack={canGoBack}
            onRate={handleRate}
            requireAuth={requireAuth}
          />
        </div>
      </div>

      {/* Desktop */}
      <div className='h-full lg:size-full hidden lg:flex flex-col items-center justify-center gap-2 p-4 md:gap-6 md:p-8'>
        <div className='full-size relative flex-1 min-h-0 aspect-2/3'>
          {movies[currentIndex] &&
            <img
              src={posterUrl(movies[currentIndex].poster_path, 300)}
              className='absolute inset-0 size-full object-cover opacity-20 scale-100 xl:scale-125 -top-1/4 mix-blend-screen -z-10 pointer-events-none'
              style={{ filter: 'blur(80px) saturate(1.5)' }}
              loading='eager'
              aria-hidden='true'
            />}
          <DiscoveryCard movie={movies[currentIndex]} error={error} />
        </div>
        <DiscoveryControls interaction={handleInteraction} handleBack={handleBack} canGoBack={canGoBack} onRate={handleRate} requireAuth={requireAuth} />
      </div>

      {showRating && (
        <Modal onClose={() => setShowRating(false)}>
          <RatingPanel currentRating={null} onRate={handleRate} title={movies[currentIndex]?.title} />
        </Modal>
      )}
      {isAuthOpen && <AuthFlow onClose={() => setIsAuthOpen(false)} />}

    </div>
  )
}
