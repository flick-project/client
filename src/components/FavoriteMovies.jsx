import { Plus, X } from 'lucide-react'
import { posterUrl } from '../utils/imageUtils.js'

const MAX_FAVORITES = 5

/**
 * Poster wall grid for favorite movies.
 * @param {object} props - Component props.
 * @param {Array} props.favorites - Array of favorite movie objects.
 * @param {() => void} props.onAdd - Callback when add-slot is clicked.
 * @param {() => void} props.onRemove - Callback when remove button is clicked.
 * @returns {React.JSX.Element} The FavoriteMovies component.
 */
export default function FavoriteMovies ({ favorites, onAdd, onRemove }) {
  const slots = Array.from({ length: MAX_FAVORITES }, (_, i) => favorites[i] || null)

  return (
    <ul className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3'>
      {slots.map((movie, i) => movie
        ? (
          <li key={movie.id} className='relative aspect-2/3 group rounded-lg overflow-hidden border border-white/10'>
            <img
              src={posterUrl(movie.poster_path, 185)}
              alt={movie.title}
              className='size-full object-cover'
              loading='eager'
            />
            <div className='absolute inset-x-0 bottom-0 h-14 bg-linear-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100' />
            <p className='absolute bottom-2 left-2.5 right-2.5 text-xs font-medium text-white truncate opacity-0 group-hover:opacity-100'>
              {movie.title}
            </p>
            <button
              onClick={() => onRemove(movie)}
              className='absolute top-1.5 right-1.5 bg-black/60 hover:bg-black/80 rounded-full p-1 cursor-pointer lg:opacity-0 lg:group-hover:opacity-100'
              aria-label='Remove from favorites'
            >
              <X size={16} />
            </button>
          </li>
          )
        : (
          <li key={`empty-${i}`} className='aspect-2/3'>
            <button
              type='button'
              onClick={onAdd}
              className='flex size-full items-center justify-center rounded-lg border border-dashed border-white/10 text-text-muted transition hover:border-white/20 hover:text-gray-300 cursor-pointer'
            >
              <Plus className='size-5' />
            </button>
          </li>
          )
      )}
    </ul>
  )
}
