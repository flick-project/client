import { useRef, useEffect, useLayoutEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { AuthRequiredError } from '@/utils/errors.js'
import { usePageMetadata } from '../hooks/usePageMetadata.js'
import { useDiscoveryQueue } from '../hooks/useDiscoveryQueue.js'
import { toast } from 'sonner'
import { posterUrl } from '../utils/imageUtils.js'
import { ChevronDown, ChevronUp } from 'lucide-react'
import useWheelNavigation from '../hooks/useWheelNavigation.js'
import DiscoveryCard from '../components/DiscoveryCard.jsx'
import DiscoveryActions from '../components/DiscoveryActions.jsx'
import MobileActionRail from '../components/MobileActionRail.jsx'
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
  const [preferredSlide, setPreferredSlide] = useState(0)
  const prefersReducedMotion = useReducedMotion()
  const {
    currentMovie, prevMovie, nextMovie, canGoBack, lastDirection,
    back, toggleSave, setRating, next, error, updateCurrent
  } = useDiscoveryQueue()

  const scrollRef = useRef(null)
  const currentRef = useRef(null)
  const desktopRef = useRef(null)
  const isResettingRef = useRef(false)

  usePageMetadata(
    'Discover Movies | Flick',
    'Find your next movie tonight. Personalized recommendations. Swipe to discover.'
  )

  useEffect(() => {
    if (error) toast.error(error)
  }, [error])

  // Handlers catch AuthRequiredError silently (auth modal already open)
  // and surface API errors as toasts. Animation direction is driven by
  // the reducer via lastDirection — handlers don't touch it.

  const handleSave = async () => {
    try {
      await toggleSave()
    } catch (err) {
      if (err instanceof AuthRequiredError) return
      console.error(err)
      toast.error(err.message || 'Something went wrong. Please try again.')
    }
  }

  const handleRate = async (rating) => {
    try {
      await setRating(rating)
    } catch (err) {
      if (err instanceof AuthRequiredError) return
      console.error(err)
      toast.error(err.message || 'Something went wrong. Please try again.')
    }
  }

  const handleWatchedChange = (newWatched) => {
    try {
      updateCurrent({ watched: newWatched })
    } catch (err) {
      if (err instanceof AuthRequiredError) return
      throw err
    }
  }

  const handleAdvance = () => {
    try {
      next(true)
    } catch (err) {
      if (err instanceof AuthRequiredError) return
      throw err
    }
  }

  const handleNext = () => {
    try {
      next()
    } catch (err) {
      if (err instanceof AuthRequiredError) return
      throw err
    }
  }

  const handleBack = () => {
    if (!canGoBack) return
    try {
      back()
    } catch (err) {
      if (err instanceof AuthRequiredError) return
      throw err
    }
  }

  const cards = [prevMovie, currentMovie, nextMovie].filter(Boolean)
  const currentIndexInWindow = prevMovie ? 1 : 0

  const cardContainerRef = useRef(null)
  const cardAreaRef = useRef(null)
  const railRef = useRef(null)

  useLayoutEffect(() => {
    const area = cardAreaRef.current
    const el = cardContainerRef.current
    if (!area || !el) return

    const setSize = () => {
      const { width: aw, height: ah } = area.getBoundingClientRect()
      const rail = railRef.current.getBoundingClientRect().width
      const cs = getComputedStyle(area)
      const gap = parseFloat(cs.columnGap) || 0
      const padX = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight)
      const availableWidth = aw - padX - 2 * rail - 2 * gap
      const width = Math.floor(Math.min(availableWidth, ah * 2 / 3))
      const height = Math.floor(width * 3 / 2)
      el.style.width = `${width}px`
      el.style.height = `${height}px`
    }

    setSize()
    const ro = new ResizeObserver(setSize)
    ro.observe(area)
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
                isFirst={i === currentIndexInWindow}
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
      <div ref={desktopRef} className='hidden lg:flex size-full flex-col relative overflow-hidden p-4'>
        {currentMovie && (
          <img
            src={posterUrl(currentMovie.poster_path, 185)}
            className='absolute left-1/2 top-[40%] -translate-x-1/2 -translate-y-1/2 h-full object-cover opacity-20 xl:scale-100 2xl:scale-115 mix-blend-screen pointer-events-none'
            style={{ filter: 'blur(80px) saturate(1.5)' }}
            aria-hidden='true'
            fetchPriority='high'
            loading='eager'
            decoding='async'
          />
        )}

        {/* Symmetric rail | card | rail keeps the card visually centered no matter how wide the actions get. */}
        <div ref={cardAreaRef} className='relative flex-1 min-h-0 flex items-center justify-center gap-4 px-4'>
          <div aria-hidden='true' ref={railRef} className='w-14 shrink-0' />

          <div className='h-full flex items-center justify-center shrink-0'>
            <div ref={cardContainerRef} className='relative'>
              <AnimatePresence initial={false} custom={lastDirection}>
                <motion.div
                  key={currentMovie?.id ?? 'empty'}
                  custom={lastDirection}
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
                    isFirst
                    initialSlide={preferredSlide}
                    onSlideChange={setPreferredSlide}
                    onWatchedChange={handleWatchedChange}
                    onAdvance={handleAdvance}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <aside className='w-14 shrink-0 flex justify-center'>
            <DiscoveryActions
              saved={currentMovie?.saved}
              rating={currentMovie?.user_rating}
              onSave={handleSave}
              onRate={handleRate}
            />
          </aside>
        </div>

        {/* Arrows pinned to viewport right; they sit inside the 16rem
        phantom column reserved by AppLayout's `centered` prop. */}
        <div className='fixed right-4 top-1/2 -translate-y-1/2 flex flex-col gap-3'>
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
    </>
  )
}
