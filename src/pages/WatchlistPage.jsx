import { useState, useEffect, useRef } from 'react'
import { apiRequest } from '../services/api.js'
import { usePageMetadata } from '../hooks/usePageMetadata.js'
import { useToast } from '../hooks/useToast'
import { ChevronDown } from 'lucide-react'
import { useMovieOverlay } from '../hooks/useMovieOverlay.js'
import WatchlistCard from '../components/WatchlistCard.jsx'
import Modal from '../components/Modal.jsx'
import RatingPanel from '../components/RatingPanel.jsx'

const WATCHLIST_PAGE_LIMIT = 20

/**
 * Watchlist page where users manage their saved movies.
 * @returns {React.ReactElement} The WatchlistPage component.
 */
export default function WatchlistPage () {
  const { showToast } = useToast()
  const { subscribe } = useMovieOverlay()
  const [page, setPage] = useState(1)
  const [movies, setMovies] = useState([])
  const [total, setTotal] = useState(null)
  const [hasMore, setHasMore] = useState(true)
  const [ratingMovie, setRatingMovie] = useState(null)
  const loadingRef = useRef(false)
  const bottomRef = useRef(null)

  usePageMetadata('Watchlist')

  // Fetch the next page of saved movies when page changes.
  useEffect(() => {
    const fetchMovies = async () => {
      loadingRef.current = true

      try {
        const result = await apiRequest(`/watchlist?page=${page}&limit=${WATCHLIST_PAGE_LIMIT}`)
        setMovies(prev => {
          const existingIds = new Set(prev.map(m => m.tmdb_id))
          const newMovies = result.movies.filter(m => !existingIds.has(m.tmdb_id))
          return [...prev, ...newMovies]
        })

        setHasMore(result.movies.length >= WATCHLIST_PAGE_LIMIT)
        setTotal(result.total)
      } catch (err) {
        console.error(err)
        setHasMore(false)
      } finally {
        loadingRef.current = false
      }
    }
    fetchMovies()
  }, [page])

  // Load more movies when the user scrolls to the bottom.
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loadingRef.current) {
        setPage(prev => prev + 1)
      }
    })
    if (bottomRef.current) observer.observe(bottomRef.current)
    return () => observer.disconnect()
  }, [hasMore, movies.length])

  const handleToggleSave = async (movieId, wasSaved) => {
    try {
      wasSaved
        ? await apiRequest(`/watchlist/${movieId}`, { method: 'DELETE' })
        : await apiRequest('/interactions', { method: 'POST', body: JSON.stringify({ movieId, interaction: 'saved' }) })
    } catch (err) {
      console.error(err)
      showToast((err.message || 'Something went wrong. Please try again.'), 'fail')
    }
  }

  const handleRate = async (rating) => {
    try {
      const body = { movieId: ratingMovie.tmdb_id, rating }
      await apiRequest('/ratings', { method: 'POST', body: JSON.stringify(body) })
      setMovies(prev => prev.map(m => m.tmdb_id === ratingMovie.tmdb_id ? { ...m, rating } : m))
      setRatingMovie(null)
    } catch (err) {
      console.error(err)
      showToast((err.message || 'Something went wrong. Please try again.'), 'fail')
    }
  }

  useEffect(() => {
    return subscribe((event) => {
      if (event.type === 'save' && !event.saved) {
        setMovies(prev => prev.filter(m => m.tmdb_id !== event.movieId))
      }
    })
  }, [subscribe])

  return (
    <div className='flex flex-col gap-4 lg:gap-6 p-6 max-w-7xl size-full max-lg:p-4'>
      <div className='flex items-center justify-between'>
        <span className='text-sm font-medium text-gray-300'>{`${total ?? '0'} movies`}</span>
        <div className='relative'>
          <select
            className='appearance-none pr-6 rounded-sm text-sm font-medium text-gray-300'
            aria-label='Sort watchlist by'
          >
            <option value='date'>Sort by: Date added</option>
          </select>
          <ChevronDown size={16} className='absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400' />
        </div>
      </div>
      {movies.length === 0 && hasMore && <p className='size-full flex justify-center mt-[25%] text-base font-normal text-gray-300'>Loading...</p>}
      {movies.length === 0 && !hasMore && <p className='size-full flex justify-center mt-[25%] text-base font-normal text-gray-300'>No saved movies yet.</p>}
      {movies.length > 0 && (
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:pb-6'>
          {movies.map(movie => (
            <WatchlistCard
              key={movie.tmdb_id} movie={movie}
              onSave={(wasSaved) => handleToggleSave(movie.tmdb_id, wasSaved)}
              onRate={() => setRatingMovie(movie)}
            />
          ))}
          <div ref={bottomRef} />
        </div>
      )}
      {ratingMovie && (
        <Modal onClose={() => setRatingMovie(null)}>
          <RatingPanel currentRating={ratingMovie.rating} onRate={handleRate} title={ratingMovie.title} />
        </Modal>
      )}
    </div>
  )
}
