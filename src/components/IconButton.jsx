import { useState } from 'react'

const animations = {
  scale: 'hover:scale-105 active:scale-95',
  lift: 'hover:-translate-y-1 hover:shadow-lg active:translate-y-0',
}

const sizes = {
  sm: { padding: 'p-3', iconSize: 24 },
  md: { padding: 'p-4', iconSize: 32 },
}

/**
 * Reusable icon button component.
 * @param {object} props - Component props.
 * @param {React.ComponentType} props.icon - Lucide icon component.
 * @param {string} [props.backgroundColor] - Tailwind background color class.
 * @param {string} [props.textColor] - Tailwind text color class.
 * @param {number} [props.strokeWidth] - Icon stroke width.
 * @param {boolean} [props.filled] - Whether the icon should appear filled.
 * @param {'scale' | 'lift'} [props.animation] - Animation preset.
 * @param {'sm' | 'md'} [props.size] - Button size.
 * @param {boolean} [props.disabled] - Whether the button is disabled.
 * @param {string} [props.className] - Additional CSS classes.
 * @returns {React.ReactElement} The IconButton component.
 */
export default function IconButton ({
  icon: Icon,
  backgroundColor = 'bg-white/5',
  textColor = 'text-white',
  strokeWidth = 1.5,
  filled = false,
  animation,
  size = 'md',
  disabled,
  className = '',
  ...rest
}) {
  const [clicked, setClicked] = useState(false)

  const handleClick = (e) => {
    if (!filled) {
      setClicked(true)
      setTimeout(() => setClicked(false), 150)
    }
    rest.onClick?.(e)
  }

  const { padding, iconSize } = sizes[size] ?? sizes.md

  return (
    <button
      disabled={disabled}
      className={[
        'flex items-center justify-center aspect-square rounded-full',
        'ring-1 ring-inset ring-white/10 hover:brightness-110',
        'transition-all duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900',
        'disabled:opacity-40 disabled:cursor-not-allowed',
        disabled ? '' : `cursor-pointer ${animations[animation] || ''}`,
        padding,
        backgroundColor,
        textColor,
        className,
      ].join(' ')}
      {...rest}
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
