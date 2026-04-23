import { useState } from 'react'
import { AuthContext } from './AuthContext.jsx'

/**
 * Provider that makes auth functionality available to all children.
 * @param {object} props - Component props.
 * @param {React.ReactElement} props.children - Child components.
 * @returns {React.ReactElement} The provider component.
 */
export function AuthProvider ({ children }) {
  const [auth, setAuth] = useState(null)

  return (
    <AuthContext value={{ auth, setAuth }}>
      {children}
    </AuthContext>
  )
}
