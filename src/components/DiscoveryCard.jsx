import { useState, useEffect, useRef, useLayoutEffect, useMemo } from 'react'
import { useLongPress } from 'react-aria/useLongPress'
import { Sheet } from 'react-modal-sheet'
import { Star, Play, ArrowLeft } from 'lucide-react'
import { GENRES } from '../utils/genres.js'
import { useTrailer } from '../hooks/useTrailer.js'
import DiscoveryCardPosterSlide from './DiscoveryCardPosterSlide.jsx'
import DiscoveryCardTrailerSlide from './DiscoveryCardTrailerSlide.jsx'
import DiscoveryCardInfoPanel from './DiscoveryCardInfoPanel.jsx'
import OverflowMenu from './OverflowMenu.jsx'
import OverflowSheet from './OverflowSheet.jsx'

const LONG_PRESS_MS = 450

const topBtnClass = 'flex items-center justify-center size-11 rounded-full cursor-pointer bg-black/40 hover:bg-black/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'

/**
 * Movie card with a two-slide carousel: poster (default) and trailer.
 * Desktop: overflow menu top-right (button trigger). Mobile: long-press
 * anywhere on the card opens OverflowSheet (Instagram/TikTok pattern).
 * Long-press is handled by react-aria's useLongPress which normalizes
 * across browsers, handles pointer capture, and blocks native context menu.
 * InfoPanel is stationary across slide changes.
 * @param {object} props - The component props.
 * @param {object} props.movie - Movie data.
 * @param {string} [props.error] - Error message if fetch failed.
 * @param {boolean} [props.compact] - Mobile layout.
 * @param {boolean} [props.isFirst] - Determines if this card should load first.
 * @param {number} [props.initialSlide] - Slide to mount on (0=poster, 1=trailer).
 * @param {(index: number) => void} [props.onSlideChange] - Called when active slide changes.
 * @param {(watched: boolean) => void} [props.onWatchedChange] - Called after successful watched toggle.
 * @param {() => void} [props.onAdvance] - Called to advance the queue.
 * @returns {React.ReactElement} The DiscoveryCard component.
 */
