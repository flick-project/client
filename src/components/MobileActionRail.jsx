import { Bookmark, Star } from 'lucide-react'
import { findRating } from '../utils/ratings.js'
import RatingPicker from './RatingPicker.jsx'

const railBtn = 'flex items-center justify-center size-12 rounded-full [text-shadow:0_1px_3px_rgba(0,0,0,0.8)] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'

/**
 * Vertical action rail for mobile discovery. Floats on the right side
 * of the screen with save, rate, and info.
 * @param {object} props - Component props.
 * @param {boolean} [props.saved] - Whether the current movie is saved.
 * @param {string|null} [props.rating] - Current rating value.
 * @param {function(): void} props.onSave - Save toggle handler.
 * @param {function(string|null): void} props.onRate - Rating handler.
 * @returns {React.ReactElement} The MobileActionRail component.
 */
export default function MobileActionRail ({ saved, rating, onSave, onRate }) {
  const current = rating ? findRating(rating) : null

  return (
    <div className='flex flex-col items-center gap-3'>
      <button onClick={onSave} aria-label={saved ? 'Unsave' : 'Save'} className={railBtn}>
        <Bookmark
          className={`size-6 ${saved ? 'text-amber-400' : 'text-white'}`}
          strokeWidth={2}
          fill={saved ? 'currentColor' : 'none'}
        />
      </button>

      <RatingPicker
        rating={rating}
        onSelect={onRate}
        arrowFrom='right'
        trigger={() => (
          <button aria-label={current ? `Rated ${current.label}` : 'Rate'} className={railBtn}>
            {current
              ? <img src={current.emoji} alt='' className='size-6 max-w-none' />
              : <Star className='size-6 text-white' strokeWidth={2} />}
          </button>
        )}
      />
    </div>
  )
}
