import { useState, useEffect } from 'react'
import { AuthContext } from './AuthContext.jsx'
import { apiRequest, setAuthToken, setSessionExpiredCallback } from '../services/api.js'
/**
 * Provider that makes auth functionality available to all children.
 * @param {object} props - Component props.
 * @param {React.ReactElement} props.children - Child components.
 * @returns {React.ReactElement} The provider component.
 */
export function AuthProvider ({ children }) {
  const [token, setToken] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const login = (response) => {
    const { access_token: accessToken, gravatar } = response
    setToken(accessToken)
    setAuthToken(accessToken)

    // Decode base64 to store user info.
    const payload = JSON.parse(atob(accessToken.split('.')[1]))
    const userData = {
      id: payload.id,
      email: payload.email,
      displayName: payload.display_name,
      gravatar
    }
    setUser(userData)
    return userData
  }

  const logout = async () => {
    try {
      await apiRequest('/auth/logout', { method: 'POST' })
    } catch {
    // Logout failed, clear local state anyway.
    }
    setToken(null)
    setUser(null)
    setAuthToken(null)
  }

  useEffect(() => {
    const refreshToken = async () => {
      try {
        const result = await apiRequest('/auth/refresh', { method: 'POST' })
        login(result)
      } catch {
        // No valid refresh token, user stays logged out.
      } finally {
        setLoading(false)
      }
    }
    refreshToken()
  }, [])

  useEffect(() => {
    setSessionExpiredCallback(() => {
      setToken(null)
      setUser(null)
      setAuthToken(null)
    })
  }, [])

  return (
    <AuthContext value={{ token, user, login, logout, loading }}>
      {children}
    </AuthContext>
  )
}
