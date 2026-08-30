import { use } from 'react'
import { AuthFlowContext } from '../context/AuthFlowContext.jsx'

/**
 * Hook to access AuthFlow functions.
 * @returns {object} AuthFlow context with requireAuth.
 */
export function useAuthFlow () {
  return use(AuthFlowContext)
}
