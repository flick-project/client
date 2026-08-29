import { useState, useMemo } from 'react'
import { AuthFlowContext } from './AuthFlowContext.jsx'
import AuthFlow from '../components/AuthFlow.jsx'
import { useAuth } from '../hooks/useAuth.js'

/**
 * Provides the auth flow modal and the requireAuth gate to the app.
 * requireAuth returns true if the user is logged in, otherwise opens
 * the login modal and returns false — used by gated actions to prompt
 * login before mutating state.
 * @param {object} props - Component props.
 * @param {React.ReactElement} props.children - Child components.
 * @returns {React.ReactElement} The AuthFlowProvider component.
 */
export function AuthFlowProvider ({ children }) {
  const [isOpen, setIsOpen] = useState(false)
  const { user } = useAuth()

  const value = useMemo(() => ({
    openAuthFlow: () => setIsOpen(true),
    requireAuth: () => {
      if (!user) {
        setIsOpen(true)
        return false
      }
      return true
    }
  }), [user])

  return (
    <AuthFlowContext value={value}>
      {children}
      <AuthFlow isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </AuthFlowContext>
  )
}
