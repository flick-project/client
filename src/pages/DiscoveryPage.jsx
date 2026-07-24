import { useState } from 'react'
import { usePageMetadata } from '../hooks/usePageMetadata.js'
import { useAuth } from '../hooks/useAuth.js'
import { useToast } from '../hooks/useToast'
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
  const { user } = useAuth()
  const { showToast } = useToast()
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
      setIsRatingOpen(false)
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
      setIsRatingOpen(false)
      setIsAuthOpen(true)
      return false
    }
    return true
  }

  return (
    <div className='h-full grid grid-rows-[minmax(0,1fr)_auto] pt-4 pb-2 lg:p-6 gap-2 lg:gap-4 relative'>
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
        <div className='aspect-2/3 size-full max-w-full lg:w-auto'>
          <DiscoveryCard movie={currentMovie} error={error} className='bg-white/80' />
        </div>
      </div>
      <DiscoveryControls
        interaction={handleInteraction}
        handleBack={back}
        canGoBack={canGoBack}
        onRate={handleRate}
        requireAuth={requireAuth}
      />
      <Modal isOpen={isRatingOpen && user !== null} onClose={() => setIsRatingOpen(false)}>
        <RatingPanel currentRating={null} onRate={handleRate} onDismiss={handleInteraction} title={currentMovie?.title} />
      </Modal>
      <AuthFlow isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  )
}
