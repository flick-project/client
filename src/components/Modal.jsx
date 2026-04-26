/**
 * Reusable modal component with backdrop.
 * @param {object} props - Component props.
 * @param {() => void} props.onClose - Callback to close the modal.
 * @param {React.ReactNode} props.children - Modal content.
 * @returns {React.ReactElement} The Modal component.
 */
export default function Modal ({ onClose, children }) {
  return (
    <div
      className='fixed inset-0 flex items-center justify-center bg-black/50 z-50'
      // Close on backdrop click. Uses onMouseDown with target check
      // to prevent closing when dragging on text inside the modal.
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className='flex flex-col gap-6 bg-surface-light rounded-lg p-6 w-96'>
        {children}
      </div>
    </div>
  )
}
