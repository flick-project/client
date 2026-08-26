import { useState } from 'react'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { RATINGS } from '../utils/ratings.js'

/**
 * Rating picker popover. Renders emoji row for selecting a rating.
 * Consumer provides the trigger via `trigger` as a render function that
 * takes no arguments. PopoverTrigger auto-binds click and ARIA state to
 * the returned element via Base UI's render prop composition.
 * Open state is controlled locally so the popover closes on select.
 * Modal mode prevents outside clicks from reaching underlying tap zones
 * (e.g. the poster/trailer switch on discovery cards).
 * @param {object} props - Component props.
 * @param {string|null} [props.rating] - Current rating value.
 * @param {function(string|null): void} props.onSelect - Called when an emoji is picked.
 * @param {'top'|'bottom'|'left'|'right'} props.arrowFrom - Which side of the popover the arrow points from. Maps to Popover's `side`.
 * @param {() => React.ReactElement} props.trigger - Renders the trigger element.
 * @returns {React.ReactElement} The RatingPicker component.
 */
export default function RatingPicker ({ rating, onSelect, arrowFrom, trigger }) {
  const [open, setOpen] = useState(false)

  const select = (value) => {
    onSelect(value === rating ? null : value)
    setOpen(false)
  }

  const sideMap = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' }

  return (
    <Popover open={open} onOpenChange={setOpen} modal>
      <PopoverTrigger render={trigger()} />
      <PopoverContent
        side={sideMap[arrowFrom]}
        className='w-auto p-1 rounded-2xl bg-gray-800 border-gray-700'
      >
        <div className='flex items-center gap-1.5'>
          {RATINGS.map(r => {
            const selected = rating === r.value
            return (
              <button
                key={r.value}
                onClick={() => select(r.value)}
                aria-label={selected ? `${r.label}, tap to clear` : r.label}
                aria-pressed={selected}
                title={r.label}
                style={{ transition: 'transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1)' }}
                className={`flex items-center justify-center size-11 rounded-full cursor-pointer hover:scale-115 hover:opacity-100 ${rating && rating !== r.value ? 'opacity-60' : ''} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`}
              >
                <img src={r.emoji} alt='' className='size-7 max-w-none' />
              </button>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}
