import { MoreHorizontal, ExternalLink, Ban, CheckCircle2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu'
import { useMovieActions } from '../hooks/useMovieActions.js'

const menuItemClass = 'text-nowrap text-base leading-none p-3 pr-4 gap-3 [&_svg]:!size-5 cursor-pointer'

/**
 * Overflow menu for a discovery card (desktop). Renders its own trigger
 * button top-right of the card plus the menu itself. shadcn's
 * DropdownMenu handles positioning, outside-click, keyboard nav, and
 * focus management. Mobile uses OverflowSheet instead.
 * @param {object} props - Component props.
 * @param {number} props.movieId - TMDB movie id.
 * @param {boolean} [props.watched] - Whether the movie is currently marked as watched.
 * @param {(watched: boolean) => void} [props.onWatchedChange] - Called after successful watched toggle.
 * @returns {React.ReactElement} The OverflowMenu component.
 */
export default function OverflowMenu ({ movieId, watched = false, onWatchedChange }) {
  const { viewOnTmdb, dismiss, toggleWatched } = useMovieActions({
    movieId, watched, onWatchedChange
  })

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={
        <button
          aria-label='More options'
          title='More options'
          className='flex items-center justify-center size-11 rounded-full cursor-pointer backdrop-blur-sm bg-black/30 hover:bg-black/50 data-[state=open]:bg-black/40 transition-colors '
        >
          <MoreHorizontal size={24} strokeWidth={2} className='text-foreground' />
        </button>
      }
      />
      <DropdownMenuContent align='end' className='w-max'>
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
