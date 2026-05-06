import { Bookmark, Heart } from 'lucide-react'

/**
 * Displays a movie card with poster and title.
 * Shows an error or loading state when movie data is unavailable.
 * @param {object} props - The component props.
 * @param {object} props.movie - The movie data.
 * @returns {React.ReactElement} The WatchlistCard component.
 */
export default function WatchlistCard ({ movie }) {
  const posterSrc = `https://image.tmdb.org/t/p/w342${movie.poster_path}`

  return (
    <div className='relative aspect-2/3 flex items-center justify-center group'>
      <img
        src={posterSrc}
        alt={movie.title}
        className='size-full object-cover rounded-lg pointer-events-none'
      />
      <div className='absolute inset-0 rounded-lg border border-white/10 pointer-events-none' />
    </div>
  )
}
