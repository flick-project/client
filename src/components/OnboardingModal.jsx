import { X } from 'lucide-react'
import { useState } from 'react'
import { apiRequest } from '../services/api.js'
import MovieSearch from './MovieSearch.jsx'
import ImportPanel from './ImportPanel.jsx'

const TOTAL_STEPS = 2

/**
 * Onboarding flow with favorites and import steps.
 * @param {object} props - Component props.
 * @param {(message: string) => void} props.onComplete - Callback when onboarding finishes or is skipped.
 * @returns {React.ReactElement} The OnboardingModal component.
 */
export default function OnboardingModal ({ onComplete }) {
  const [step, setStep] = useState(0)
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [favorites, setFavorites] = useState([])

  const handleSelect = (movie) => {
    if (favorites.length < 3 && !favorites.find(f => f.id === movie.id)) {
      setFavorites([...favorites, movie])
    }
  }

  const handleRemove = (id) => {
    setFavorites(favorites.filter(f => f.id !== id))
  }

  const handleFavoritesNext = async () => {
    if (favorites.length > 0) {
      setIsLoading(true)
      try {
        await apiRequest('/favorites/batch', {
          method: 'POST',
          body: JSON.stringify({ movies: favorites })
        })
        setStep(1)
      } catch (err) {
        console.error(err)
        setErrors({ general: err.message || 'Something went wrong. Please try again.' })
      } finally {
        setIsLoading(false)
      }
    } else {
      setStep(1)
    }
  }

  const dots = (
    <div className='justify-self-center flex gap-2'>
      {Array.from({ length: TOTAL_STEPS }, (_, i) => (
        <div key={i} className={`w-2 h-2 rounded-full ${i <= step ? 'bg-brand' : 'bg-surface'}`} />
      ))}
    </div>
  )

  if (step === 1) {
    return (
      <div className='flex flex-col gap-6'>
        <div className='flex flex-col gap-2'>
          <h2 className='text-xl font-bold'>Import ratings</h2>
          <p className='text-sm text-text-muted'>Already rated movies on another platform? Import them to get better recommendations instantly.</p>
        </div>

        <ImportPanel hideBack />

        <div className='flex flex-col gap-4'>
          <hr className='border-white/15' aria-hidden='true' />
          <div className='grid grid-cols-3 items-center'>
            <button
              onClick={() => setStep(0)}
              className='justify-self-start text-sm font-medium min-h-11 px-2 text-text-muted hover:text-gray-300 transition-colors cursor-pointer'
            >
              Back
            </button>
            {dots}
            <button
              onClick={() => onComplete('Welcome to Flick!')}
              className='justify-self-end text-sm font-medium min-h-11 px-2 text-brand hover:text-red-400 transition-colors cursor-pointer'
            >
              Finish
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='flex flex-col gap-6'>
      <div className='flex flex-col gap-2'>
        <h2 className='text-xl font-bold'>Pick 3 favorites</h2>
        <p className='text-sm text-text-muted'>Helps us tailor your recommendations from the start.</p>
      </div>

      {errors.general && <p className='text-red-500 text-sm text-center' role='alert'>{errors.general}</p>}

      <div className='flex flex-col gap-4'>
        <MovieSearch onSelect={handleSelect} disabled={favorites.length >= 3} />

        <div className='flex gap-4'>
          {[0, 1, 2].map(i => (
            <div key={i} className={`relative w-full aspect-2/3 rounded-lg overflow-hidden ${favorites[i] ? 'border border-solid border-white/15' : 'border border-dashed border-white/30'}`}>
              {favorites[i] && (
                <>
                  <img src={`https://image.tmdb.org/t/p/w154${favorites[i].poster_path}`} alt={favorites[i].title} className='size-full object-cover' />
                  <button
                    onClick={() => handleRemove(favorites[i].id)}
                    className='absolute top-1 right-1 bg-black/70 rounded-full min-h-8 min-w-8 flex items-center justify-center cursor-pointer'
                    aria-label={`Remove ${favorites[i].title}`}
                  >
                    <X size={16} aria-hidden='true' />
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className='flex flex-col gap-4'>
        <hr className='border-white/15' aria-hidden='true' />

        <div className='grid grid-cols-3 items-center'>
          <button
            onClick={() => onComplete()}
            className='justify-self-start text-sm font-medium min-h-11 px-2 text-text-muted hover:text-gray-300 transition-colors cursor-pointer'
            disabled={isLoading}
          >
            Skip
          </button>
          {dots}
          <button
            onClick={handleFavoritesNext}
            className='justify-self-end text-sm font-medium min-h-11 px-2 text-brand hover:text-red-400 transition-colors cursor-pointer'
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  )
}
