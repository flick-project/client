import { useMovieSearch } from '../hooks/useMovieSearch.js'
import Input from './Input.jsx'
import { Search } from 'lucide-react'

/**
 * Searchable movie list that queries TMDB and displays results.
 * @param {object} props - Component props.
 * @param props.excludeIds
 * @param {(movie: object) => void} props.onSelect - Callback when a movie is selected.
 * @param {() => void} props.onClose - Callback to close the modal.
 * @returns {React.ReactElement} The MovieSearch component.
 */
export default function SearchModal ({ onSelect, onClose, excludeIds }) {
  // Hook only calls onSelect for modularity, so we wrap the modal's onClose with it.
  const { query, setQuery, results, handleSelect } = useMovieSearch((movie) => {
    onSelect(movie)
    onClose()
  }, excludeIds)

  return (
    <div
      className='fixed inset-0 flex items-start justify-center pt-40 bg-black/50 z-50'
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className='w-full max-w-lg bg-surface-light rounded-xl border border-white/10 overflow-hidden'>
        <div className={`flex items-center gap-3 px-4 py-3 ${results.length > 0 ? 'border-b border-white/10' : ''}`}>
          <Search size={18} className='text-gray-500' />
          <input
            type='text'
            placeholder='Search for a movie...'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className='w-full bg-transparent text-sm text-white placeholder-gray-500 outline-none'
          />
        </div>
        {results.length > 0 && (
          <ul className='max-h-72 overflow-y-auto divide-y divide-white/5'>
            {results.map(movie => (
              <li
                key={movie.id}
                onMouseDown={() => handleSelect(movie)}
                className='px-4 py-2.5 hover:bg-white/5 cursor-pointer text-sm'
              >
                {movie.title} ({new Date(movie.release_date).getFullYear()})
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
