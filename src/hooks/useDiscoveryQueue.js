import { use } from 'react'
import { DiscoveryContext } from '../context/DiscoveryContext.jsx'
import { useAuthFlow } from './useAuthFlow.js'
import { AuthRequiredError } from '../utils/errors.js'

/**
 * Discovery queue with auth-gated mutations. Actions that require a
 * logged-in user throw AuthRequiredError (and open the auth modal)
 * instead of running when the user isn't authenticated. Read-only
 * fields stay ungated.
 * @returns {object} Queue state and actions.
 */
export function useDiscoveryQueue () {
  const ctx = use(DiscoveryContext)
  const { requireAuth } = useAuthFlow()

  const gate = (fn) => (...args) => {
    if (!requireAuth()) throw new AuthRequiredError()
    return fn(...args)
  }

  return {
    ...ctx,
    toggleSave: gate(ctx.toggleSave),
    setRating: gate(ctx.setRating),
    dismiss: gate(ctx.dismiss),
    updateCurrent: gate(ctx.updateCurrent),
    back: gate(ctx.back),
    next: gate(ctx.next)
  }
}
