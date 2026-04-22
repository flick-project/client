import { useContext } from 'react'
import { ToastContext } from '../context/ToastContext.jsx'

/**
 * Hook to access toast functionality.
 * @returns {object} Toast state and showToast function.
 */
export function useToast () {
  return useContext(ToastContext)
}
