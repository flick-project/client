import { useMovieSearch } from '../hooks/useMovieSearch.js'
import Input from '../components/Input.jsx'
import { Search } from 'lucide-react'

/**
 * Searchable movie list that queries TMDB and displays results.
 * @param {object} props - Component props.
 * @param {(movie: object) => void} props.onSelect - Callback when a movie is selected.
 * @param {boolean} [props.disabled] - Whether the search input is disabled.
 * @returns {React.ReactElement} The MovieSearch component.
 */
export default function MovieSearch ({ onSelect, disabled }) {
  const { query, setQuery, results, handleSelect, clearResults } = useMovieSearch(onSelect)

  return (
    <div className='relative' tabIndex={-1} onBlur={clearResults}>
      <div className='relative flex flex-col align-center'>
        <Input type='text' placeholder='Search movie' value={query} onChange={(e) => setQuery(e.target.value)} disabled={disabled} />
        <Search className='absolute right-3 top-1/2 -translate-y-1/2 text-text-muted' size={24} />
        {results.length > 0 && (
          <ul className='absolute top-full shadow-lg/40 w-full mt-1 bg-surface outline-1 outline-white/10 rounded-lg max-h-50 overflow-y-auto z-99 divide divide-y divide-white/10 divide-solid'>
            {results.map(movie => (
              <li onMouseDown={() => handleSelect(movie)} key={movie.id} className='p-2 hover:bg-white/5 cursor-pointer'>{movie.title} ({new Date(movie.release_date).getFullYear()})</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
