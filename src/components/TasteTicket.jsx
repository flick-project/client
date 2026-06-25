import { GENRES } from '../utils/genres.js'

/**
 * Movie ticket styled taste profile display.
 * @param {object} props - Component props.
 * @param {object} props.profile - User profile data.
 * @param {object} props.stats - User stats including preferences.
 * @returns {React.JSX.Element} The TasteTicket component.
 */
export default function TasteTicket ({ profile, stats }) {
  const { topGenres, topKeywords, worstKeywords } = stats.preferences
  const hasPreferences = topGenres.length > 0 || topKeywords.length > 0
  if (!hasPreferences) return null

  const memberSince = new Date(profile.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })

  return (
    <div className='relative w-full flex flex-col sm:flex-row overflow-hidden'>
      {/* Stub - top on mobile, left on desktop */}
      <div className='
        relative shrink-0
        flex sm:flex-col items-center justify-between gap-4 p-5
        border border-white/10
        border-b-0 sm:border-b sm:border-r-0
        rounded-t-xl sm:rounded-t-none sm:rounded-l-xl
        sm:w-40
      '
      >
        {/* Notch cutouts - one stays put (corner), one flips position */}
        <div className='
          absolute w-6 h-6 rounded-full border border-white/10 bg-surface z-10
          -bottom-3 -left-3
          sm:bottom-auto sm:left-auto sm:-top-3 sm:-right-3
        '
        />
        <div className='absolute -bottom-3 -right-3 w-6 h-6 rounded-full border border-white/10 bg-surface z-10' />

        {/* Dashed tear line - horizontal on mobile, vertical on desktop */}
        <div className='
          absolute border-dashed border-white/10
          bottom-0 left-4 right-4 border-b
          sm:inset-auto sm:right-0 sm:top-4 sm:bottom-4 sm:border-b-0 sm:border-r
        '
        />

        <div className='flex sm:flex-col justify-center gap-4 size-full'>
          {[
            { label: 'Swipes', value: stats.totalInteractions },
            { label: 'Saves', value: stats.totalSaves }
          ].map(({ label, value }) => (
            <div key={label} className='flex flex-col items-center justify-center gap-1'>
              <span className='text-xl font-bold leading-none font-mono'>{value}</span>
              <span className='text-xs uppercase tracking-wide text-gray-400 leading-none'>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main body */}
      <div className='
        flex-1 min-w-0 flex flex-col gap-4 p-5
        border border-white/10
        border-t-0 sm:border-t sm:border-l-0
        rounded-b-xl sm:rounded-r-xl
      '
      >
        <header className='flex items-baseline justify-between gap-4 pb-3 border-b border-dashed border-white/10'>
          <div>
            <p className='text-xs uppercase tracking-widest text-gray-400 font-mono'>Flick Cinema</p>
            <h2 className='text-sm font-mono uppercase tracking-wide font-bold text-gray-200 mt-0.5'>
              {profile.displayName}'s taste
            </h2>
          </div>
          <div className='text-right'>
            <p className='text-xs uppercase tracking-widest text-gray-400 font-mono'>Member Since</p>
            <p className='text-sm font-mono uppercase tracking-wide font-bold text-gray-200 mt-0.5'>{memberSince}</p>
          </div>
        </header>

        <div className='grid md:grid-cols-2 gap-4 md:gap-6'>
          <div className='flex flex-col gap-2'>
            <p className='text-xs uppercase tracking-wide font-medium text-gray-400'>Loves</p>
            <div className='flex flex-wrap gap-1.5'>
              {topGenres.map(({ key }) => (
                <span key={key} className='text-xs px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 font-medium'>
                  {GENRES[key] || key}
                </span>
              ))}
              {topKeywords.map(({ key }) => (
                <span key={key} className='text-xs px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400'>
                  {key}
                </span>
              ))}
            </div>
          </div>

          {worstKeywords.length > 0 && (
            <div className='flex flex-col gap-2'>
              <p className='text-xs uppercase tracking-wide font-medium text-gray-400'>Hates</p>
              <div className='flex flex-wrap gap-1.5'>
                {worstKeywords.map(({ key }) => (
                  <span key={key} className='text-xs px-2.5 py-1 rounded-md bg-red-500/10 text-red-400'>
                    {key}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
