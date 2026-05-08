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
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(authToken && { Authorization: `Bearer ${authToken}` }),
      ...options.headers
    }
  })

  // If 401 and not already trying to refresh, attempt a silent refresh.
  if (res.status === 401 && endpoint !== '/auth/refresh') {
    const refreshRes = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include'
    })

    if (refreshRes.ok) {
      const refreshData = await refreshRes.json()
      setAuthToken(refreshData.access_token)

      // Retry the original request with the new token.
      return apiRequest(endpoint, options)
    }
  }

  const data = await res.json()

  if (!res.ok) {
    const error = new Error(data.message || 'Request failed.')
    error.status = res.status
    throw error
  }

  return data
}
