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
function Toast ({ message, type, onClose }) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Start fading out before removing.
    const fadeTimer = setTimeout(() => setIsVisible(false), 4500)
    const removeTimer = setTimeout(onClose, 5000)

    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(removeTimer)
    }
  }, [onClose])

  const isSuccess = type === 'success'

  return (
    <div className={`fixed top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 p-4 rounded-lg shadow-md transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'} ${isSuccess ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
      {type === 'success' ? <CircleCheck size={20} /> : <CircleX size={20} />}
      <p className='text-green-500 text-sm text-center'>{message}</p>
    </div>
  )
}

export default Toast
