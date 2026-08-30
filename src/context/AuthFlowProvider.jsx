import { useState, useEffect, useMemo, useRef, lazy, Suspense } from 'react'
import { AuthFlowContext } from './AuthFlowContext.jsx'
import { useAuth } from '../hooks/useAuth.js'

const AuthFlow = lazy(() => import('../components/AuthFlow.jsx'))

/**
 * Provides the auth flow modal and the requireAuth gate to the app.
 * requireAuth returns true if the user is logged in, otherwise opens
 * the login modal and returns false — used by gated actions to prompt
 * login before mutating state.
 *
 * openAuthFlow accepts an optional { reopenAfterAuth } callback that
 * fires after successful login/register. Used to restore context that
 * was dismissed to make room for the login modal (e.g. reopening the
 * movie overlay a user was in when they clicked Save unauthed).
 * @param {object} props - Component props.
 * @param {React.ReactElement} props.children - Child components.
 * @returns {React.ReactElement} The AuthFlowProvider component.
 */
export function AuthFlowProvider ({ children }) {
  const [isOpen, setIsOpen] = useState(false)
  const { user } = useAuth()
  const reopenRef = useRef(null)
  const wasOpenRef = useRef(false)

  useEffect(() => {
    // Runs after the batched render that closes the modal, so `user`
    // reflects post-login state.
    if (wasOpenRef.current && !isOpen) {
      if (user && reopenRef.current) {
        // Auth succeeded — fire the pending reopen.
        const fn = reopenRef.current
        reopenRef.current = null
        fn()
      } else if (!user) {
        // Dismissed without auth — cancel pending reopen.
        reopenRef.current = null
      }
    }
    wasOpenRef.current = isOpen
  }, [isOpen, user])

  const value = useMemo(() => ({
    openAuthFlow: (opts = {}) => {
      // Only queue reopen when the user is actually unauthed — otherwise
      // there'll be no auth event to trigger it.
      if (opts.reopenAfterAuth && !user) reopenRef.current = opts.reopenAfterAuth
      setIsOpen(true)
    },
    requireAuth: (opts) => {
      if (!user) {
        if (opts?.reopenAfterAuth) reopenRef.current = opts.reopenAfterAuth
        setIsOpen(true)
        return false
      }
      return true
    }
  }), [user])

  return (
    <AuthFlowContext value={value}>
      {children}
      {isOpen && (
        <Suspense fallback={null}>
          <AuthFlow isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </Suspense>
      )}
    </AuthFlowContext>
  )
}
