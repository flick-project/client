import { useState } from 'react'
import { X } from 'lucide-react'

/**
 * Reusable modal component with backdrop.
 * @param {object} props - Component props.
 * @param {boolean} [props.wide] - Whether to use a wider modal layout.
 * @param {() => void} props.onClose - Callback to close the modal.
 * @param {React.ReactNode} props.children - Modal content.
 * @returns {React.ReactElement} The Modal component.
 */
export default function Modal ({ onClose, wide, children }) {
  const [closing, setClosing] = useState(false)

  const handleClose = () => {
    setClosing(true)
    setTimeout(onClose, 150)
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 ${closing ? 'animate-out fade-out duration-150' : 'animate-in fade-in duration-200'}`}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) handleClose()
      }}
    >
      <div className={`relative flex flex-col bg-surface-light rounded-xl border border-white/10 shadow-xl px-6 pt-12 pb-6 max-h-[90vh] overflow-y-auto ${closing ? 'animate-out fade-out zoom-out-95 duration-150' : 'animate-in fade-in zoom-in-95 duration-200'} ${wide ? 'w-125' : 'w-96'}`}>
        <button
          onClick={handleClose}
          className='absolute top-4 right-4 text-gray-400 hover:text-white hover:bg-white/10 p-1.5 rounded-md cursor-pointer transition-colors'
        >
          <X size={16} />
        </button>
        {children}
      </div>
    </div>
  )
}
