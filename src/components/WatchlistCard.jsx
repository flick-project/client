import { useState } from 'react'
import { Bookmark, Star } from 'lucide-react'
import { posterUrl } from '../utils/imageUtils'

/**
 * Displays a watchlist movie card with poster, save toggle, and rate button.
 * @param {object} props - The component props.
 * @param {object} props.movie - The movie data.
 * @param {function(): void} props.onSave - Callback to toggle save state.
 * @param {function(): void} props.onRate - Callback to open the rating modal.
 * @returns {React.ReactElement} The WatchlistCard component.
 */
export default function WatchlistCard ({ movie, onSave, onRate }) {
  const [saved, setSaved] = useState(true)

  return (
    <div className='relative aspect-2/3 flex items-center justify-center group'>
      <img
        src={posterUrl(movie.poster_path, 185)}
        srcSet={`
          ${posterUrl(movie.poster_path, 185)} 185w,
          ${posterUrl(movie.poster_path, 300)} 300w,
          ${posterUrl(movie.poster_path, 500)} 500w
        `}
        sizes='(max-width: 640px) 45vw, 200px'
        alt={movie.title}
        className='size-full object-cover rounded-lg pointer-events-none'
        loading='lazy'
      />
      <div className='absolute inset-0 rounded-lg border border-white/10 pointer-events-none' />
      <div className='absolute opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto flex gap-2 transition-opacity duration-150 delay'>
        <button onClick={() => { setSaved(!saved); onSave(saved) }} className='rounded-full p-2 bg-black/70 cursor-pointer'>
          <Bookmark size={32} strokeWidth={1} className={saved ? 'fill-yellow-400 text-yellow-400' : 'fill-white'} />
        </button>
        <button onClick={() => { onRate() }} className='rounded-full p-2 bg-black/70 cursor-pointer'>
          <Star size={32} strokeWidth={1.5} className={movie.rating ? 'fill-blue-400 text-blue-400' : 'fill-white'} />
        </button>
      </div>
    </div>
  )
}
