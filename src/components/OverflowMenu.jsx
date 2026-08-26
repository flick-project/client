import { MoreHorizontal, ExternalLink, Ban, CheckCircle2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu'
import { useMovieActions } from '../hooks/useMovieActions.js'

const menuItemClass = 'px-3 py-2.5 text-base gap-3 [&_svg]:size-5 cursor-pointer'

/**
 * Overflow menu for a discovery card (desktop). Renders its own trigger
 * button top-right of the card plus the menu itself. shadcn's
 * DropdownMenu handles positioning, outside-click, keyboard nav, and
 * focus management. Mobile uses OverflowSheet instead.
 * @param {object} props - Component props.
 * @param {number} props.movieId - TMDB movie id.
 * @param {boolean} [props.watched] - Whether the movie is currently marked as watched.
 * @param {(watched: boolean) => void} [props.onWatchedChange] - Called after successful watched toggle.
 * @param {() => void} [props.onAdvance] - Called to advance the queue.
 * @returns {React.ReactElement} The OverflowMenu component.
 */
export default function OverflowMenu ({ movieId, watched = false, onWatchedChange, onAdvance }) {
  const { viewOnTmdb, dismiss, toggleWatched } = useMovieActions({
    movieId, watched, onWatchedChange, onAdvance
  })

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={
        <button
          aria-label='More options'
          title='More options'
          className='flex items-center justify-center size-11 rounded-full cursor-pointer bg-black/40 hover:bg-black/60 data-[state=open]:bg-black/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
        >
          <MoreHorizontal size={24} strokeWidth={2} className='text-white drop-shadow-sm/60' />
        </button>
      }
      />
      <DropdownMenuContent align='end' className='min-w-56'>
        <DropdownMenuItem onClick={viewOnTmdb} className={menuItemClass}>
          <ExternalLink aria-hidden='true' />
          View on TMDB
        </DropdownMenuItem>
        <DropdownMenuItem onClick={dismiss} className={menuItemClass}>
          <Ban aria-hidden='true' />
          Not interested
        </DropdownMenuItem>
        <DropdownMenuItem onClick={toggleWatched} className={menuItemClass}>
          <CheckCircle2 aria-hidden='true' />
          {watched ? 'Remove from watched' : 'Mark as watched'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
