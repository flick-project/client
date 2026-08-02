import { useState, useRef, useCallback } from 'react'
import { MovieOverlayContext } from './MovieOverlayContext.jsx'
import Modal from '../components/Modal.jsx'

/**
 * Provider that makes movie overlay functionality available to all children.
 * @param {object} props - Component props.
 * @param {React.ReactElement} props.children - Child components.
 * @returns {React.ReactElement} The provider component.
 */
export function MovieOverlayProvider ({ children }) {
  const [movieId, setMovieId] = useState(null)
  const listenersRef = useRef(new Set())

  const openOverlay = (id) => setMovieId(id)
  const closeOverlay = () => setMovieId(null)

  const subscribe = useCallback((fn) => {
    listenersRef.current.add(fn)
    return () => listenersRef.current.delete(fn)
  }, [])

  const notifyChange = useCallback((event) => {
    listenersRef.current.forEach(fn => fn(event))
  }, [])

  return (
    <MovieOverlayContext.Provider value={{ movieId, openOverlay, closeOverlay, notifyChange, subscribe }}>
      {children}
    </MovieOverlayContext.Provider>
  )
}
