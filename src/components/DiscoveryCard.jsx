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
export default function DiscoveryCard ({ movie, error }) {
  if (error || !movie) {
    return (
      <div className='size-full rounded-xl lg:rounded-2xl overflow-hidden bg-surface-light md:ring-1 md:ring-inset md:ring-white/10 animate-pulse' />
    )
  }

  return (
    <div className='relative size-full rounded-xl lg:rounded-2xl overflow-hidden'>
      {/* Background */}
      <div className='absolute inset-0 bg-black' />
      <img
        src={posterUrl(movie.poster_path, 300)}
        srcSet={`
          ${posterUrl(movie.poster_path, 300)} 300w,
          ${posterUrl(movie.poster_path, 500)} 500w,
          ${posterUrl(movie.poster_path, 780)} 780w
        `}
        sizes='(max-width: 640px) 300px, (max-width: 1080px) 500px, 780px'
        alt={movie.title}
        className='absolute inset-0 size-full object-cover mask-[linear-gradient(to_bottom,white_60%,rgba(255,255,255,0.3)_85%,transparent_100%)]'
        fetchPriority='high'
      />

      {/* Content */}
      <div className='relative flex flex-col justify-end gap-3 size-full p-4 lg:p-6 text-white'>
        <h1 className='text-xl lg:text-2xl font-semibold leading-tight text-shadow-md'>{movie.title}</h1>

        <div className='flex items-center gap-4 flex-wrap text-sm'>
          <span className='flex items-center gap-1 text-shadow-md'>
            <Star size={16} className='fill-brand text-brand' />
            <span className='font-medium'>{Number(movie.vote_average).toFixed(1)}</span>
            <span className='text-white/50'>({movie.vote_count})</span>
          </span>
          <span className='text-white/70 text-shadow-md'>{new Date(movie.release_date).getFullYear()}</span>
          <span className='flex gap-1.5 flex-wrap'>
            {movie.genre_ids.slice(0, 3).map(id => (
              <span key={id} className='px-2 py-1 text-xs rounded-full bg-white/15 backdrop-blur-sm leading-none whitespace-nowrap'>
                {GENRES[id]}
              </span>
            ))}
          </span>
        </div>

        <p className='line-clamp-3 text-sm lg:text-base text-white/80 text-shadow-md'>{movie.overview}</p>
      </div>
      <div className='absolute inset-0 md:border border-white/10 pointer-events-none rounded-xl lg:rounded-2xl' />
    </div>
  )
}
