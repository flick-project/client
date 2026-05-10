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
  return (
    <div
      className='fixed inset-0 flex items-center justify-center bg-black/50 z-50'
      // Close on backdrop click. Uses onMouseDown with target check
      // to prevent closing when dragging on text inside the modal.
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className={`flex flex-col gap-6 bg-surface-light rounded-xl border border-white/10 p-6 ${wide ? 'w-125' : 'w-96'}`}>
        <div className='flex flex-col gap-2'>
          <div className='flex justify-end'>
            <button onClick={onClose} className='bg-surface text-gray-400 p-2 rounded-full cursor-pointer'>
              <X size={20} />
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
