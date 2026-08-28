import { useState } from 'react'
import { useMovieSearch } from '../hooks/useMovieSearch.js'
import { ArrowLeft } from 'lucide-react'

/**
 * Mobile search header that replaces DiscoveryHeader when search is active.
 * @param {object} props - Component props.
 * @param {(movie: object) => void} props.onSelect - Callback when a movie is selected.
 * @param {() => void} props.onClose - Callback to close search.
 * @returns {React.ReactElement} The SearchHeader component.
 */
export default function SearchHeader ({ onSelect, onClose }) {
  const { query, setQuery, results, handleSelect: baseHandleSelect } = useMovieSearch(onSelect)
  const [showResults, setShowResults] = useState(true)

  const handleSelect = (movie) => {
    baseHandleSelect(movie)
    setQuery(movie.title)
    setShowResults(false)
  }

  return (
    <div className='size-full relative h-14 px-4'>
      <div className='flex items-center gap-3 h-full'>
        <button onClick={onClose} className='size-11 cursor-pointer'>
          <ArrowLeft size={24} className='text-muted-foreground' />
        </button>
        <input
          type='text'
          placeholder='Search for a movie...'
          value={query}
          onChange={(e) => { setQuery(e.target.value); setShowResults(true) }}
          onFocus={() => setShowResults(true)}
          onBlur={() => setShowResults(false)}
          autoFocus
          className='w-full bg-transparent text-foreground placeholder-muted-foreground outline-none'
        />
      </div>
      {showResults && results.length > 0 && (
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
