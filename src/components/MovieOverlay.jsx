import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useMovieOverlay } from '../hooks/useMovieOverlay'
import { motion, AnimatePresence } from 'motion/react'
import { apiRequest } from '../services/api'
import { backdropUrl } from '../utils/imageUtils'
import { X, Play, Star } from 'lucide-react'
import { Sheet } from 'react-modal-sheet'
import { useToast } from '../hooks/useToast'
import { Button } from '@/components/ui/button'
import OverlayActions from './OverlayActions'
import TrailerModal from './TrailerModal'

const currencyFormat = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 1
})

/**
 * Global movie detail overlay, driven by MovieOverlayContext.
 * Desktop: centered modal with a stacked TrailerModal for playback.
 * Mobile: bottom sheet whose content is replaced by an inline trailer
 * view when playback starts, avoiding stacked modals (an established
 * mobile UX anti-pattern per NN/G).
 * @returns {React.ReactElement} The MovieOverlay component.
 */
export default function MovieOverlay () {
  const { movieId, closeOverlay, notifyChange, showTrailer, openTrailer, closeTrailer } = useMovieOverlay()
  const { showToast } = useToast()
  const location = useLocation()
  const navigate = useNavigate()
  const [movie, setMovie] = useState(null)
  const [heroLoaded, setHeroLoaded] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024)
  const [saved, setSaved] = useState(false)
  const [userRating, setUserRating] = useState(null)
  const [watched, setWatched] = useState(false)
  const [error, setError] = useState(false)
  const [retryKey, setRetryKey] = useState(0)

  // Reset trailer when overlay closes or movie changes so a stale
  // showTrailer state doesn't linger between different movies.
  useEffect(() => {
    if (!movieId && showTrailer) closeTrailer()
  }, [movieId, showTrailer, closeTrailer])

  useEffect(() => {
    /**
     *
     */
    async function fetchMovie () {
      if (!movieId) {
        setMovie(null)
        setError(false)
        return
      }
      setHeroLoaded(false)
      setError(false)
      try {
        const data = await apiRequest(`/movies/${movieId}/details`)
        setMovie(data)
      } catch (err) {
        console.error(err)
        setError(true)
      }
    }
    fetchMovie()
  }, [movieId, retryKey])

  useEffect(() => {
    /**
     *
     */
    async function syncInteractionState () {
      setSaved(movie?.saved ?? false)
      setUserRating(movie?.user_rating ?? null)
      setWatched(movie?.watched ?? false)
    }
    syncInteractionState()
  }, [movie])

  useEffect(() => {
    if (!movieId) return
    const check = () => setIsMobile(window.innerWidth < 1024)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [movieId])

  const handleSave = async () => {
    if (!movie) return
    const wasSaved = saved
    setSaved(!wasSaved)
    try {
      wasSaved
        ? await apiRequest(`/watchlist/${movie.id}`, { method: 'DELETE' })
        : await apiRequest('/interactions', {
          method: 'POST',
          body: JSON.stringify({ movieId: movie.id, interaction: 'saved' })
        })
      notifyChange({ type: 'save', movieId: movie.id, saved: !wasSaved })
    } catch (err) {
      console.error(err)
      setSaved(wasSaved)
      showToast('Could not save. Try again.', 'fail')
    }
  }

  const handleRate = async (value) => {
    if (!movie) return
    const previous = userRating
    setUserRating(value)
    if (value !== null) setWatched(true)
    try {
      if (value === null) {
        await apiRequest(`/ratings/${movie.id}`, { method: 'DELETE' })
      } else {
        await apiRequest('/ratings', {
          method: 'POST',
          body: JSON.stringify({ movieId: movie.id, rating: value })
        })
      }
    } catch (err) {
      console.error(err)
      setUserRating(previous)
      if (value !== null) setWatched(false)
      showToast('Could not rate. Try again.', 'fail')
    }
  }

  const handleToggleWatched = async () => {
    if (!movie) return
    const wasWatched = watched
    const previousRating = userRating
    setWatched(!wasWatched)
    if (wasWatched) setUserRating(null)
    try {
      if (wasWatched) {
        if (previousRating) await apiRequest(`/ratings/${movie.id}`, { method: 'DELETE' })
        await apiRequest(`/watched/${movie.id}`, { method: 'DELETE' })
      } else {
        await apiRequest('/watched', {
          method: 'POST',
          body: JSON.stringify({ movieId: movie.id })
        })
      }
    } catch (err) {
      console.error(err)
      setWatched(wasWatched)
      setUserRating(previousRating)
      showToast('Could not update. Try again.', 'fail')
    }
  }

  const dismissOverlay = () => navigate(location.pathname)

  const formatCurrency = (amount) => amount ? currencyFormat.format(amount) : null
  const releaseYear = movie?.release_date ? new Date(movie.release_date).getFullYear() : null
  const primaryGenre = movie?.genres?.find(g => g.name !== 'Drama')?.name ?? movie?.genres?.[0]?.name
  const director = movie?.credits?.crew?.find(c => c.job === 'Director')
  const cast = movie?.credits?.cast?.slice(0, 5).map(c => c.name).join(', ')
  const trailer = movie?.videos?.results?.find(
    v => v.site === 'YouTube' && v.type === 'Trailer' && v.official
  ) ?? movie?.videos?.results?.find(
    v => v.site === 'YouTube' && v.type === 'Trailer'
  )
  const runtimeText = movie?.runtime > 0
    ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
    : null

  const heroSection = movie && (
    <div className='relative aspect-video bg-black shrink-0 lg:rounded-t-xl overflow-hidden landscape:max-lg:fixed landscape:max-lg:inset-0 landscape:max-lg:z-10003 landscape:max-lg:aspect-auto landscape:max-lg:rounded-none'>
      {!showTrailer && (
        <>
          {!heroLoaded && <div className='absolute inset-0 animate-pulse bg-gray-800' />}
          <img
            src={backdropUrl(movie.backdrop_path || movie.poster_path, 780)}
            srcSet={`
            ${backdropUrl(movie.backdrop_path || movie.poster_path, 300)} 300w,
            ${backdropUrl(movie.backdrop_path || movie.poster_path, 780)} 780w,
            ${backdropUrl(movie.backdrop_path || movie.poster_path, 1280)} 1280w
          `}
            sizes='(min-width: 1024px) 672px, 100vw'
            alt=''
            className={`w-full h-full object-cover ${heroLoaded ? 'block' : 'hidden'}`}
            onLoad={() => setHeroLoaded(true)}
            fetchPriority='high'
          />
          <div className='absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-surface-light via-surface-light/60 to-transparent pointer-events-none' />
          {trailer && (
            <button
              onClick={openTrailer}
              className='absolute inset-0 flex items-center justify-center group cursor-pointer focus-visible:outline-none'
              aria-label='Play trailer'
            >
              <span className='flex items-center justify-center size-14 rounded-full backdrop-blur-sm bg-black/40 group-hover:bg-black/60 group-focus-visible:ring-2 group-focus-visible:ring-ring'>
                <Play size={24} fill='currentColor' aria-hidden='true' />
              </span>
            </button>
          )}
          <button
            onClick={closeOverlay}
            aria-label='Close'
            className='absolute top-3 right-3 z-10 flex items-center justify-center size-11 rounded-full backdrop-blur-sm bg-black/40 hover:bg-black/60 cursor-pointer '
          >
            <X size={20} aria-hidden='true' />
          </button>
        </>
      )}

      {showTrailer && trailer && isMobile && (
        <>
          <iframe
            src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&playsinline=1&rel=0`}
            allow='autoplay; encrypted-media; fullscreen'
            className='absolute inset-0 max-lg:size-full'
            title={`${movie.title} trailer`}
          />
        </>
      )}
    </div>
  )

  const bodySection = movie && (
    <div className='flex flex-col gap-3 py-4 px-4'>
      <h2 className='text-xl lg:text-2xl font-semibold text-foreground leading-snug'>
        {movie.title}
      </h2>
      <div className='flex items-center gap-2 text-sm text-muted-foreground flex-wrap'>
        {movie.vote_average > 0 && (
          <span className='flex items-center gap-1 font-medium text-foreground leading-none'>
            <Star size={14} fill='currentColor' className='text-primary' aria-hidden='true' />
            {movie.vote_average.toFixed(1)}
          </span>
        )}
        {[releaseYear, primaryGenre, runtimeText].filter(Boolean).map((item, i) => (
          <span key={i} className='flex items-center gap-2'>
            <span className='text-gray-600 leading-none' aria-hidden='true'>·</span>
            <span className='leading-none'>{item}</span>
          </span>
        ))}
      </div>
      {movie.overview && (
        <p className='text-sm text-foreground leading-relaxed'>
          {movie.overview}
        </p>
      )}
      {(director || cast || movie.budget > 0 || movie.revenue > 0) && (
        <div className='flex flex-col gap-1.5 pt-4 text-sm'>
          {director && (
            <p>
              <span className='text-muted-foreground'>Director </span>
              <span>{director.name}</span>
            </p>
          )}
          {cast && (
            <p>
              <span className='text-muted-foreground'>Cast </span>
              <span>{cast}</span>
            </p>
          )}
          {(movie.budget > 0 || movie.revenue > 0) && (
            <p>
              {movie.budget > 0 && (
                <>
                  <span className='text-muted-foreground'>Budget </span>
                  <span>{formatCurrency(movie.budget)}</span>
                </>
              )}
              {movie.budget > 0 && movie.revenue > 0 && (
                <span className='text-gray-600 mx-2' aria-hidden='true'>·</span>
              )}
              {movie.revenue > 0 && (
                <>
                  <span className='text-muted-foreground'>Box office </span>
                  <span>{formatCurrency(movie.revenue)}</span>
                </>
              )}
            </p>
          )}
        </div>
      )}
    </div>
  )

  const actionBar = movie && (
    <div className='w-full p-3 border-gray-800 border-t'>
      <OverlayActions
        saved={saved}
        rating={userRating}
        watched={watched}
        onSave={handleSave}
        onRate={handleRate}
        onToggleWatched={handleToggleWatched}
      />
    </div>
  )

  const errorView = (
    <div className='flex flex-col items-center justify-center gap-4 p-8 min-h-64'>
      <p className='text-base text-gray-200 text-center'>Couldn't load movie details.</p>
      <Button variant='secondary' onClick={() => setRetryKey(k => k + 1)}>
        Try again
      </Button>
    </div>
  )

  const detailContent = movie && (
    <>
      {heroSection}
      {bodySection}
    </>
  )

  return (
    <>
      {/* Desktop-only stacked TrailerModal */}
      {!isMobile && (
        <TrailerModal
          isOpen={showTrailer}
          trailerKey={trailer?.key}
          title={movie?.title}
          year={releaseYear}
          onClose={closeTrailer}
          onBackdropClick={() => {
            closeTrailer()
            dismissOverlay()
          }}
        />
      )}

      {/* Desktop */}
      <AnimatePresence>
        {!isMobile && movieId && (
          <motion.div
            className='hidden lg:flex fixed inset-0 z-50 items-center justify-center bg-black/80 p-6'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onMouseDown={(e) => {
              if (e.button === 0 && e.target === e.currentTarget) dismissOverlay()
            }}
          >
            {!showTrailer && (
              <motion.div
                className='relative w-full max-w-2xl max-h-full bg-surface-light lg:rounded-xl border border-gray-800 flex flex-col'
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 40 }}
                transition={{ duration: 0.2 }}
                role='dialog'
                aria-modal='true'
                aria-label={movie?.title ?? 'Movie details'}
              >
                {error
                  ? (
                    <>
                      <button
                        onClick={closeOverlay}
                        aria-label='Close'
                        className='absolute right-3 top-3 z-10 flex items-center justify-center p-2 rounded-full bg-black/60 text-gray-100 hover:bg-black/80 cursor-pointer '
                      >
                        <X size={20} aria-hidden='true' />
                      </button>
                      {errorView}
                    </>
                    )
                  : (
                    <>
                      <div className='flex-1 overflow-y-auto'>
                        {detailContent}
                      </div>
                      {actionBar}
                    </>
                    )}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile */}
      {isMobile && movieId && (
        <div className='lg:hidden'>
          <Sheet
            isOpen={!!movieId}
            onClose={closeOverlay}
            snapPoints={[0, 1]}
            initialSnap={1}
            detent='content'
          >
            <Sheet.Container className='bg-surface-light! rounded-t-xl!'>
              <Sheet.Header />
              <Sheet.Content>
                {error ? errorView : detailContent}
              </Sheet.Content>
              {!error && actionBar}
            </Sheet.Container>
            <Sheet.Backdrop onTap={dismissOverlay} />
          </Sheet>
        </div>
      )}
    </>
  )
}
