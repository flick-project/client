import { Bookmark, Star } from 'lucide-react'
import IconButton from './IconButton.jsx'
import RatingPicker from './RatingPicker.jsx'
import { findRating } from '../utils/ratings.js'

/**
 * Vertical action cluster for desktop discovery. Sits beside the card
 * with save and rate buttons.
 * @param {object} props - Component props.
 * @param {boolean} [props.saved] - Whether the current movie is saved.
 * @param {string|null} [props.rating] - Current rating value.
 * @param {function(): void} props.onSave - Save toggle handler.
 * @param {function(string|null): void} props.onRate - Rating handler.
 * @returns {React.ReactElement} The DiscoveryActions component.
 */
export default function DiscoveryActions ({ saved, rating, onSave, onRate }) {
  const current = rating ? findRating(rating) : null

  return (
    <div className='flex flex-col items-center gap-3' aria-label='Discovery actions'>
      <IconButton
        onClick={onSave}
        icon={Bookmark}
        filled={saved}
        textColor={saved ? 'text-amber-400' : 'text-foreground'}
        strokeWidth={2}
        aria-label={saved ? 'Unsave' : 'Save'}
        title={saved ? 'Unsave' : 'Save'}
      />

      <RatingPicker
        rating={rating}
        onSelect={onRate}
        arrowFrom='right'
        onOpenChange={(open) => {
          if (open) return false
        }}
        trigger={() => (
          current
            ? (
              <button
                aria-label={`Rated ${current.label}`}
                title={`Rated ${current.label}`}
                className='flex items-center justify-center size-12 rounded-full bg-white/10 cursor-pointer hover:bg-white/20'
              >
                <img src={current.emoji} alt='' className='size-6 max-w-none' />
              </button>
              )
            : (
              <IconButton
                icon={Star}
                strokeWidth={2}
                aria-label='Rate'
                title='Rate'
              />
              )
        )}
      />
    </div>
  )
}
