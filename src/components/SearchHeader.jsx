import { useMovieSearch } from '../hooks/useMovieSearch.js'
import { useMovieOverlay } from '../hooks/useMovieOverlay.js'
import { ArrowLeft } from 'lucide-react'

/**
 * Mobile search header that replaces DiscoveryHeader when search is
 * active. Selecting a movie opens the movie overlay stacked over the
 * search URL, so browser back returns the user to their search.
 * @param {object} props - Component props.
 * @param {() => void} props.onClose - Callback to close search.
 * @returns {React.ReactElement} The SearchHeader component.
 */
export default function SearchHeader ({ onClose }) {
  const { openOverlay } = useMovieOverlay()
  const { query, setQuery, results, handleSelect } = useMovieSearch((movie) => {
    openOverlay(movie.id)
  })

  return (
    <div className='size-full relative h-14 px-4'>
      <div className='flex items-center gap-3 h-full'>
        <button onClick={onClose} className='size-11 cursor-pointer' aria-label='Close search'>
          <ArrowLeft size={24} className='text-muted-foreground' />
        </button>
        <input
          type='text'
          placeholder='Search for a movie...'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
          className='w-full bg-transparent text-foreground placeholder-muted-foreground outline-none'
        />
      </div>
      {results.length > 0 && (
        <ul className='fixed inset-x-0 top-13 bottom-13 bg-surface overflow-y-auto divide-y divide-border z-10000'>
          {results.map(movie => (
            <li
              key={movie.id}
              onMouseDown={() => handleSelect(movie)}
              className='px-4 py-3 hover:bg-white/10 cursor-pointer'
            >
              {movie.title} ({new Date(movie.release_date).getFullYear()})
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
