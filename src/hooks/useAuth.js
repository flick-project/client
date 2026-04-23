import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext.jsx'

/**
 * Hook to access authentication state and actions.
 * @returns {object} Auth context with token, user, login and logout.
 */
export function useAuth () {
  return useContext(AuthContext)
}
