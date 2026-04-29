import { useState } from 'react'
import { AuthContext } from './AuthContext.jsx'
import { setAuthToken } from '../services/api.js'
import { SquareUser } from 'lucide-react'

/**
 * Provider that makes auth functionality available to all children.
 * @param {object} props - Component props.
 * @param {React.ReactElement} props.children - Child components.
 * @returns {React.ReactElement} The provider component.
 */
export function AuthProvider ({ children }) {
  const [token, setToken] = useState(null)
  const [user, setUser] = useState(null)

  const login = (newToken) => {
    setToken(newToken)
    setAuthToken(newToken)

    // Decode base64 to store user info.
    const payload = JSON.parse(atob(newToken.split('.')[1]))
    setUser({
      id: payload.id,
      email: payload.email,
      displayName: payload.display_name
    })
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    setAuthToken(null)
  }

  return (
    <AuthContext value={{ token, user, login, logout }}>
      {children}
    </AuthContext>
  )
}
