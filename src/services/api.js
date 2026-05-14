/**
 * @file API service for server communication.
 * @module services/api
 * @author Hans Nilsson
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1'

let authToken = null

export const setAuthToken = (token) => {
  authToken = token
}

// Shared promise to prevent concurrent refresh attempts.
let refreshPromise = null

/**
 * Send an authenticated request to the API.
 * Includes the JWT as a Bearer token if available,
 * and sends cookies (refresh token) with every request.
 * @param {string} endpoint - The API endpoint (e.g. '/auth/login').
 * @param {object} [options] - Fetch options (method, body, headers, etc.).
 * @returns {object} The parsed JSON response.
 * @throws {Error} If the response is not ok, with status and message from the server.
 */
export const apiRequest = async (endpoint, options = {}) => {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    // Sends refresh token with every request.
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      // Attach access token if there is one.
      ...(authToken && { Authorization: `Bearer ${authToken}` }),
      ...options.headers
    }
  })

  // Return early on success with no body (deletion, for instance).
  if (res.status === 204) return null

  // If unauthorized and not already trying to refresh, attempt a refresh.
  if (res.status === 401 && endpoint !== '/auth/refresh') {
    // Only one refresh at a time. If two requests both get 401,
    // the second one waits for the first instead of starting its own refresh,
    if (!refreshPromise) {
      refreshPromise = (async () => {
        const refreshRes = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: 'POST',
          credentials: 'include'
        })
        if (refreshRes.ok) {
          const data = await refreshRes.json()
          setAuthToken(data.access_token)
        } else {
          authToken = null
        }
      })()
    }
    try {
      // Wait for the already in progress refresh.
      await refreshPromise
    } finally {
      // Reset so future 401s can start a new refresh.
      refreshPromise = null
    }
    // Retry the original request with the new token.
    if (authToken) return apiRequest(endpoint, options)
  }

  const data = await res.json()

  if (!res.ok) {
    const error = new Error(data.message || 'Request failed.')
    error.status = res.status
    throw error
  }

  return data
}