export default function DiscoveryCard ({ movie, error, compact = false, isFirst = false, initialSlide = 0, onSlideChange, onWatchedChange, onAdvance }) {
  const [expanded, setExpanded] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [overflowOpen, setOverflowOpen] = useState(false)
  const [activeSlide, setActiveSlide] = useState(initialSlide)

  const carouselRef = useRef(null)
  const trailerKey = useTrailer(movie?.id)
  const slideCount = trailerKey ? 2 : 1

  const { longPressProps } = useLongPress({
    isDisabled: !compact,
    threshold: LONG_PRESS_MS,
    accessibilityDescription: 'Long press for more options',
    onLongPress: () => {
      setOverflowOpen(true)
      if (navigator.vibrate && 'ontouchstart' in window && navigator.maxTouchPoints > 0) {
        try { navigator.vibrate(10) } catch { /* ignore */ }
      }
    }
  })

  useEffect(() => {
    const el = carouselRef.current
    if (!el || slideCount < 2) return
    const onScroll = () => {
      const index = Math.round(el.scrollLeft / el.clientWidth)
      setActiveSlide(index)
      onSlideChange?.(index)
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [slideCount, onSlideChange])

  useLayoutEffect(() => {
    const el = carouselRef.current
    if (!el || slideCount < 2) return
    const target = Math.min(initialSlide, slideCount - 1)
    el.scrollLeft = target * el.clientWidth
  }, [slideCount, movie?.id, initialSlide])

  const detailContent = useMemo(() => {
    if (!movie) return null
    const voteAverage = Number(movie.vote_average) || 0
    const genreIds = movie.genre_ids ?? []
    const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : null
    const director = movie.credits?.find(c => c.role === 'director')
    const cast = movie.credits?.filter(c => c.role === 'cast').map(c => c.name).join(', ')
    const hasCredits = director || cast

    return (
      <div className='flex flex-col gap-3 p-4 pb-6'>
        <h2 className='text-xl font-semibold text-white leading-snug'>{movie.title}</h2>
        <div className='flex items-center gap-2 text-sm text-gray-400 flex-wrap'>
          {voteAverage > 0 && (
            <span className='flex items-center gap-1 font-medium text-gray-200'>
              <Star size={14} className='fill-yellow-400 text-yellow-400' aria-hidden='true' />
              {voteAverage.toFixed(1)}
            </span>
          )}
          {releaseYear && (
            <span className='flex items-center gap-2'>
              <span className='text-gray-600' aria-hidden='true'>·</span>
              <span>{releaseYear}</span>
            </span>
          )}
          {genreIds.slice(0, 2).map(id => (
            <span key={id} className='flex items-center gap-2'>
              <span className='text-gray-600' aria-hidden='true'>·</span>
              <span>{GENRES[id]}</span>
            </span>
          ))}
        </div>
        {movie.overview && (
          <p className='text-sm text-white leading-relaxed'>{movie.overview}</p>
        )}
        {hasCredits && (
          <div className='flex flex-col gap-1.5 pt-3 text-sm'>
            {director && (
              <p><span className='text-gray-400'>Director </span><span className='text-gray-200'>{director.name}</span></p>
            )}
            {cast && (
              <p><span className='text-gray-400'>Cast </span><span className='text-gray-200'>{cast}</span></p>
            )}
          </div>
        )}
      </div>
    )
  }, [movie])

  if (error) {
    return (
      <div className='size-full flex flex-col items-center justify-center gap-3 bg-surface-light p-6'>
        <p className='text-sm text-gray-300 text-center'>Couldn't load this movie.</p>
      </div>
    )
  }

  if (!movie) {
    return <div className='size-full bg-surface-light animate-pulse' aria-hidden='true' />
  }

  const scrollToSlide = (index) => {
    const el = carouselRef.current
    if (!el) return
    el.scrollTo({ left: index * el.clientWidth, behavior: 'smooth' })
    if (expanded) setExpanded(false)
  }

  const toggleExpand = () => setExpanded(prev => !prev)
  const openSheet = () => setSheetOpen(true)

  return (
    <div
      {...longPressProps}
      className='relative size-full overflow-hidden bg-black'
    >
      {compact && (
        <>
          {slideCount > 1 && (
            <div
              className='absolute top-0 left-0 right-0 h-16 bg-linear-to-b from-black/25 to-transparent pointer-events-none z-20'
              aria-hidden='true'
            />
          )}

          {slideCount > 1 && (
            <div className='absolute top-2 left-2 right-2 lg:left-4 lg:right-4 z-30 flex items-center gap-1'>
              {Array.from({ length: slideCount }).map((_, i) => (
                <button
                  key={i}
                  type='button'
                  onClick={() => scrollToSlide(i)}
                  aria-label={i === 0 ? 'Show poster' : 'Show trailer'}
                  aria-current={i === activeSlide ? 'true' : undefined}
                  className='flex-1 h-1 rounded-full bg-black/30 overflow-hidden cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                >
                  <span
                    className={`block h-full rounded-full transition-colors ${i === activeSlide ? 'bg-white' : 'bg-white/40'}`}
                  />
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {!compact && (
        <div className='absolute w-full top-0 p-4 z-30 flex justify-between gap-3'>
          {slideCount > 1 && activeSlide === 1 && (
            <button
              type='button'
              onClick={() => scrollToSlide(0)}
              aria-label='Exit trailer'
              title='Exit trailer'
              className={topBtnClass}
            >
              <ArrowLeft size={24} strokeWidth={2} className='text-white drop-shadow-sm/50' aria-hidden='true' />
            </button>
          )}

          <div className='flex items-center gap-3 ml-auto'>
            {trailerKey && activeSlide === 0 && (
              <button
                type='button'
                onClick={() => scrollToSlide(1)}
                aria-label='Show trailer'
                title='Show trailer'
                className={topBtnClass}
              >
                <Play size={22} strokeWidth={2} className='text-white drop-shadow-sm/50' fill='currentColor' aria-hidden='true' />
              </button>
            )}
            <OverflowMenu
              movieId={movie.id}
              watched={movie.watched}
              onWatchedChange={onWatchedChange}
              onAdvance={onAdvance}
            />
          </div>
        </div>
      )}

      <div
        ref={carouselRef}
        style={{ scrollbarWidth: 'none' }}
        className='absolute inset-0 flex overflow-x-auto overflow-y-hidden snap-x snap-mandatory overscroll-x-contain bg-black [&::-webkit-scrollbar]:hidden'
      >
        <DiscoveryCardPosterSlide
          movie={movie}
          compact={compact}
          expanded={expanded}
          isFirst={isFirst}
        />
        {trailerKey && (
          <DiscoveryCardTrailerSlide
            movie={movie}
            trailerKey={trailerKey}
          />
        )}
      </div>

      <DiscoveryCardInfoPanel
        movie={movie}
        compact={compact}
        expanded={expanded}
        onToggleExpand={toggleExpand}
        onOpenSheet={openSheet}
        minimal={activeSlide === 1}
      />

      {compact && (
        <>
          <Sheet
            isOpen={sheetOpen}
            onClose={() => setSheetOpen(false)}
            snapPoints={[0, 1]}
            initialSnap={1}
            detent='content'
          >
            <Sheet.Container className='bg-surface-light! rounded-t-xl!'>
              <Sheet.Header />
              <Sheet.Content>{detailContent}</Sheet.Content>
            </Sheet.Container>
            <Sheet.Backdrop onTap={() => setSheetOpen(false)} />
          </Sheet>

          <OverflowSheet
            open={overflowOpen}
            onOpenChange={setOverflowOpen}
            movieId={movie.id}
            watched={movie.watched}
            onWatchedChange={onWatchedChange}
            onAdvance={onAdvance}
          />
        </>
      )}
    </div>
  )
}
