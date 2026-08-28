import { motion, AnimatePresence } from 'motion/react'
import { X } from 'lucide-react'

/**
 * Reusable modal component with backdrop.
 * @param {object} props - Component props.
 * @param {boolean} props.isOpen - Whether the modal is open.
 * @param {boolean} [props.wide] - Whether to use a wider modal layout.
 * @param {() => void} props.onClose - Callback to close the modal.
 * @param {React.ReactNode} props.children - Modal content.
 * @returns {React.ReactElement} The Modal component.
 */
export default function Modal ({ isOpen, onClose, wide, children }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className='fixed inset-0 z-99 flex items-center justify-center bg-black/80 p-4'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) onClose()
          }}
        >
          <motion.div
            className={`relative flex flex-col bg-surface-light rounded-xl border border-white/10 shadow-xl px-6 pt-12 pb-6 max-h-[90vh] overflow-y-auto ${wide ? 'w-125' : 'w-96'}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
          >
            <button
              onClick={onClose}
              className='absolute top-2 right-2 text-muted-foreground hover:text-foreground hover:bg-white/10 p-2.5 rounded-md cursor-pointer transition-colors'
            >
              <X size={24} />
            </button>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
