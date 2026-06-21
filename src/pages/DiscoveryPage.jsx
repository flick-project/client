import { usePageMetadata } from '../hooks/usePageMetadata.js'
import { useState } from 'react'
import { useAuth } from '../hooks/useAuth.js'
import { useToast } from '../hooks/useToast'
import { useDiscoveryQueue } from '../hooks/useDiscoveryQueue.js'
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
              maxHeight: 'max-calc(100dvh - 150px) md:calc(100dvh - 275px)'
            }}
          >
            {currentMovie && (
              <DiscoveryCard movie={currentMovie} error={error} />
            )}
          </div>
        </div>

        <div className='shrink-0 p-4'>
          <DiscoveryControls
            interaction={handleInteraction}
            handleBack={back}
            canGoBack={canGoBack}
            onRate={handleRate}
            requireAuth={requireAuth}
          />
        </div>
      </div>

      {/* Desktop */}
      <div className='h-full lg:size-full hidden lg:flex flex-col items-center justify-center gap-2 p-4 md:gap-6 md:p-8'>
        <div className='full-size relative flex-1 min-h-0 aspect-2/3'>
          {currentMovie &&
            <img
              src={posterUrl(currentMovie.poster_path, 300)}
              className='absolute inset-0 size-full object-cover opacity-20 scale-100 xl:scale-125 -top-1/4 mix-blend-screen -z-10 pointer-events-none'
              style={{ filter: 'blur(80px) saturate(1.5)' }}
              loading='eager'
              aria-hidden='true'
            />}
          <DiscoveryCard movie={currentMovie} error={error} />
        </div>
        <DiscoveryControls interaction={handleInteraction} handleBack={back} canGoBack={canGoBack} onRate={handleRate} requireAuth={requireAuth} />
      </div>

      <Modal isOpen={isRatingOpen} onClose={() => setIsRatingOpen(false)}>
        <RatingPanel currentRating={null} onRate={handleRate} title={currentMovie?.title} />
      </Modal>

      <Modal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)}>
        <AuthFlow onClose={() => setIsAuthOpen(false)} />
      </Modal>
    </div>
  )
}
