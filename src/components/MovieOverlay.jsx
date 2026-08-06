import { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useMovieOverlay } from '../hooks/useMovieOverlay'
import { motion, AnimatePresence } from 'motion/react'
import { apiRequest } from '../services/api'
import { posterUrl, backdropUrl } from '../utils/imageUtils'
import { X, Bookmark, Star, Play } from 'lucide-react'
import { Sheet } from 'react-modal-sheet'
import { findRating } from '../utils/ratings'
import { useToast } from '../hooks/useToast'
import InlineRatingPicker from './InlineRatingPicker'

const currencyFormat = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 1
})

/**
 * Global movie detail overlay, driven by MovieOverlayContext.
 * @returns {React.ReactElement} The MovieOverlay component.
 */
export default function MovieOverlay () {
  const { movieId, closeOverlay, notifyChange, showTrailer, openTrailer, closeTrailer } = useMovieOverlay()
  const { showToast } = useToast()
  const location = useLocation()
  const navigate = useNavigate()

  const [movie, setMovie] = useState(null)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [scrolledToBottom, setScrolledToBottom] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024)
  const [saved, setSaved] = useState(false)
  const [ratingOpen, setRatingOpen] = useState(false)
  const [userRating, setUserRating] = useState(null)
  const [error, setError] = useState(false)
  const [retryKey, setRetryKey] = useState(0)
  const scrollRef = useRef(null)

  // ── Data fetching ──────────────────────────────────────────

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
      setImageLoaded(false)
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
      setRatingOpen(false)
    }
    syncInteractionState()
  }, [movie])

  // ── Listeners ──────────────────────────────────────────────

  useEffect(() => {
    const el = scrollRef.current
    if (!el || !movie) return
    const check = () => {
      setScrolledToBottom(el.scrollTop + el.clientHeight >= el.scrollHeight - 1)
    }
    check()
    el.addEventListener('scroll', check, { passive: true })
    return () => el.removeEventListener('scroll', check)
  }, [movie])

  useEffect(() => {
    if (!movieId) return
    const check = () => setIsMobile(window.innerWidth < 1024)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [movieId])

  // ── Handlers ───────────────────────────────────────────────

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
    const previous = userRating
    setUserRating(value)
    setRatingOpen(false)
    try {
      await apiRequest('/ratings', {
        method: 'POST',
        body: JSON.stringify({ movieId: movie.id, rating: value })
      })
    } catch (err) {
      console.error(err)
      setUserRating(previous)
      showToast('Could not rate. Try again.', 'fail')
    }
  }

  const dismissOverlay = () => navigate(location.pathname)

  // ── Derived values ─────────────────────────────────────────

  const currentRating = findRating(userRating)
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

  // ── Shared fragments ──────────────────────────────────────

  const metaRow = movie && (
    <div className='flex items-center gap-2 flex-wrap text-base text-text-muted'>
      {movie.vote_average > 0 && (
        <>
          <span className='flex items-center gap-1.5'>
            <Star size={14} className='fill-yellow-400 text-yellow-400' aria-hidden='true' />
            <span className='text-gray-200'>{movie.vote_average.toFixed(1)}</span>
            <span className='ml-1 px-1.5 py-0.5 rounded text-xs font-medium bg-[#0d253f] text-[#01b4e4]'>TMDB</span>
          </span>
          <span aria-hidden='true'>·</span>
        </>
      )}
      {primaryGenre && <span>{primaryGenre}</span>}
      {movie.runtime > 0 && (
        <>
          <span aria-hidden='true'>·</span>
          <span>{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m</span>
        </>
      )}
    </div>
  )

  const detailsContent = movie && (
    <>
      {(director || cast) && (
        <div className='flex flex-col gap-3 px-4 pb-4 border-b border-white/10'>
          {director && (
            <div>
              <p className='text-sm text-text-muted mb-0.5'>Director</p>
              <p className='text-base text-gray-200'>{director.name}</p>
            </div>
          )}
          {cast && (
            <div>
              <p className='text-sm text-text-muted mb-0.5'>Cast</p>
              <p className='text-base text-gray-200'>{cast}</p>
            </div>
          )}
        </div>
      )}
      {(movie.budget > 0 || movie.revenue > 0) && (
        <div className='flex gap-8 px-4'>
          {movie.budget > 0 && (
            <div>
              <p className='text-sm text-text-muted mb-0.5'>Budget</p>
              <p className='text-base text-gray-200'>{formatCurrency(movie.budget)}</p>
            </div>
          )}
          {movie.revenue > 0 && (
            <div>
              <p className='text-sm text-text-muted mb-0.5'>Box office</p>
              <p className='text-base text-gray-200'>{formatCurrency(movie.revenue)}</p>
            </div>
          )}
        </div>
      )}
    </>
  )

  const actionButtons = (
    <div className='relative min-h-11'>
      <AnimatePresence mode='wait'>
        {ratingOpen
          ? (
            <InlineRatingPicker
              currentRating={userRating}
              onRate={handleRate}
              onCancel={() => setRatingOpen(false)}
            />
            )
          : (
            <motion.div
              key='actions'
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.15 }}
              className='flex gap-3'
            >
              <button
                onClick={handleSave}
                className='flex items-center justify-center gap-2 flex-1 py-2 px-4 rounded-lg bg-white/10 hover:bg-white/20 text-base text-white transition-colors cursor-pointer min-h-11'
              >
                <Bookmark size={20} className={saved ? 'fill-white' : ''} aria-hidden='true' />
                {saved ? 'Saved' : 'Save'}
              </button>
              <button
                onClick={() => setRatingOpen(true)}
                className={`flex items-center justify-center gap-2 flex-1 py-2 px-4 rounded-lg text-base text-white transition-colors cursor-pointer min-h-11 ${
                  currentRating
                    ? currentRating.activeClass
                    : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                {currentRating
                  ? (
                    <>
                      <span className='text-lg' aria-hidden='true'>{currentRating.emoji}</span>
                      {currentRating.pastTense}
                    </>
                    )
                  : (
                    <>
                      <Star size={20} aria-hidden='true' />
                      Rate
                    </>
                    )}
              </button>
            </motion.div>
            )}
      </AnimatePresence>
    </div>
  )

  const trailerButton = trailer && (
    <div className='absolute inset-0 flex items-center justify-center'>
      <button
        onClick={openTrailer}
        className='flex items-center justify-center w-14 h-14 rounded-full bg-black/50 backdrop-blur-sm text-white hover:bg-black/70 transition-colors cursor-pointer min-w-11 min-h-11'
        aria-label='Play trailer'
      >
        <Play size={24} className='ml-1' />
      </button>
    </div>
  )

  const errorView = (
    <div className='flex flex-col items-center justify-center gap-4 p-8 w-full h-full min-h-64'>
      <p className='text-base text-gray-300 text-center'>Couldn't load movie details.</p>
      <button
        onClick={() => setRetryKey(k => k + 1)}
        className='px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-base text-white transition-colors cursor-pointer min-h-11'
      >
        Try again
      </button>
    </div>
  )

  // ── Desktop views ──────────────────────────────────────────

  const desktopTrailerView = movie && trailer && (
    <div className='flex flex-col w-full h-full px-1 pb-1 bg-black'>
      <div className='shrink-0 flex items-center justify-between gap-3 pl-4 pr-1 py-2 bg-black'>
        <div className='min-w-0'>
          <p className='text-base font-medium text-white truncate'>
            {movie.title} <span>({releaseYear})</span>
          </p>
        </div>
        <button
          onClick={closeTrailer}
          aria-label='Close trailer'
          className='shrink-0 flex items-center justify-center min-w-11 min-h-11 rounded-lg text-text-muted hover:text-white hover:bg-white/10 cursor-pointer transition-colors'
        >
          <X size={20} />
        </button>
      </div>
      <div className='relative w-full aspect-video bg-black rounded-b-xl overflow-hidden'>
        <iframe
          src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&rel=0`}
          allow='autoplay; encrypted-media; fullscreen'
          allowFullScreen
          className='w-full h-full'
          title={`${movie.title} trailer`}
        />
      </div>
    </div>
  )

  const desktopDetailView = movie && (
    <>
      <div className='shrink-0 h-full relative' style={{ aspectRatio: '2 / 3.3' }}>
        {!imageLoaded && (
          <div className='absolute inset-0 animate-pulse bg-white/5' />
        )}
        <img
          src={posterUrl(movie.poster_path, 300)}
          srcSet={`
            ${posterUrl(movie.poster_path, 185)} 185w,
            ${posterUrl(movie.poster_path, 300)} 300w,
            ${posterUrl(movie.poster_path, 500)} 500w
          `}
          sizes='256px'
          alt={movie.title}
          className={`w-full h-full object-cover ${imageLoaded ? 'block' : 'hidden'}`}
          onLoad={() => setImageLoaded(true)}
          fetchPriority='high'
        />
        {trailerButton}
      </div>

      <div className='flex flex-col flex-1 min-h-0 relative'>
        <button
          onClick={closeOverlay}
          aria-label='Close'
          className='absolute right-3 top-2 z-10 p-2.5 rounded-md text-text-muted backdrop-blur-md hover:text-white hover:bg-white/10 cursor-pointer transition-colors flex items-center justify-center min-w-11 min-h-11'
        >
          <X size={24} />
        </button>

        <div ref={scrollRef} className='flex-1 overflow-y-auto flex flex-col gap-4 pb-4'>
          <div className='flex flex-col gap-2 p-4 border-b border-white/10'>
            <h2 className='text-2xl font-semibold text-white leading-snug pr-10'>
              {movie.title}
              <span className='ml-2 text-lg font-normal text-text-muted whitespace-nowrap'>
                {releaseYear}
              </span>
            </h2>
            {metaRow}
            <p className='text-base text-gray-100 leading-relaxed'>{movie.overview}</p>
          </div>
          {detailsContent}
        </div>

        <div className={`shrink-0 border-t border-white/10 p-4 bg-surface-light transition-shadow duration-200 ${scrolledToBottom ? 'shadow-none' : 'shadow-[0_-16px_24px_var(--color-surface-light)]'}`}>
          {actionButtons}
        </div>
      </div>
    </>
  )

  // ── Mobile view ────────────────────────────────────────────

  const mobileDetailView = movie && (
    <>
      <div className='w-full aspect-video relative bg-black'>
        {showTrailer && trailer
          ? (
            <iframe
              src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&playsinline=1&rel=0`}
              allow='autoplay; encrypted-media; fullscreen'
              className='w-full h-full'
              title={`${movie.title} trailer`}
            />
            )
          : (
            <>
              {!imageLoaded && (
                <div className='absolute inset-0 animate-pulse bg-white/5' />
              )}
              <img
                src={backdropUrl(movie.backdrop_path || movie.poster_path, 780)}
                srcSet={`
                  ${backdropUrl(movie.backdrop_path || movie.poster_path, 300)} 300w,
                  ${backdropUrl(movie.backdrop_path || movie.poster_path, 780)} 780w
                `}
                sizes='100vw'
                alt={movie.title}
                className={`w-full h-full object-cover ${imageLoaded ? 'block' : 'hidden'}`}
                onLoad={() => setImageLoaded(true)}
                fetchPriority='high'
              />
              {trailerButton}
            </>
            )}
      </div>

      <div className='flex flex-col gap-4 py-4'>
        <div className='flex flex-col gap-2 px-4 pb-4 border-b border-white/10'>
          <h2 className='text-xl font-semibold text-white leading-snug'>
            {movie.title}
            <span className='ml-2 text-sm font-normal text-text-muted whitespace-nowrap'>
              {releaseYear}
            </span>
          </h2>
          {metaRow}
          <p className='text-base text-gray-100 leading-relaxed'>{movie.overview}</p>
        </div>
        {detailsContent}
      </div>
    </>
  )

  // ── Render ─────────────────────────────────────────────────

  return (
    <>
      {/* Desktop */}
      <AnimatePresence>
        {!isMobile && movieId && (
          <motion.div
            className='hidden lg:flex fixed inset-0 z-50 items-center justify-center bg-black/80'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onMouseDown={(e) => {
              if (e.button === 0 && e.target === e.currentTarget) dismissOverlay()
            }}
          >
            <motion.div
              className={`relative ${showTrailer ? 'aspect-video w-2/3' : 'w-2/3 max-w-4xl h-[70vh] max-h-125'} bg-surface-light rounded-xl border border-white/10 overflow-hidden flex flex-row`}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.2 }}
            >
              {error
                ? (
                  <>
                    <button
                      onClick={closeOverlay}
                      aria-label='Close'
                      className='absolute right-3 top-2 z-10 p-2.5 rounded-md text-text-muted hover:text-white hover:bg-white/10 cursor-pointer transition-colors flex items-center justify-center min-w-11 min-h-11'
                    >
                      <X size={24} />
                    </button>
                    {errorView}
                  </>
                  )
                : showTrailer
                  ? desktopTrailerView
                  : desktopDetailView}
            </motion.div>
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
          >
            <Sheet.Container className='bg-surface-light! rounded-t-xl!'>
              <Sheet.Header />
              <Sheet.Content>
                {error ? errorView : mobileDetailView}
              </Sheet.Content>
              {!error && (
                <div className='shrink-0 border-t border-white/10 p-4 bg-surface-light'>
                  {actionButtons}
                </div>
              )}
            </Sheet.Container>
            <Sheet.Backdrop onTap={dismissOverlay} />
          </Sheet>
        </div>
      )}
    </>
  )
}
