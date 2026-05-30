import { useState } from 'react'

const animations = {
  scale: 'hover:scale-105 active:scale-95',
  lift: 'hover:-translate-y-1 hover:shadow-lg active:translate-y-0',
}

/**
 * Reusable icon button component.
 * @param {object} props - Component props.
 * @param {React.ComponentType} props.icon - Lucide icon component.
 * @param {string} [props.backgroundColor] - Tailwind background color class.
 * @param {string} [props.textColor] - Tailwind text color class.
 * @param {number} [props.strokeWidth] - Icon stroke width.
 * @param {boolean} [props.filled] - Whether the icon is filled.
 * @param {string} [props.animation] - Animation preset (scale, lift).
 * @param {string} [props.size] - Button size (big, small).
 * @param {boolean} [props.disabled] - Whether the button is disabled.
 * @param {string} [props.ariaLabel] - Aria label.
 * @param {string} [props.title] - Title.
 * @param {() => void} [props.onClick] - Click handler.
 * @returns {React.ReactElement} The IconButton component.
 */
export default function IconButton ({ icon, backgroundColor = 'bg-white/5', textColor = 'text-white', strokeWidth = 1.5, filled = false, animation, size = 'big', disabled, ariaLabel, title, onClick }) {
  const [clicked, setClicked] = useState(false)

  const handleClick = () => {
    if (!filled) {
      setClicked(true)
      setTimeout(() => setClicked(false), 150)
    }
    onClick?.()
  }

  const base = 'flex items-center justify-center aspect-1/1 rounded-full disabled:opacity-40 ring-1 ring-inset ring-white/10 hover:brightness-110'
  const padding = size === 'big' ? 'p-4' : 'p-3'
  const Icon = icon
  const iconSize = size === 'big' ? 32 : 24

  return (
    <button
      className={`${base} ${padding} ${backgroundColor} ${textColor} ${disabled ? 'cursor-not-allowed' : `cursor-pointer ${animations[animation] || ''}`} transition-all duration-150`}
      disabled={disabled}
      aria-label={ariaLabel}
      title={title}
      onClick={handleClick}
    >
      <Icon
        size={iconSize}
        strokeWidth={strokeWidth}
        fill={filled || clicked ? 'currentColor' : 'none'}
        className='transition-all duration-150'
      />
    </button>
  )
}
