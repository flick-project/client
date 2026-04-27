import { Star } from 'lucide-react'
import { GENRES } from '../utils/genres.js'

/**
 * Wrapper component for the movie card layout.
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The content to render inside the card.
 * @returns {React.ReactElement} The CardWrapper component.
 */
function CardWrapper ({ children }) {
  return (
    <div className='w-full max-w-xl aspect-2/3 bg-surface-light rounded-xl outline-1 outline-solid outline-white/10 overflow-hidden'>
      {children}
    </div>
  )
}

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
      <CardWrapper>
        <div className='flex items-center justify-center h-full'>
          <h1 className='text-2xl font-semibold'>{error || 'Loading...'}</h1>
        </div>
      </CardWrapper>
    )
  }

  const posterUrl = `https://image.tmdb.org/t/p/w780${movie.poster_path}`

  return (
    <CardWrapper>
      <div className='h-full bg-cover bg-center text-white rounded-[inherit]' style={{ backgroundImage: `url(${posterUrl})` }}>
        <div className='flex flex-col justify-end gap-3 w-full h-full bg-linear-to-t from-black/90 via-black/50 via-30% to-transparent p-6 text-shadow-md'>
          <h1 className='text-2xl font-semibold leading-none'>{movie.title}</h1>
          <div className='flex items-center gap-4'>
            <span className='flex items-center gap-1 leading-none'>
              <Star size={20} fill='var(--color-brand)' stroke='var(--color-brand)' />
              {movie.vote_average.toFixed(1)}<span className='text-white/70'>({movie.vote_count})</span>
            </span>
            <span>{new Date(movie.release_date).getFullYear()}</span>
            <span className='flex gap-2'>{movie.genre_ids.slice(0, 3).map(id => (
              <span key={id} className='px-2 py-1 text-xs rounded-full bg-white/20 backdrop-blur-xs'>
                {GENRES[id]}
              </span>
            ))}
            </span>
          </div>
          <p className='line-clamp-3'>{movie.overview}</p>
        </div>
      </div>
    </CardWrapper>
  )
}
