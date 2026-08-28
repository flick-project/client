import { useState } from 'react'
import { Bookmark } from 'lucide-react'
import { posterUrl } from '../utils/imageUtils'
import { useMovieOverlay } from '../hooks/useMovieOverlay'

/**
 * Watchlist movie card with poster and save toggle.
 * The card owns its saved state so unsaves are "lazy" — the visual
 * bookmark flips off but the card stays in the list until the next
 * refresh, letting the user change their mind without losing position.
 * Overlay-driven unsaves remove the card immediately (see WatchlistPage).
 * @param {object} props - The component props.
 * @param {object} props.movie - The movie data.
 * @param {function(boolean): Promise<void>} props.onToggleSave - Called with the new saved state. Returns a promise so we can roll back on error.
 * @returns {React.ReactElement} The WatchlistCard component.
 */
export default function WatchlistCard ({ movie, onToggleSave }) {
  const { openOverlay } = useMovieOverlay()
  const [saved, setSaved] = useState(movie.saved ?? true)

  const handleToggle = async (e) => {
    e.stopPropagation()
    const next = !saved
    setSaved(next)
    try {
      await onToggleSave(next)
    } catch {
      setSaved(!next)
    }
  }

  return (
    <div
      onClick={() => openOverlay(movie.tmdb_id)}
      className='relative aspect-2/3 group will-change-transform cursor-pointer rounded-lg'
    >
      <img
        src={posterUrl(movie.poster_path, 92)}
        srcSet={`
          ${posterUrl(movie.poster_path, 92)} 92w,
          ${posterUrl(movie.poster_path, 185)} 185w
        `}
        sizes='(max-width: 768px) 100px, 150px'
        alt={movie.title}
        className='size-full object-cover rounded-lg pointer-events-none'
        fetchPriority='high'
      />
      <div className='absolute pointer-events-none' />
      <button
        type='button'
        onClick={handleToggle}
        className='absolute top-1.5 left-1.5 z-20 p-2.5 rounded-full bg-black/60 hover:bg-black/80 cursor-pointer'
        aria-label={saved ? 'Remove from watchlist' : 'Save to watchlist'}
        aria-pressed={saved}
        title={saved ? 'Remove from watchlist' : 'Save to watchlist'}
      >
        <Bookmark
          size={24}
          className={saved ? 'fill-amber-400 text-amber-400' : 'text-foreground'}
        />
      </button>
    </div>
  )
}
