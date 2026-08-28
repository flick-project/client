import { Sheet } from 'react-modal-sheet'
import { ExternalLink, Ban, CheckCircle2 } from 'lucide-react'
import { useMovieActions } from '../hooks/useMovieActions.js'

/**
 * Bottom sheet with movie overflow actions (mobile). Same actions as
 * desktop OverflowMenu but presented as a native-feeling bottom sheet
 * triggered by long-press on the card, matching Instagram/TikTok.
 * @param {object} props - Component props.
 * @param {boolean} props.open - Controlled open state.
 * @param {(open: boolean) => void} props.onOpenChange - Called when open state changes.
 * @param {number} props.movieId - TMDB movie id.
 * @param {boolean} [props.watched] - Whether the movie is currently marked as watched.
 * @param {(watched: boolean) => void} [props.onWatchedChange] - Called after successful watched toggle.
 * @param {() => void} [props.onAdvance] - Called to advance the queue.
 * @returns {React.ReactElement} The OverflowSheet component.
 */
export default function OverflowSheet ({ open, onOpenChange, movieId, watched = false, onWatchedChange, onAdvance }) {
  const { viewOnTmdb, dismiss, toggleWatched } = useMovieActions({
    movieId, watched, onWatchedChange, onAdvance
  })

  const close = () => onOpenChange(false)

  // Close on next frame so the action fires against the current
  // component tree before advance/re-render kicks in.
  const run = (fn) => () => {
    close()
    requestAnimationFrame(() => fn())
  }

  const item = 'w-full flex items-center gap-4 px-6 py-4 text-base text-foreground text-left cursor-pointer hover:bg-white/5 focus-visible:outline-none focus-visible:bg-white/5 [&_svg]:size-5 [&_svg]:text-gray-300'

  return (
    <Sheet isOpen={open} onClose={close} snapPoints={[0, 1]} initialSnap={1} detent='content'>
      <Sheet.Container className='bg-surface-light! rounded-t-xl!'>
        <Sheet.Header />
        <Sheet.Content>
          <div className='flex flex-col pb-6'>
            <button onClick={run(viewOnTmdb)} className={item}>
              <ExternalLink aria-hidden='true' />
              View on TMDB
            </button>
            <button onClick={run(dismiss)} className={item}>
              <Ban aria-hidden='true' />
              Not interested
            </button>
            <button onClick={run(toggleWatched)} className={item}>
              <CheckCircle2 aria-hidden='true' />
              {watched ? 'Remove from watched' : 'Mark as watched'}
            </button>
          </div>
        </Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop onTap={close} />
    </Sheet>
  )
}
