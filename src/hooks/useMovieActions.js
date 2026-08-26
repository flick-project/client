import { apiRequest } from '../services/api'
import { useToast } from './useToast'
import { useDiscoveryQueue } from './useDiscoveryQueue'

/**
 * Shared handlers for movie-level overflow actions. Used by both the
 * desktop OverflowMenu (dropdown) and mobile OverflowSheet (bottom sheet).
 * @param {object} args - Args.
 * @param {number} args.movieId - TMDB movie id.
 * @param {boolean} args.watched - Current watched state.
 * @param {(watched: boolean) => void} [args.onWatchedChange] - Called after successful watched toggle.
 * @param {() => void} [args.onAdvance] - Called to advance the queue after dismiss or mark-as-watched.
 * @returns {void}
 */
export function useMovieActions ({ movieId, watched, onWatchedChange, onAdvance }) {
  const { showToast } = useToast()
  const { dismiss: providerDismiss } = useDiscoveryQueue()

  const viewOnTmdb = () => {
    window.open(`https://www.themoviedb.org/movie/${movieId}`, '_blank', 'noopener,noreferrer')
  }

  const dismiss = async () => {
    try {
      await providerDismiss()
    } catch {
      showToast('Something went wrong. Please try again.')
      return
    }
    showToast('You will see less of this in the future.')
  }

  const toggleWatched = async () => {
    try {
      if (watched) {
        await apiRequest(`/watched/${movieId}`, { method: 'DELETE' })
      } else {
        await apiRequest('/watched', {
          method: 'POST',
          body: JSON.stringify({ movieId })
        })
      }
    } catch {
      showToast('Something went wrong. Please try again.')
      return
    }
    onWatchedChange?.(!watched)
    if (watched) {
      showToast('Removed from watched.')
    } else {
      showToast('Marked as watched.')
      onAdvance?.()
    }
  }

  return { viewOnTmdb, dismiss, toggleWatched }
}
