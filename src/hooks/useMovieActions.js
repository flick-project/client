import { withAuthGate } from '../utils/errors'
import { useAuthFlow } from './useAuthFlow.js'
import { apiRequest } from '../services/api'
import { useDiscoveryQueue } from './useDiscoveryQueue'
import { toast } from 'sonner'

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
  const { requireAuth } = useAuthFlow()
  const { dismiss: providerDismiss } = useDiscoveryQueue()

  const viewOnTmdb = () => {
    window.open(`https://www.themoviedb.org/movie/${movieId}`, '_blank', 'noopener,noreferrer')
  }

  const dismiss = () => withAuthGate(async () => {
    try {
      await providerDismiss()
    } catch (err) {
      toast.error(err.message || 'Something went wrong. Please try again.')
      return
    }
    toast.success('You will see less of this in the future.')
  })

  const toggleWatched = async () => {
    // Check auth – throws if not authenticated
    try {
      requireAuth()
    } catch {
      return
    }

    try {
      if (watched) {
        await apiRequest(`/watched/${movieId}`, { method: 'DELETE' })
      } else {
        await apiRequest('/watched', {
          method: 'POST',
          body: JSON.stringify({ movieId })
        })
      }

      onWatchedChange?.(!watched)
      toast.success(watched ? 'Removed from watched.' : 'Marked as watched.')

      if (!watched) onAdvance?.()
    } catch (err) {
      toast.error(err.message || 'Something went wrong. Please try again.')
    }
  }

  return { viewOnTmdb, dismiss, toggleWatched }
}
