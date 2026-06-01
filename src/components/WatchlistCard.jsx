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

  useEffect(() => {
    if (!menuOpen) return
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('pointerdown', handleClick)
    return () => document.removeEventListener('pointerdown', handleClick)
  }, [menuOpen])

  return (
    <div className='relative aspect-2/3 group will-change-transform'>
      <img
        src={posterUrl(movie.poster_path, 92)}
        srcSet={`
          ${posterUrl(movie.poster_path, 92)} 92w,
          ${posterUrl(movie.poster_path, 185)} 185w
        `}
        sizes='(max-width: 768px) 100px, 150px'
        alt={movie.title}
        className='size-full object-cover rounded-lg pointer-events-none'
        fetchPriority='high'
      />
      <div className='absolute inset-0 rounded-lg border border-white/10 pointer-events-none' />

      <div ref={menuRef}>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className='absolute top-1.5 right-1.5 z-20 p-1 rounded-full bg-black/60 text-white cursor-pointer md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-150'
          aria-label={menuOpen ? 'Close menu' : 'Card actions'}
        >
          {menuOpen ? <X size={20} /> : <Ellipsis size={20} />}
        </button>

        {menuOpen && (
          <div className='absolute inset-0 z-10 bg-black/75 backdrop-blur-sm rounded-lg flex flex-col items-center justify-center gap-3 p-3 animate-in fade-in zoom-in-95 duration-150'>
            <p className='text-sm font-medium text-white text-center leading-snug line-clamp-2'>
              {movie.title}
            </p>
            <div className='flex flex-col w-full gap-2'>
              <button
                onClick={() => { setSaved(!saved); onSave(saved); setMenuOpen(false) }}
                className='flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-white/10 hover:bg-white/20 text-sm font-medium text-white transition-colors duration-150'
              >
                <Bookmark size={16} className={saved ? 'fill-yellow-400 text-yellow-400' : ''} />
                {saved ? 'Remove' : 'Save'}
              </button>
              <button
                onClick={() => { onRate(); setMenuOpen(false) }}
                className='flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-white/10 hover:bg-white/20 text-sm font-medium text-white transition-colors duration-150'
              >
                <Star size={16} className={movie.rating ? 'fill-blue-400 text-blue-400' : ''} />
                {movie.rating ? 'Change rating' : 'Rate'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
