import { useState, useRef, useEffect } from 'react'
import { Bookmark, Star, Ellipsis, X } from 'lucide-react'
import { posterUrl } from '../utils/imageUtils'

/**
 * Displays a watchlist movie card with poster, save toggle, and rate button.
 * @param {object} props - The component props.
 * @param {object} props.movie - The movie data.
 * @param {function(): void} props.onSave - Callback to toggle save state.
 * @param {function(): void} props.onRate - Callback to open the rating modal.
 * @returns {React.ReactElement} The WatchlistCard component.
 */
export default function WatchlistCard ({ movie, onSave, onRate }) {
  const [saved, setSaved] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  // Close menu on outside click.
  useEffect(() => {
    if (!menuOpen) return
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('pointerdown', handleClick)
    return () => document.removeEventListener('pointerdown', handleClick)
  }, [menuOpen])

  return (
    <div className='relative aspect-2/3 group'>
      <img
        src={posterUrl(movie.poster_path, 92)}
        srcSet={`
      ${posterUrl(movie.poster_path, 92)} 92w,
      ${posterUrl(movie.poster_path, 185)} 185w
    `}
        sizes='(max-width: 768px) 100px, 150px'
        alt={movie.title}
        className='size-full object-cover rounded-lg pointer-events-none'
        fetchpriority='high'
        loading='lazy'
      />
      <div className='absolute inset-0 rounded-lg border border-white/10 pointer-events-none' />

      {/* Ellipsis */}
      <div ref={menuRef}>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className='absolute top-1 right-1 z-20 p-1 rounded-full bg-black/60 text-white cursor-pointer md:opacity-0 md:group-hover:opacity-100 transition-opacity'
          aria-label={menuOpen ? 'Close menu' : 'Card actions'}
        >
          {menuOpen ? <X size={24} /> : <Ellipsis size={24} />}
        </button>

        {/* Overlay */}
        {menuOpen && (
          <div className='absolute inset-0 z-10 bg-black/80 backdrop-blur-xs rounded-lg flex flex-col items-center justify-center gap-2 p-2'>
            {/* Title */}
            <p className='text-base text-white text-center p-2'>
              {movie.title}
            </p>
            {/* Buttons */}
            <div className='flex flex-wrap justify-center gap-1.5'>
              <button
                onClick={() => { setSaved(!saved); onSave(saved); setMenuOpen(false) }}
                className='w-full flex items-center justify-center gap-2 py-3 px-3 rounded-full bg-white/15 hover:bg-white/25 text-sm font-medium text-white'
              >
                <Bookmark size={20} className={saved ? 'fill-yellow-400 text-yellow-400' : ''} />
                <span>{saved ? 'Remove' : 'Save'}</span>
              </button>
              <button
                onClick={() => { onRate(); setMenuOpen(false) }}
                className='w-full flex items-center justify-center gap-2 py-3 px-3 rounded-full bg-white/15 hover:bg-white/25 text-sm font-medium text-white'
              >
                <Star size={20} className={movie.rating ? 'fill-blue-400 text-blue-400' : ''} />
                <span className='text-center'>{movie.rating ? 'Rate' : 'Rate'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
