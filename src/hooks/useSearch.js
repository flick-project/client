import { useSearchParams, useNavigate, useLocation } from 'react-router-dom'

/**
 * URL-driven search modal state. Mirrors useMovieOverlay's pattern —
 * ?search=1 opens the modal, browser back closes it. Stackable with
 * the overlay: picking a movie from search adds ?movie=id alongside
 * ?search=1, so closing the overlay returns the user to their results.
 * @returns {object} Search state and controls.
 */
export function useSearch () {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const location = useLocation()

  const searchOpen = searchParams.has('search')

  const openSearch = () => {
    const next = new URLSearchParams(searchParams)
    next.set('search', '1')
    navigate(`${location.pathname}?${next}`)
  }

  const closeSearch = () => {
    if (!searchOpen) return
    navigate(-1)
  }

  return { searchOpen, openSearch, closeSearch }
}
