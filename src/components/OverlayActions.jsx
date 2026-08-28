import { Bookmark, Star, Eye, EyeOff } from 'lucide-react'
import { findRating } from '../utils/ratings.js'
import RatingPicker from './RatingPicker.jsx'

/**
 * Overlay-specific save + rate + watched action buttons.
 * All are rounded ghost buttons with a label beneath.
 * Rate uses RatingPicker with a bottom-arrow popover.
 * @param {object} props - Component props.
 * @param {boolean} [props.saved] - Whether the current movie is saved.
 * @param {string|null} [props.rating] - Current rating value.
 * @param {boolean} [props.watched] - Whether the current movie is marked watched.
 * @param {function(): void} props.onSave - Save toggle handler.
 * @param {function(string|null): void} props.onRate - Rating handler.
 * @param {function(): void} props.onToggleWatched - Watched toggle handler.
 * @returns {React.ReactElement} The OverlayActions component.
 */
export default function OverlayActions ({ saved, rating, watched, onSave, onRate, onToggleWatched }) {
  const current = rating ? findRating(rating) : null
  const rateLabel = current ? `Rated ${current.label}` : 'Rate'

  return (
    <div className='flex items-center justify-center gap-3'>
      <button
        onClick={onSave}
        aria-label={saved ? 'Unsave' : 'Save'}
        title={saved ? 'Unsave' : 'Save'}
        className='flex flex-col items-center justify-center size-14 rounded-lg cursor-pointer hover:bg-white/10'
      >
        <Bookmark
          size={24} strokeWidth={2}
          className={` ${saved ? 'text-amber-400' : ''}`}
          fill={saved ? 'currentColor' : 'none'}
        />
        <span className='text-xs text-gray-400 leading-none mt-2'>{saved ? 'Saved' : 'Save'}</span>
      </button>

      <RatingPicker
        rating={rating}
        onSelect={onRate}
        arrowFrom='bottom'
        trigger={() => (
          <button
            aria-label={rateLabel}
            title={rateLabel}
            className='flex flex-col items-center justify-center size-14 rounded-lg cursor-pointer hover:bg-white/10'
          >
            {current
              ? <img src={current.emoji} alt='' className='size-6 max-w-none' />
              : <Star size={24} strokeWidth={2} />}
            <span className='text-xs text-gray-400 leading-none mt-2'>Rate</span>
          </button>
        )}
      />

      <button
        onClick={onToggleWatched}
        aria-label={watched ? 'Remove watched' : 'Mark as watched'}
        title={watched ? 'Remove watched' : 'Mark as watched'}
        className='flex flex-col items-center justify-center size-14 rounded-lg cursor-pointer hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400'
      >
        {watched
          ? <Eye size={24} strokeWidth={2} className='text-emerald-400' />
          : <EyeOff size={24} strokeWidth={2} />}
        <span className='text-xs text-gray-400 leading-none mt-2'>{watched ? 'Watched' : 'Seen it'}</span>
      </button>
    </div>
  )
}
