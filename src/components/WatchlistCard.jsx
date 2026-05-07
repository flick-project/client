import { useState } from 'react'
import { Bookmark, Heart } from 'lucide-react'

/**
 * Displays a movie card with poster and title.
 * Shows an error or loading state when movie data is unavailable.
 * @param {object} props - The component props.
 * @param {object} props.movie - The movie data.
 * @param {function(): void} props.onToggle - Callback to toggle save state.
 * @returns {React.ReactElement} The WatchlistCard component.
 */
export default function WatchlistCard ({ movie, onToggle }) {
  const [saved, setSaved] = useState(true)
  const [rated, setRated] = useState(false)
  const posterSrc = `https://image.tmdb.org/t/p/w342${movie.poster_path}`

  return (
    <div className='relative aspect-2/3 flex items-center justify-center group'>
      <img
        src={posterSrc}
        alt={movie.title}
        className='size-full object-cover rounded-lg pointer-events-none'
      />
      <div className='absolute inset-0 rounded-lg border border-white/10 pointer-events-none' />
      <div className='absolute opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto flex gap-2 transition-opacity duration-150 delay'>
        <button onClick={() => { setSaved(!saved); onToggle(saved) }} className='rounded-full p-2 bg-black/70 cursor-pointer'>
          <Bookmark size={32} stroke='none' className={saved ? 'fill-yellow-400' : 'fill-white'} />
        </button>
        <button onClick={() => setRated(!rated)} className='rounded-full p-2 bg-black/70 cursor-pointer'>
          <Heart size={32} stroke='none' className={rated ? 'fill-red-400' : 'fill-white'} />
        </button>
      </div>
    </div>
  )
}
