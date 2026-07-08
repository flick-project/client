import { use } from 'react'
import { DiscoveryContext } from '../context/DiscoveryContext.jsx'

/**
 * Hook to access discovery queue functionality.
 * @returns {object} Queue state and functions.
 */
export function useDiscoveryQueue () {
  return use(DiscoveryContext)
}
