import { CircleCheck, CircleX } from 'lucide-react'
import { useEffect } from 'react'

/**
 * Toast notification for displaying temporary messages.
 * @param {object} props - Component props.
 * @param {string} props.message - The message to display.
 * @param {'success' | 'error'} props.type - The type of notification.
 * @param {() => void} props.onClose - Callback to close the modal.
 * @returns {React.ReactElement} The Toast component.
 */
function Toast ({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000)
    return () => clearTimeout(timer)
  }, [onClose])

  const isSuccess = type === 'success'

  return (
    <div className={`fixed top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 p-4 rounded-lg ${isSuccess ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
      {type === 'success' ? <CircleCheck size={20} /> : <CircleX size={20} />}
      <p className='text-green-500 text-sm text-center'>{message}</p>
    </div>
  )
}

export default Toast
