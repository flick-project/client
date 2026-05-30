import { Star } from 'lucide-react'
import { GENRES } from '../utils/genres.js'
import { posterUrl } from '../utils/imageUtils.js'

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
      <div className='size-full flex items-center justify-center rounded-2xl shadow-lg bg-surface-light p-4'>
        <p className='text-base font-normal text-gray-400 text-center'>{error || 'Loading...'}</p>
      </div>
    )
  }

  return (
    <div className='relative size-full rounded-xl lg:rounded-2xl overflow-hidden shadow-lg ring-1 ring-inset ring-white/10'>
      <div className='relative size-full -z-1'>
        <img
          src={posterUrl(movie.poster_path, 300)}
          srcSet={`
            ${posterUrl(movie.poster_path, 300)} 300w,
            ${posterUrl(movie.poster_path, 500)} 500w,
            ${posterUrl(movie.poster_path, 780)} 780w
          `}
          sizes='(max-width: 640px) 300px, (max-width: 1080px) 500px, 780px'
          alt={movie.title}
          className='absolute inset-0 size-full object-cover'
          style={{ maskImage: 'linear-gradient(to bottom, white 60%, rgba(255,255,255,0.3) 85%, rgba(255,255,255,0.15) 100%)' }}
          fetchpriority='high'
          loading='eager'
        />
        <div className='absolute inset-0 bg-black -z-2' />
        <div className='relative flex flex-col justify-end gap-2 md:gap-4 w-full h-full p-4 md:p-6 text-white text-shadow-md'>
          <h1 className='text-xl md:text-2xl font-semibold leading-none'>{movie.title}</h1>

          <div className='flex items-center gap-2 md:gap-4 flex-wrap'>
            <span className='flex items-center gap-1'>
              <Star size={20} fill='var(--color-brand)' stroke='var(--color-brand)' />
              {Number(movie.vote_average).toFixed(1)}
              <span className='text-white/70'>({movie.vote_count})</span>
            </span>
            <span>
              {new Date(movie.release_date).getFullYear()}
            </span>

            <span className='flex gap-2 overflow-auto'>
              {movie.genre_ids.slice(0, 3).map(id => (
                <span key={id} className='px-2 py-1.5 text-xs rounded-full whitespace-nowrap bg-white/20 backdrop-blur-xs leading-none'>
                  {GENRES[id]}
                </span>
              ))}
            </span>
          </div>

          <p className='line-clamp-3 text-sm md:text-base'>{movie.overview}</p>
        </div>
      </div>
    </div>
  )
}
