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
 * Send a request to the API.
 * @param {string} endpoint - The API endpoint.
 * @param {object} [options] - Fetch options.
 * @returns {object} The parsed response data.
 */
export const apiRequest = async (endpoint, options = {}) => {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(authToken && { Authorization: `Bearer ${authToken}` }),
      ...options.headers
    }
  })
  const data = await res.json()
  if (!res.ok) {
    const error = new Error(data.message || 'Request failed.')
    error.status = res.status
    throw error
  }
  return data
}
