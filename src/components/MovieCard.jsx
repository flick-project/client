import { Star } from 'lucide-react'

/**
 *
 * @param root0
 * @param root0.children
 */
function CardWrapper ({ children }) {
  return (
    <div className='w-full max-w-xl aspect-2/3 bg-surface-light'>
      {children}
    </div>
  )
}

/**
 * Card for movies.
 * @param root0
 * @param root0.movie
 * @param root0.error
 */
export default function MovieCard ({ movie, error }) {
  if (error) return <CardWrapper><h1 className='text-2xl font-semibold'>{error}</h1></CardWrapper>

  if (!movie) return <CardWrapper><h1 className='text-2xl font-semibold'>Loading...</h1></CardWrapper>

  const posterUrl = `https://image.tmdb.org/t/p/w780${movie.poster_path}`

  return (
    <CardWrapper>
      <div className='h-full bg-cover bg-center text-white' style={{ backgroundImage: `url(${posterUrl})` }}>
        <div className='flex flex-col justify-end gap-2 w-full h-full bg-linear-to-t from-black/90 via-black/50 via-30% to-transparent p-6 text-shadow-md'>
          <h1 className='text-2xl font-semibold'>{movie.title}</h1>
          <div className='flex items-center gap-4'>
            <span className='flex items-center'>
              <Star size={20} fill='var(--color-brand)' stroke='var(--color-brand)' />
              {movie.vote_average.toFixed(1)}<span className='text-white/70'>/10 ({movie.vote_count})</span>
            </span>
            <span>{new Date(movie.release_date).getFullYear()}</span>
          </div>
          <p className='line-clamp-4'>{movie.overview}</p>
        </div>
      </div>
    </CardWrapper>
  )
}
