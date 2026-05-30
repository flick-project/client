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
    <div className='flex flex-col items-center gap-8'>
      <div className='flex flex-col items-center gap-2'>
        <h2 className='text-xl font-bold text-center'>{title}</h2>
        <p className='text-sm text-gray-400 leading-none'>How did you feel about it?</p>
      </div>
      <fieldset className='flex gap-6'>
        {ratings.map(({ value, emoji, label }) => (
          <label
            key={value}
            className={`group flex flex-col items-center cursor-pointer ${selected === value ? '' : 'opacity-50 hover:opacity-100'}`}
          >
            <input
              type='radio'
              name='rating'
              value={value}
              checked={selected === value}
              onChange={() => setSelected(value)}
              className='sr-only'
            />
            <span className='text-3xl transition-all duration-150 group-hover:scale-110 group-hover:-translate-y-px'>
              {emoji}
            </span>
            <span className='text-xs text-gray-400 mt-1 leading-none'>{label}</span>
          </label>
        ))}
      </fieldset>
      <Button onClick={() => onRate(selected)} disabled={!selected || selected === currentRating} full>
        Rate
      </Button>
    </div>
  )
}
