import { useEffect, useState } from 'react'
import { CircleCheck, CircleX } from 'lucide-react'

/**
 * Toast notification for displaying temporary messages.
 * @param {object} props - Component props.
 * @param {string} props.message - The message to display.
 * @param {'success' | 'error'} props.type - The type of notification.
 * @param {() => void} props.onClose - Callback to close the modal.
 * @returns {React.ReactElement} The Toast component.
 */
export default function Toast ({ message, type, onClose }) {
  const [isVisible, setIsVisible] = useState(true)
  const [barActive, setBarActive] = useState(false)
  const timer = 5000

  useEffect(() => {
    // Start fading out before removing.
    const fadeTimer = setTimeout(() => setIsVisible(false), timer)
    const removeTimer = setTimeout(onClose, timer + 500)

    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(removeTimer)
    }
  }, [onClose])

  useEffect(() => {
    requestAnimationFrame(() => setBarActive(true))
  }, [])

  const isSuccess = type === 'success'

  return (
    <div className={`fixed top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 p-4 rounded-lg border shadow-lg/20 overflow-hidden transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'} ${isSuccess ? 'bg-green-900 border-green-500 text-green-500' : 'bg-red-950 border-red-500 text-red-500'}`}>
      {isSuccess ? <CircleCheck size={20} color='currentColor' /> : <CircleX size={20} color='currentColor' />}
      <p className='text-sm text-center'>{message}</p>

      <div className={`absolute bottom-0 left-0 h-1 ${isSuccess ? 'bg-green-500' : 'bg-red-500'} bg-green-300 transition-all ${isVisible ? 'w-full' : 'w-0'}`} style={{ transitionDuration: `${timer}ms`, width: barActive ? '0%' : '100%' }} />
    </div>
  )
}
