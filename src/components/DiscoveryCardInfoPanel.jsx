import { useState, useRef, useLayoutEffect, useMemo } from 'react'
import { Star, ChevronDown, ChevronUp } from 'lucide-react'
import { GENRES } from '../utils/genres.js'

/**
 * Bottom-anchored info panel for a discovery card.
 * Shows title, rating, year, genres, and overview. On desktop, expands
 * inline to reveal the full overview and credits; on mobile, tapping
 * opens a bottom sheet with the full details instead.
 *
 * When `minimal` is true (trailer slide), shows only title + rating
 * with a lighter scrim so the trailer stays the focus.
 *
 * Interactive activation is handled by a transparent button that spans
 * the panel below the content — this avoids nesting interactive
 * elements (the expand chevron would be nested otherwise).
 * @param {object} props - The component props.
 * @param {object} props.movie - Movie data.
 * @param {boolean} props.compact - Mobile layout.
 * @param {boolean} props.expanded - Desktop expanded state, driven by the parent.
 * @param {boolean} [props.minimal] - When true, renders a slim variant with only title + rating.
 * @param {() => void} props.onToggleExpand - Called to flip the expanded state (desktop).
 * @param {() => void} props.onOpenSheet - Called to open the details sheet (mobile).
 * @returns {React.ReactElement} The info panel.
 */
export default function DiscoveryCardInfoPanel ({ movie, compact, expanded, minimal = false, onToggleExpand, onOpenSheet }) {
  const overviewRef = useRef(null)
  const [isOverflowing, setIsOverflowing] = useState(false)

  const overview = movie.overview ?? ''
  const voteAverage = Number(movie.vote_average) || 0
  const genreIds = movie.genre_ids ?? []
  const releaseYear = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : null

  const { director, cast, hasCredits } = useMemo(() => {
    const d = movie.credits?.find(c => c.role === 'director')
    const c = movie.credits?.filter(c => c.role === 'cast').map(c => c.name).join(', ')
    return { director: d, cast: c, hasCredits: !!(d || c) }
  }, [movie.credits])

  const hasMore = isOverflowing || hasCredits
  const isInteractive = !minimal && (compact || hasMore || expanded)

  useLayoutEffect(() => {
    if (expanded || minimal) return
    const el = overviewRef.current
    if (!el) return
    const check = () => setIsOverflowing(el.scrollHeight > el.clientHeight + 1)
    check()
    const obs = new ResizeObserver(check)
    obs.observe(el)
    return () => obs.disconnect()
  }, [overview, compact, expanded, minimal])

  const handleActivate = () => {
    if (compact) {
      onOpenSheet()
    } else if (hasMore || expanded) {
      onToggleExpand()
    }
  }

  const panelLabel = compact
    ? `${movie.title}, tap for details`
    : expanded ? 'Collapse details' : 'Expand details'

  return (
    <div className={`absolute inset-x-0 bottom-0 z-10 max-lg:pr-22 ${isInteractive ? 'select-none' : ''}`}>
      {/* Transparent activation button behind the content. Interactive
          child buttons (expand chevron) sit above via z-index and win
          click precedence — no nested interactives. */}
      {isInteractive && (
        <button
          type='button'
          onClick={handleActivate}
          aria-label={panelLabel}
          aria-expanded={!compact && hasMore ? expanded : undefined}
          className='absolute inset-0 z-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring rounded-lg'
        />
      )}

      <div className='relative pointer-events-none flex flex-col gap-3 pl-4 pb-4 lg:p-6 text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.8)]'>
        <h1 className={`text-xl lg:text-2xl font-semibold leading-tight ${!minimal ? 'pr-14' : ''}`}>
          {movie.title}
        </h1>

        {!minimal && !compact && (hasMore || expanded) && (
          <button
            type='button'
            onClick={onToggleExpand}
            aria-label={expanded ? 'Collapse details' : 'Expand details'}
            aria-expanded={expanded}
            title={expanded ? 'Collapse' : 'Expand'}
            className='pointer-events-auto absolute top-5 right-5 z-10 flex items-center justify-center size-11 rounded-full text-white hover:bg-white/10 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
          >
            {expanded
              ? <ChevronDown className='size-6 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]' strokeWidth={2.5} aria-hidden='true' />
              : <ChevronUp className='size-6 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]' strokeWidth={2.5} aria-hidden='true' />}
          </button>
        )}

        <div className='flex items-center gap-3 flex-wrap text-sm'>
          {voteAverage > 0 && (
            <span className='flex items-center gap-1.5' aria-label={`Rating ${voteAverage.toFixed(1)} out of 10`}>
              <Star className='size-4 fill-brand text-brand' aria-hidden='true' />
              <span className='font-medium leading-none text-white' aria-hidden='true'>{voteAverage.toFixed(1)}</span>
            </span>
          )}
          {releaseYear && (
            <span className='text-white leading-none'>{releaseYear}</span>
          )}
          <span className='flex gap-1.5 flex-wrap' aria-label='Genres'>
            {genreIds.slice(0, 2).map(id => (
              <span key={id} className='px-2 py-1 text-xs rounded-full bg-white/25 ring-1 ring-white/20 backdrop-blur-sm leading-none whitespace-nowrap'>
                {GENRES[id]}
              </span>
            ))}
          </span>
        </div>

        {!minimal && overview && (
          <p
            ref={overviewRef}
            className={`text-sm lg:text-base text-white leading-relaxed ${!expanded ? 'line-clamp-2' : ''}`}
          >
            {overview}
          </p>
        )}

        {!minimal && !compact && expanded && hasCredits && (
          <div className='flex flex-col gap-1.5 text-sm lg:text-base text-white'>
            {director && (
              <p>
                <span className='text-gray-400'>Directed by </span>
                <span>{director.name}</span>
              </p>
            )}
            {cast && (
              <p>
                <span className='text-gray-400'>Cast </span>
                <span>{cast}</span>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
