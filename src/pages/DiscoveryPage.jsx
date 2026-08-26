import { useState, useRef, useEffect, useLayoutEffect } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { usePageMetadata } from '../hooks/usePageMetadata.js'
import { useAuth } from '../hooks/useAuth.js'
import { useToast } from '../hooks/useToast.js'
import { useDiscoveryQueue } from '../hooks/useDiscoveryQueue.js'
import useWheelNavigation from '../hooks/useWheelNavigation.js'
import DiscoveryCard from '../components/DiscoveryCard.jsx'
import DiscoveryActions from '../components/DiscoveryActions.jsx'
import MobileActionRail from '../components/MobileActionRail.jsx'
import AuthFlow from '../components/AuthFlow.jsx'
import { posterUrl } from '../utils/imageUtils.js'
import { ChevronDown, ChevronUp } from 'lucide-react'
import IconButton from '../components/IconButton.jsx'

const cardVariants = {
  enter: (d) => ({ y: d > 0 ? '100vh' : '-100vh' }),
  center: { y: 0 },
  exit: (d) => ({ y: d > 0 ? '-100vh' : '100vh' })
}

/**
 * Discovery page. Mobile: full-bleed scroll-snap deck with action-rail overlay.
 * Desktop: centered card with animated transitions, actions beside it.
 * @returns {React.ReactElement} The DiscoveryPage component.
 */
