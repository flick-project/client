import { useState, useCallback } from 'react'
import { usePageMetadata } from '../hooks/usePageMetadata.js'
import { useAuth } from '../hooks/useAuth.js'
import { useToast } from '../hooks/useToast'
import { useDiscoveryTour } from '../hooks/useTour.js'
import { useDiscoveryQueue } from '../hooks/useDiscoveryQueue.js'
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
  const [isRatingOpen, setIsRatingOpen] = useState(false)
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const { user, loading } = useAuth()
  const { showToast } = useToast()
  const { startTour } = useDiscoveryTour()
  const { currentMovie, canGoBack, back, interact, rate, error } = useDiscoveryQueue()

  usePageMetadata(
    'Discover Movies | Flick',
    'Find your next movie tonight. Personalized recommendations. Swipe to discover.'
  )

  // Record save/skip interaction and advance to the next movie.
  const handleInteraction = async (type) => {
    if (!requireAuth()) return
    if (type === 'rate') { setIsRatingOpen(true); return }
    try {
      await interact(type)
    } catch (err) {
      console.error(err)
      showToast((err.message || 'Something went wrong. Please try again.'), 'fail')
    }
  }

  // Record rating and advance to the next movie.
  const handleRate = async (rating) => {
    if (!requireAuth()) return
    try {
      await rate(rating)
      setIsRatingOpen(false)
    } catch (err) {
      console.error(err)
      showToast((err.message || 'Something went wrong. Please try again.'), 'fail')
    }
  }

  const requireAuth = () => {
    if (!user) {
      setIsAuthOpen(true)
      return false
    }
    return true
  }

  const controlsRef = useCallback((node) => {
    if (node && !loading && user) startTour()
  }, [loading, user, startTour])

  return (
    <div className='h-full grid grid-rows-[minmax(0,1fr)_auto] p-4 lg:p-8 gap-4 lg:gap-6 relative'>
      {currentMovie && (
        <img
          src={posterUrl(currentMovie.poster_path, 92)}
          className='hidden motion-reduce:hidden lg:block absolute left-1/2 -top-1/5 transform -translate-x-1/2 h-full object-cover opacity-20 scale-100 2xl:scale-115 mix-blend-screen -z-10 pointer-events-none'
          style={{ filter: 'blur(80px) saturate(1.5)' }}
          loading='eager'
          aria-hidden='true'
        />
      )}
      <div className='min-h-0 flex items-center justify-center overflow-hidden'>
        <div className='aspect-2/3 h-full max-w-full lg:w-auto'>
          <DiscoveryCard movie={currentMovie} error={error} className='bg-white/80' />
        </div>
      </div>
      <DiscoveryControls
        ref={controlsRef}
        interaction={handleInteraction}
        handleBack={back}
        canGoBack={canGoBack}
        onRate={handleRate}
        requireAuth={requireAuth}
      />
      <Modal isOpen={isRatingOpen} onClose={() => setIsRatingOpen(false)}>
        <RatingPanel currentRating={null} onRate={handleRate} title={currentMovie?.title} />
      </Modal>
      <Modal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)}>
        <AuthFlow onClose={() => setIsAuthOpen(false)} />
      </Modal>
    </div>
  )
}
