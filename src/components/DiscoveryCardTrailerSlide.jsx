import { useState, useRef, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { posterUrl } from '../utils/imageUtils.js'

/**
 * Trailer slide of a discovery card. Mounts a muted-autoplay YouTube
 * iframe only while at least half of the slide is visible, so the player
 * exits the DOM (and stops playing) on navigation away.
 *
 * Shows the poster (dimmed) plus a spinner while YouTube's iframe loads.
 * Info panel is rendered by the parent card at shell level.
 * @param {object} props - The component props.
 * @param {object} props.movie - Movie data. Reads title, poster_path.
 * @param {string} props.trailerKey - The YouTube video key.
 * @returns {React.ReactElement} The trailer slide.
 */
export default function DiscoveryCardTrailerSlide ({ movie, trailerKey }) {
  const slideRef = useRef(null)
  const [visible, setVisible] = useState(false)
  const [iframeLoaded, setIframeLoaded] = useState(false)

  useEffect(() => {
    const el = slideRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.intersectionRatio > 0.5),
      { threshold: [0, 0.5, 1] }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={slideRef} className='relative shrink-0 size-full snap-start snap-always bg-black'>
      {/* Poster shown dimmed behind the iframe as loading placeholder. */}
      {!iframeLoaded && (
        <>
          <img
            src={posterUrl(movie.poster_path, 300)}
            alt=''
            aria-hidden='true'
            className='absolute inset-0 size-full object-cover opacity-30'
            decoding='async'
          />
          <div className='absolute inset-0 flex items-center justify-center'>
            <Loader2 className='size-8 text-foreground/70 animate-spin' aria-hidden='true' />
          </div>
        </>
      )}
      <div className='absolute inset-0 flex items-center justify-center'>
        <div className='w-full aspect-video'>
          {visible && (
            <iframe
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1&playsinline=1&rel=0`}
              allow='autoplay; encrypted-media; fullscreen; compute-pressure'
              className='size-full'
              title={`${movie.title} trailer`}
              onLoad={() => setIframeLoaded(true)}
            />
          )}
        </div>
      </div>
    </div>
  )
}
