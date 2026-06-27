import { useState, useCallback } from 'react'
import { ToastContext } from './ToastContext.jsx'

/**
 * Provider that makes toast functionality available to all children.
 * @param {object} props - Component props.
 * @param {React.ReactElement} props.children - Child components.
 * @returns {React.ReactElement} The provider component.
 */
export function ToastProvider ({ children }) {
  const [toast, setToast] = useState(null)

  const showToast = useCallback((message, type = 'success') => {
    setToast(null)
    requestAnimationFrame(() => setToast({ message, type }))
  }, [])

  return (
    <ToastContext value={{ toast, setToast, showToast }}>
      {children}
    </ToastContext>
  )
}
