import { motion } from 'motion/react'
import { ArrowLeft } from 'lucide-react'
import { RATINGS } from '../utils/ratings'

/**
 * Inline rating picker for MovieOverlay.
 * @param {object} props - Component props.
 * @param {string|null} props.currentRating - The user's current rating.
 * @param {(value: string) => void} props.onRate - Called when user picks a rating.
 * @param {() => void} props.onCancel - Called when user cancels.
 * @returns {React.ReactElement} The InlineRatingPicker component.
 */
export default function InlineRatingPicker ({ currentRating, onRate, onCancel }) {
  return (
    <motion.div
      key='picker'
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.15 }}
      className='flex items-center gap-2'
    >
      <button
        onClick={onCancel}
        aria-label='Back'
        className='shrink-0 flex items-center justify-center w-11 h-11 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 cursor-pointer transition-colors'
      >
        <ArrowLeft size={20} />
      </button>
      <div className='flex gap-2 flex-1'>
        {RATINGS.map(r => (
          <button
            key={r.value}
            onClick={() => onRate(r.value)}
            className={`flex flex-col items-center justify-center gap-0.5 flex-1 py-2 rounded-lg transition-colors cursor-pointer min-h-11 ${
              currentRating === r.value
                ? `${r.activeClass} ring-1`
                : 'bg-white/5 hover:bg-white/10'
            }`}
          >
            <span className='text-xl' aria-hidden='true'>{r.emoji}</span>
            <span className='text-xs text-gray-200'>{r.label}</span>
          </button>
        ))}
      </div>
    </motion.div>
  )
}
