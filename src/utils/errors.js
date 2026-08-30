// src/utils/errors.js

/**
 * Thrown by gated actions when the user isn't authenticated.
 * Callers should catch and silently return — the auth modal has
 * already been opened by the gate.
 */
export class AuthRequiredError extends Error {
  constructor () {
    super('Authentication required')
    this.name = 'AuthRequiredError'
  }
}

/**
 * Runs fn, swallows AuthRequiredError (the auth modal has already
 * been opened by the gate), re-throws everything else.
 * @param {void} fn - Function to run.
 * @returns {void} fn's return value, or undefined if auth was required.
 */
export const withAuthGate = async (fn) => {
  try {
    return await fn()
  } catch (err) {
    if (err instanceof AuthRequiredError) return
    throw err
  }
}
