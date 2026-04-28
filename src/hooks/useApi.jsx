import { apiRequest } from '../services/api.js'
import { useAuth } from '../hooks/useAuth.js'
import { useCallback } from 'react'

/**
 * Hook that wraps apiRequest with automatic JWT authorization.
 * @returns {function(): void} Authenticated request function.
 */
export function useApi () {
  const { token } = useAuth()

  const authRequest = useCallback((endpoint, options = {}) => {
    return apiRequest(endpoint, {
      ...options,
      headers: {
        ...options.headers,
        ...(token && { Authorization: `Bearer ${token}` })
      }
    })
  }, [token])

  return authRequest
}
