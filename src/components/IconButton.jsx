import { useState } from 'react'

/**
 * Reusable icon button component.
 * @param {object} props - Component props.
 * @param {React.ComponentType} props.icon - Lucide icon component.
 * @param {string} [props.backgroundColor] - Tailwind background color class.
 * @param {string} [props.borderColor] - Tailwind border color class.
 * @param {string} [props.textColor] - Tailwind text color class.
 * @param {boolean} [props.disabled] - Whether the button is disabled.
 * @param {() => void} [props.onClick] - Click handler.
 * @returns {React.ReactElement} The IconButton component.
 */
export default function IconButton ({ icon, backgroundColor, borderColor, textColor, disabled, onClick }) {
  const [clicked, setClicked] = useState(false)

  const handleClick = () => {
    setClicked(true)
    setTimeout(() => {
      setClicked(false)
      onClick?.()
    }, 150)
  }

  const base = 'flex items-center justify-center aspect-1/1 p-4 rounded-full border-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
  const Icon = icon

  return (
    <button
      className={`${base} ${backgroundColor} ${borderColor} ${textColor} hover:scale-105 active:scale-95 transition-all duration-150`}
      disabled={disabled}
      onClick={handleClick}
    >
      <Icon size={32} strokeWidth='1.5' fill='currentColor' fillOpacity={clicked ? 1 : 0} className='transition-all duration-150' />
    </button>
  )
}
