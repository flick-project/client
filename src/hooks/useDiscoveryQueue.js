import { use } from 'react'
import { DiscoveryContext } from '../context/DiscoveryContext.jsx'

/**
 *
 */
export function useDiscoveryQueue () {
  return use(DiscoveryContext)
}