export default function DiscoveryPage () {
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [direction, setDirection] = useState(1)
  const [preferredSlide, setPreferredSlide] = useState(0)
  const prefersReducedMotion = useReducedMotion()
  const { user } = useAuth()
  const { showToast } = useToast()
  const { currentMovie, prevMovie, nextMovie, canGoBack, back, toggleSave, setRating, next, error, updateCurrent } = useDiscoveryQueue()

  const scrollRef = useRef(null)
  const currentRef = useRef(null)
  const desktopRef = useRef(null)
  const isResettingRef = useRef(false)

  usePageMetadata(
    'Discover Movies | Flick',
    'Find your next movie tonight. Personalized recommendations. Swipe to discover.'
  )

  useEffect(() => {
    if (error) showToast(error, 'fail')
  }, [error, showToast])

  const requireAuth = () => {
    if (!user) {
      setIsAuthOpen(true)
      return false
    }
    return true
  }

  const handleSave = async () => {
    if (!requireAuth()) return
    try {
      await toggleSave()
    } catch (err) {
      console.error(err)
      showToast(err.message || 'Something went wrong. Please try again.', 'fail')
    }
  }

  const handleRate = async (rating) => {
    if (!requireAuth()) return
    try {
      await setRating(rating)
    } catch (err) {
      console.error(err)
      showToast(err.message || 'Something went wrong. Please try again.', 'fail')
    }
  }

  const handleWatchedChange = (newWatched) => {
    updateCurrent({ watched: newWatched })
  }

  const handleAdvance = () => {
    setDirection(1)
    next(true)
  }

  const handleNext = () => {
    setDirection(1)
    next()
  }

  const handleBack = () => {
    if (!canGoBack) return
    setDirection(-1)
    back()
  }

  const cards = [prevMovie, currentMovie, nextMovie].filter(Boolean)
  const currentIndexInWindow = prevMovie ? 1 : 0

  const cardContainerRef = useRef(null)

  useLayoutEffect(() => {
    const el = cardContainerRef.current
    if (!el) return
    const parent = el.parentElement
    if (!parent) return

    const setSize = () => {
      const parentHeight = parent.getBoundingClientRect().height
      const idealWidth = Math.floor(parentHeight * 2 / 3)
      el.style.width = `${idealWidth}px`
      el.style.height = `${Math.floor(idealWidth * 3 / 2)}px`
    }

    setSize()
    const ro = new ResizeObserver(setSize)
    ro.observe(parent)
    return () => ro.disconnect()
  }, [])

  // Mobile: keep the scroll container aligned with the current card
  // whenever it changes — covers dismiss, watched, and any other
  // programmatic advance triggered outside of native scroll.
  // isResettingRef guards the scrollend handler from treating this
  // programmatic scroll as a user swipe.
  useLayoutEffect(() => {
    const container = scrollRef.current
    const currentEl = currentRef.current
    if (!container || !currentEl) return
    isResettingRef.current = true
    container.scrollTop = currentEl.offsetTop
    requestAnimationFrame(() => { isResettingRef.current = false })
  }, [currentMovie?.id])

  const navRef = useRef({ handleNext, handleBack })
  useEffect(() => {
    navRef.current = { handleNext, handleBack }
  })

  useEffect(() => {
    const container = scrollRef.current
    if (!container) return

    let cooldown = false

    const handleScrollEnd = () => {
      if (isResettingRef.current || cooldown) return
      const currentEl = currentRef.current
      if (!currentEl) return
      const delta = container.scrollTop - currentEl.offsetTop
      if (Math.abs(delta) < currentEl.offsetHeight / 3) return

      cooldown = true
      if (delta > 0) navRef.current.handleNext()
      else navRef.current.handleBack()
      setTimeout(() => { cooldown = false }, 650)
    }

    container.addEventListener('scrollend', handleScrollEnd)
    return () => container.removeEventListener('scrollend', handleScrollEnd)
  }, [])

  useWheelNavigation({
    onNext: handleNext,
    onPrev: handleBack,
    containerRef: desktopRef,
    gracePeriod: 500
  })

  return (
    <>
      {/* Mobile */}
      <div className='lg:hidden size-full relative'>
        <div
          ref={scrollRef}
          style={{ scrollbarWidth: 'none' }}
          className='size-full overflow-y-scroll snap-y snap-mandatory overscroll-contain [&::-webkit-scrollbar]:hidden'
        >
          {cards.map((movie, i) => (
            <div
              key={movie.id}
              ref={i === currentIndexInWindow ? currentRef : null}
              className='h-full snap-start snap-always'
            >
              <DiscoveryCard
                movie={movie}
                compact
                initialSlide={preferredSlide}
                onSlideChange={setPreferredSlide}
                onWatchedChange={i === currentIndexInWindow ? handleWatchedChange : undefined}
                onAdvance={i === currentIndexInWindow ? handleAdvance : undefined}
              />
            </div>
          ))}
        </div>
        <div className='absolute right-4 bottom-4 z-98'>
          <MobileActionRail
            saved={currentMovie?.saved}
            rating={currentMovie?.user_rating}
            onSave={handleSave}
            onRate={handleRate}
          />
        </div>
      </div>

      {/* Desktop */}
      <div ref={desktopRef} className='hidden lg:flex size-full flex-col items-center justify-center py-6 gap-2 relative overflow-hidden'>
        <div className='min-h-0 gap-4 h-full flex items-center justify-center'>
          <div ref={cardContainerRef} className='relative'>
            {currentMovie && (
              <img
                src={posterUrl(currentMovie.poster_path, 92)}
                className='absolute left-1/2 top-2/5 -translate-x-1/2 -translate-y-1/2 h-full object-cover opacity-20 2xl:scale-125 mix-blend-screen -z-10 pointer-events-none'
                style={{ filter: 'blur(80px) saturate(1.5)' }}
                loading='eager'
                aria-hidden='true'
                decoding='async'
              />
            )}
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={currentMovie?.id ?? 'empty'}
                custom={direction}
                variants={cardVariants}
                initial='enter'
                animate='center'
                exit='exit'
                transition={prefersReducedMotion
                  ? { duration: 0 }
                  : { duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
                style={{ willChange: 'transform' }}
                className='absolute inset-0 rounded-2xl overflow-hidden'
              >
                <DiscoveryCard
                  movie={currentMovie}
                  error={error}
                  initialSlide={preferredSlide}
                  onSlideChange={setPreferredSlide}
                  onWatchedChange={handleWatchedChange}
                  onAdvance={handleAdvance}
                />
              </motion.div>
            </AnimatePresence>
          </div>
          <DiscoveryActions
            saved={currentMovie?.saved}
            rating={currentMovie?.user_rating}
            onSave={handleSave}
            onRate={handleRate}
          />
        </div>

        <div className='flex flex-col items-center gap-3 fixed right-4 top-1/2 -translate-y-1/2'>
          <IconButton
            onClick={handleBack} disabled={!canGoBack} icon={ChevronUp}
            ghost hoverBg='hover:bg-white/10' textColor='text-gray-400'
            strokeWidth={2} size='sm' aria-label='Previous' title='Previous'
          />
          <IconButton
            onClick={handleNext} icon={ChevronDown}
            ghost hoverBg='hover:bg-white/10' textColor='text-gray-400'
            strokeWidth={2} size='sm' aria-label='Next' title='Next'
          />
        </div>
      </div>

      <AuthFlow isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  )
}
