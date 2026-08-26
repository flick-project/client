import { useRef, useCallback } from 'react'
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom'
import { MovieOverlayContext } from './MovieOverlayContext.jsx'

/**
 * Provider that makes movie overlay functionality available to all children.
 * Uses URL search params (?movie=id&trailer) as source of truth so the
 * browser back button works natively.
 * @param {object} props - Component props.
 * @param {React.ReactElement} props.children - Child components.
 * @returns {React.ReactElement} The provider component.
 */
export function MovieOverlayProvider ({ children }) {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const location = useLocation()
  const listenersRef = useRef(new Set())

  const movieParam = searchParams.get('movie')
  const movieId = movieParam && !isNaN(movieParam) ? Number(movieParam) : null
  const showTrailer = searchParams.has('trailer')

  const openOverlay = (id) => {
    navigate(`${location.pathname}?movie=${id}`)
  }

  const closeOverlay = () => {
    if (!movieId) return
    navigate(-1)
  }

  const openTrailer = () => {
    navigate(`${location.pathname}?movie=${movieId}&trailer`)
  }

  const closeTrailer = () => {
    if (!showTrailer) return
    navigate(-1)
  }

  const subscribe = useCallback((fn) => {
    listenersRef.current.add(fn)
    return () => listenersRef.current.delete(fn)
  }, [])

  const notifyChange = useCallback((event) => {
    listenersRef.current.forEach(fn => fn(event))
  }, [])

  return (
    <MovieOverlayContext.Provider value={{ movieId, showTrailer, openOverlay, closeOverlay, openTrailer, closeTrailer, notifyChange, subscribe }}>
      {children}
    </MovieOverlayContext.Provider>
  )
}
