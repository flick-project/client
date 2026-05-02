import { Star } from 'lucide-react'
import { GENRES } from '../utils/genres.js'

/**
 * Displays a movie card with poster, title, score, and overview.
 * Shows an error or loading state when movie data is unavailable.
 * @param {object} props - The component props.
 * @param {object} props.movie - The movie data from TMDB.
 * @param {string} props.error - Error message to display if the API call fails.
 * @returns {React.ReactElement} The MovieCard component.
 */
export default function MovieCard ({ movie, error }) {
  if (error || !movie) {
    return (
      <div className='flex items-center justify-center w-full max-h-full aspect-2/3 rounded-xl bg-surface-light'>
        <h1 className='text-2xl font-semibold'>{error || 'Loading...'}</h1>
      </div>
    )
  }

  const posterSrc = `https://image.tmdb.org/t/p/w780${movie.poster_path}`

  return (
    <div className='max-h-full relative aspect-2/3 rounded-xl overflow-hidden'>
      <div className='relative h-full'>
        <img
          src={posterSrc}
          alt={movie.title}
          className='absolute inset-0 w-full h-full object-cover'
          style={{ maskImage: 'linear-gradient(to bottom, white 60%, rgba(255,255,255,0.3) 85%, rgba(255,255,255,0.15) 100%)' }}
        />
        <div className='absolute inset-0 bg-black -z-10' />
        <div className='relative flex flex-col justify-end gap-3 w-full h-full p-6 text-white text-shadow-md'>
          <h1 className='text-2xl font-semibold leading-none'>{movie.title}</h1>
          <div className='flex items-center gap-4'>
            <span className='flex items-center gap-1 leading-none'>
              <Star size={20} fill='var(--color-brand)' stroke='var(--color-brand)' />
              {Number(movie.vote_average).toFixed(1)}
              <span className='text-white/70'>({movie.vote_count})</span>
            </span>
            <span>{new Date(movie.release_date).getFullYear()}</span>
            <span className='flex gap-2'>
              {movie.genre_ids.slice(0, 3).map(id => (
                <span key={id} className='px-2 py-1 text-xs rounded-full bg-white/20 backdrop-blur-xs'>
                  {GENRES[id]}
                </span>
              ))}
            </span>
          </div>
          <p className='line-clamp-3'>{movie.overview}</p>
        </div>
      </div>
      <div className='absolute inset-0 rounded-xl border border-white/10 pointer-events-none z-10' />
    </div>
  )
}
