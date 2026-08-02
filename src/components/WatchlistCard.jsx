import { useState } from 'react'
import { Bookmark } from 'lucide-react'
import { posterUrl } from '../utils/imageUtils'
import { useMovieOverlay } from '../hooks/useMovieOverlay'

/**
 * Displays a watchlist movie card with poster, save toggle, and rate button.
 * @param {object} props - The component props.
 * @param {object} props.movie - The movie data.
 * @param {function(): void} props.onSave - Callback to toggle save state.
 * @returns {React.ReactElement} The WatchlistCard component.
 */
export default function WatchlistCard ({ movie, onSave }) {
  const { openOverlay } = useMovieOverlay()
  const [saved, setSaved] = useState(true)

  return (
    <div onClick={() => openOverlay(movie.tmdb_id)} className='relative aspect-2/3 group will-change-transform cursor-pointer'>
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
      <div className='absolute inset-0 rounded-lg border border-white/10 pointer-events-none' />
      <button
        onClick={(e) => { e.stopPropagation(); setSaved(!saved); onSave(saved) }}
        className='absolute top-1.5 left-1.5 z-20 p-2 rounded-full bg-black/60 text-white'
        aria-label={saved ? 'Remove from watchlist' : 'Save to watchlist'}
      >
        <Bookmark size={24} className={saved ? 'fill-yellow-400 text-yellow-400' : ''} />
      </button>
    </div>
  )
}
