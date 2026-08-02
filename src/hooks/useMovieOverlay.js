import { useContext } from 'react'
import { MovieOverlayContext } from '../context/MovieOverlayContext'

/**
 * Hook to access movie overlay functionality.
 * @returns {object} Queue state and functions.
 */
export function useMovieOverlay () {
  const context = useContext(MovieOverlayContext)
  if (!context) throw new Error('useMovieOverlay must be used within MovieOverlayProvider')
  return context
}
