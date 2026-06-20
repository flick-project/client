const QUEUE_KEY = 'discovery_queue'

/**
 * Retrieves the discovery queue from localStorage.
 * @returns {object[]|null} Saved queue or null if unavailable.
 */
export function getQueue () {
  try {
    const data = localStorage.getItem(QUEUE_KEY)
    return data ? JSON.parse(data) : null
  } catch {
    return null
  }
}

/**
 * Saves the discovery queue to localStorage.
 * @param {object[]} movies Movies to be saved.
 */
export function saveQueue (movies) {
  try {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(movies))
  } catch {
    // storage unavailable, continue without persistence.
  }
}

/**
 * Clears the discovery queue from localStorage.
 */
export function clearQueue () {
  try {
    localStorage.removeItem(QUEUE_KEY)
  } catch {}
}
