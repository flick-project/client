import { useState } from 'react'
import { useMovieSearch } from '../hooks/useMovieSearch.js'
import { Search } from 'lucide-react'

/**
 * Searchable movie list that queries TMDB and displays results.
 * @param {object} props - Component props.
 * @param {number[]} props.excludeIds - Movie IDs to hide from results (e.g. existing favorites).
 * @param {(movie: object) => void} props.onSelect - Callback when a movie is selected.
 * @param {() => void} props.onClose - Callback to close the modal.
 * @param {'default'|'discovery'} [props.variant] - Visual variant.
 * @returns {React.ReactElement} The SearchModal component.
 */
export default function SearchModal ({ onSelect, onClose, excludeIds, variant = 'default' }) {
  const [activeIndex, setActiveIndex] = useState(-1)
  const { query, setQuery, results, handleSelect } = useMovieSearch((movie) => {
    onSelect(movie)
    if (variant !== 'discovery') onClose()
  }, excludeIds)

  const handleKeyDown = (e) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setActiveIndex((prev) => Math.min(prev + 1, results.length - 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        setActiveIndex((prev) => Math.max(prev - 1, 0))
        break
      case 'Enter':
        e.preventDefault()
        if (activeIndex >= 0 && results[activeIndex]) {
          handleSelect(results[activeIndex])
        }
        break
      case 'Escape':
        e.preventDefault()
        onClose()
        break
    }
  }

  return (
    <div
      className='fixed inset-0 flex items-start justify-center pt-[10%] bg-black/80 z-50'
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className='w-full max-w-lg bg-surface-light rounded-xl border border-border overflow-hidden'>
        <div className={`flex items-center gap-3 py-2.5 px-3 ${results.length > 0 ? 'border-b border-white/10' : ''}`}>
          <Search size={24} className='text-gray-400' />
          <input
            type='text'
            placeholder='Search for a movie...'
            value={query}
            onChange={(e) => { setQuery(e.target.value); setActiveIndex(-1) }}
            onKeyDown={handleKeyDown}
            autoFocus
            className='w-full bg-transparent text-foreground placeholder-gray-400 outline-none'
          />
        </div>
        {results.length > 0 && (
          <ul className='max-h-72 overflow-y-auto divide-y divide-white/5'>
            {results.map((movie, index) => (
              <li
                key={movie.id}
                onMouseDown={() => handleSelect(movie)}
                onMouseEnter={() => setActiveIndex(index)}
                className={`px-4 py-2.5 cursor-pointer text-sm ${index === activeIndex ? 'bg-white/10' : 'hover:bg-white/10'}`}
              >
                {movie.title} ({new Date(movie.release_date).getFullYear()})
              </li>
            ))}
          </ul>
        )}
        {variant === 'discovery' && (
          <div className='flex items-center gap-4 px-4 py-2.5 border-t border-white/5 text-sm text-muted-foreground'>
            <span className='flex items-center gap-1'>
              <kbd className='px-1.5 py-0.5 rounded bg-white/10 text-muted-foreground'>↑</kbd>
              <kbd className='px-1.5 py-0.5 rounded bg-white/10 text-muted-foreground'>↓</kbd>
              to navigate
            </span>
            <span className='flex items-center gap-1'>
              <kbd className='px-1.5 py-0.5 rounded bg-white/10 text-muted-foreground'>↵</kbd>
              to select
            </span>
            <span className='flex items-center gap-1 ml-auto'>
              <kbd className='px-1.5 py-0.5 rounded bg-white/10 text-muted-foreground'>Esc</kbd>
              to close
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
