import { useState, useEffect, useRef } from 'react'
import { apiRequest } from '../services/api.js'
import { usePageMetadata } from '../hooks/usePageMetadata.js'
import { useToast } from '../hooks/useToast'
import { useMovieOverlay } from '../hooks/useMovieOverlay.js'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import WatchlistCard from '../components/WatchlistCard.jsx'

const WATCHLIST_PAGE_LIMIT = 20

/**
 * Watchlist page where users manage their saved movies.
 *
 * Two unsave models coexist:
 *   1. Card button: "lazy" unsave. WatchlistCard owns its saved state
 *      and only hits the API here; the card stays visible until the
 *      next refresh so the user can change their mind.
 *   2. Overlay button: "eager" unsave. MovieOverlay hits the API and
 *      broadcasts via subscribe(); we remove the card immediately.
 *      Overlay re-saves within the same session bring the movie back
 *      to the top of the list (cached in removedRef).
 * @returns {React.ReactElement} The WatchlistPage component.
 */
export default function WatchlistPage () {
  const { showToast } = useToast()
  const { subscribe } = useMovieOverlay()
  const [page, setPage] = useState(1)
  const [movies, setMovies] = useState([])
  const [total, setTotal] = useState(null)
  const [hasMore, setHasMore] = useState(true)
  const loadingRef = useRef(false)
  const bottomRef = useRef(null)

  // Cache of movies unsaved via the overlay this session, keyed by
  // tmdb_id. Used to restore the card to the top if the user re-saves.
  const removedRef = useRef(new Map())

  usePageMetadata('Watchlist')

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

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loadingRef.current) {
        setPage(prev => prev + 1)
      }
    })
    if (bottomRef.current) observer.observe(bottomRef.current)
    return () => observer.disconnect()
  }, [hasMore])

  const handleCardToggleSave = async (movieId, nextSaved) => {
    try {
      if (nextSaved) {
        await apiRequest('/interactions', {
          method: 'POST',
          body: JSON.stringify({ movieId, interaction: 'saved' })
        })
      } else {
        await apiRequest(`/watchlist/${movieId}`, { method: 'DELETE' })
      }
    } catch (err) {
      console.error(err)
      showToast(err.message || 'Something went wrong. Please try again.', 'fail')
      throw err
    }
  }

  useEffect(() => {
    return subscribe((event) => {
      if (event.type !== 'save') return

      if (!event.saved) {
        // Overlay unsave: cache the movie so re-save can restore it,
        // then remove it from the list.
        setMovies(prev => {
          const removed = prev.find(m => m.tmdb_id === event.movieId)
          if (removed) removedRef.current.set(event.movieId, removed)
          return prev.filter(m => m.tmdb_id !== event.movieId)
        })
        setTotal(t => (t == null ? t : t - 1))
        return
      }

      // Overlay re-save: if we cached the movie earlier this session,
      // prepend it to the list. Otherwise it'll appear on next refresh.
      const cached = removedRef.current.get(event.movieId)
      if (cached) {
        removedRef.current.delete(event.movieId)
        setMovies(prev => {
          if (prev.some(m => m.tmdb_id === event.movieId)) return prev
          return [cached, ...prev]
        })
      }
      setTotal(t => (t == null ? t : t + 1))
    })
  }, [subscribe])

  const sortItems = [
    { label: 'Date added', value: 'date' }
  ]

  return (
    <div className='flex flex-col gap-4 lg:gap-6 p-6 max-w-7xl size-full max-lg:p-4'>
      <div className='flex items-center justify-between'>
        <span className='text-sm font-medium text-muted-foreground'>{`${total ?? '0'} movies`}</span>
        <>
          <Select items={sortItems} defaultValue='date'>
            <SelectTrigger size='sm' aria-label='Sort watchlist by'>
              <SelectValue placeholder='Sort by' />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {sortItems.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </>
      </div>
      {movies.length === 0 && hasMore && <p className='size-full flex justify-center mt-[25%] text-base font-normal text-gray-300'>Loading...</p>}
      {movies.length === 0 && !hasMore && <p className='size-full flex justify-center mt-[25%] text-base font-normal text-gray-300'>No saved movies yet.</p>}
      {movies.length > 0 && (
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:pb-6'>
          {movies.map(movie => (
            <WatchlistCard
              key={movie.tmdb_id}
              movie={movie}
              onToggleSave={(next) => handleCardToggleSave(movie.tmdb_id, next)}
            />
          ))}
          <div ref={bottomRef} />
        </div>
      )}
    </div>
  )
}
