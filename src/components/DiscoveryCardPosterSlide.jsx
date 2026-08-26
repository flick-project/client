import { useState } from 'react'
import { posterUrl } from '../utils/imageUtils.js'

/**
 * Poster slide of a discovery card. Renders the poster image with scrim
 * gradients baked into the mask. Info panel is rendered by the parent
 * card at shell level so it stays stationary across slide changes.
 * @param {object} props - The component props.
 * @param {object} props.movie - Movie data. Reads title, poster_path.
 * @param {boolean} props.compact - Mobile layout.
 * @param {boolean} props.expanded - Desktop expanded state — controls scrim intensity.
 * @returns {React.ReactElement} The poster slide.
 */
export default function DiscoveryCardPosterSlide ({ movie, compact, expanded }) {
  const [loaded, setLoaded] = useState(false)
  const posterHeight = compact ? 'min(100%, calc(100vw * 5 / 3))' : '100%'

  const scrimFull = expanded
    ? `linear-gradient(
    to bottom,
    rgba(0, 0, 0, 1) 0%,
    rgba(0, 0, 0, 0.6) 50%,
    rgba(0, 0, 0, 0.4) 75%,
    rgba(0, 0, 0, 0.2) 100%
  )`
    : `linear-gradient(
    to bottom,
    rgba(0, 0, 0, 1) 0%,
    rgba(0, 0, 0, 1) 50%,
    rgba(0, 0, 0, 0.8) 75%,
    rgba(0, 0, 0, 0.2) 100%
  )`

  const scrimMinimal =
    `linear-gradient(
      to bottom,
      rgba(0, 0, 0, 1) 0%,
      rgba(0, 0, 0, 1) 50%,
      rgba(0, 0, 0, 0.9) 80%,
      rgba(0, 0, 0, 0.2) 90%,
      rgba(0, 0, 0, 0.1) 95%,
      rgba(0, 0, 0, 0) 100%
    )`

  return (
    <div className='relative shrink-0 size-full snap-start snap-always'>
      {compact && (
        <img
          src={posterUrl(movie.poster_path, 92)}
          className='absolute inset-0 size-full object-cover scale-110 blur-xl brightness-[0.05]'
          aria-hidden='true'
          decoding='async'
        />
      )}
      {!loaded && (
        <div className='absolute inset-0 bg-surface-light animate-pulse' aria-hidden='true' />
      )}
      <img
        src={posterUrl(movie.poster_path, 300)}
        srcSet={`
          ${posterUrl(movie.poster_path, 300)} 300w,
          ${posterUrl(movie.poster_path, 500)} 500w,
          ${posterUrl(movie.poster_path, 780)} 780w
        `}
        sizes='(max-width: 640px) 100vw, 780px'
        alt={movie.title}
        className={`absolute inset-x-0 top-0 w-full object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        style={{
          height: posterHeight,
          maskImage: compact ? scrimMinimal : scrimFull
        }}
        onLoad={() => setLoaded(true)}
        fetchPriority='high'
        decoding='async'
      />
    </div>
  )
}
