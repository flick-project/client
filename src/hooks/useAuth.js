import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext.jsx'

/**
 * Hook to access auth functionality.
 * @returns {object} ...
 */
export function useAuth () {
  return useContext(AuthContext)
}
