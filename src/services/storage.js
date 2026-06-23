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
 * Checks if a localStorage key exists.
 * @param {string} key - The key to check.
 * @returns {boolean} Whether the key exists.
 */
export function hasSeen (key) {
  return localStorage.getItem(key) !== null
}

/**
 * Marks a localStorage key as seen.
 * @param {string} key - The key to mark.
 */
export function markSeen (key) {
  localStorage.setItem(key, 'true')
}
