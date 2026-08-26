import { useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { X } from 'lucide-react'

/**
 * Modal for playing a movie trailer. Pure presentational — the parent
 * owns open state and provides the YouTube video key. Renders as a
 * centered overlay with a backdrop; closes on backdrop click or Escape.
 * @param {object} props - The component props.
 * @param {boolean} props.isOpen - Whether the modal is open.
 * @param {string} [props.trailerKey] - The YouTube video key.
 * @param {string} [props.title] - The movie title, shown in the header.
 * @param {number} [props.year] - The release year, shown next to the title.
 * @param {() => void} props.onClose - Called when the user closes the modal.
 * @param {() => void} props.onBackdropClick - Closes both trailer and overlay when called.
 * @returns {React.ReactElement} The TrailerModal component.
 */
export default function TrailerModal ({ isOpen, trailerKey, title, year, onClose, onBackdropClick }) {
  useEffect(() => {
    if (!isOpen) return
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && trailerKey && (
        <motion.div
          className='fixed inset-0 z-10002 flex items-center justify-center bg-black/80 p-4 lg:p-6'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onMouseDown={(e) => {
            if (e.button === 0 && e.target === e.currentTarget) {
              (onBackdropClick ?? onClose)()
            }
          }}
        >
          <motion.div
            className='w-full max-w-4xl bg-black rounded-xl border border-gray-800 overflow-hidden flex flex-col'
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.2 }}
            role='dialog'
            aria-modal='true'
            aria-label={title ? `${title} trailer` : 'Trailer'}
          >
            <div className='shrink-0 flex items-center justify-between gap-3 pl-4 pr-2 py-2'>
              <p className='text-sm font-medium text-gray-100 truncate min-w-0'>
                {title}
                {year && <span className='text-gray-400'> ({year})</span>}
              </p>
              <button
                onClick={onClose}
                autoFocus
                aria-label='Close trailer'
                className='shrink-0 flex items-center justify-center size-11 rounded-lg text-gray-400 hover:text-gray-100 hover:bg-white/20 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400'
              >
                <X size={20} aria-hidden='true' />
              </button>
            </div>
            <div className='relative w-full aspect-video bg-black'>
              <iframe
                src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&playsinline=1&rel=0`}
                allow='autoplay; encrypted-media; fullscreen'
                allowFullScreen
                className='size-full'
                title={title ? `${title} trailer` : 'Trailer'}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
