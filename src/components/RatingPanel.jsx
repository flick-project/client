import { useState } from 'react'
import Button from './Button'

const ratings = [
  { value: 'hate', emoji: '😡', label: 'Hate' },
  { value: 'dislike', emoji: '😕', label: 'Dislike' },
  { value: 'like', emoji: '😊', label: 'Like' },
  { value: 'love', emoji: '😍', label: 'Love' },
]

/**
 * Rating panel with emoji-based options.
 * @param {object} props - Component props.
 * @param {string|null} props.currentRating - The active rating, or null.
 * @param {function(string): void} props.onRate - Called with the selected rating value.
 * @param {string} props.title - Movie title.
 * @returns {void}
 */
export default function RatingPanel ({ currentRating, onRate, title }) {
  const [selected, setSelected] = useState(currentRating)

  return (
    <div className='flex flex-col items-center gap-6'>
      <div className='flex flex-col items-center gap-1.5'>
        <h2 className='text-lg font-semibold text-center leading-tight'>{title}</h2>
        <p className='text-sm text-gray-400 leading-none'>How did you feel about it?</p>
      </div>

      <fieldset className='flex gap-2'>
        {ratings.map(({ value, emoji, label }) => (
          <label
            key={value}
            className={`flex flex-col items-center gap-1.5 px-4 py-3 rounded-lg cursor-pointer transition-all duration-150 ${
        selected === value
          ? 'opacity-100'
          : 'opacity-40 hover:opacity-90'
      }`}
          >
            <input
              type='radio'
              name='rating'
              value={value}
              checked={selected === value}
              onChange={() => setSelected(value)}
              className='sr-only'
            />
            <span className={`text-2xl transition-transform duration-150 ${selected === value ? 'scale-125' : 'group-hover:scale-110'}`}>
              {emoji}
            </span>
            <span className='text-xs text-gray-400 leading-none'>{label}</span>
          </label>
        ))}
      </fieldset>

      <Button
        type='button'
        onClick={() => onRate(selected)}
        disabled={!selected || selected === currentRating}
        full
      >
        {currentRating ? 'Update rating' : 'Rate'}
      </Button>
    </div>
  )
}
