import { X } from 'lucide-react'
import { useState } from 'react'
import { apiRequest } from '../services/api.js'
import MovieSearch from './MovieSearch.jsx'

/**
 * Onboarding step where users pick up to 3 favorite movies.
 * @param {object} props - Component props.
 * @param {(message: string) => void} props.onComplete - Callback when onboarding finishes or is skipped.
 * @returns {React.ReactElement} The OnboardingModal component.
 */
export default function OnboardingModal ({ onComplete }) {
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

  const handleConfirm = async () => {
    setIsLoading(true)
    try {
      await apiRequest('/favorites/batch', {
        method: 'POST',
        body: JSON.stringify({ movies: favorites })
      })
      onComplete('Welcome to Flick!')
    } catch (err) {
      console.error(err)
      setErrors({ general: err.message || 'Something went wrong. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='flex flex-col gap-8'>
      <div className='flex flex-col gap-2'>
        <h2 className='text-xl font-bold'>Pick 3 favorites</h2>
        <p className='text-sm text-gray-400'>Helps us tailor your recommendations from the start.</p>
      </div>

      {errors.general && <p className='text-red-500 text-sm text-center'>{errors.general}</p>}

      <div className='flex flex-col gap-4'>
        <MovieSearch onSelect={handleSelect} disabled={favorites.length >= 3} />

        <div className='flex gap-4'>
          {[0, 1, 2].map(i => (
            <div key={i} className={`relative w-full aspect-2/3 rounded-lg overflow-hidden ${favorites[i] ? 'border border-solid border-white/10' : 'border border-dashed border-white/20'}`}>
              {favorites[i] && (
                <>
                  <img src={`https://image.tmdb.org/t/p/w154${favorites[i].poster_path}`} alt={favorites[i].title} className='size-full object-cover' />
                  <button onClick={() => handleRemove(favorites[i].id)} className='absolute top-1 right-1 bg-black/70 rounded-full p-1 cursor-pointer'>
                    <X size={16} />
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className='flex flex-col gap-6'>
        <hr className='border-white/10' />

        <div className='grid grid-cols-3 items-center justify-between'>
          <button onClick={onComplete} className='justify-self-start text-sm font-medium p-2 -m-2 text-gray-400 hover:underline cursor-pointer' disabled={isLoading}>
            Skip
          </button>
          <div className='justify-self-center flex gap-2'>
            {[0, 1, 2].map(i => (
              <div key={i} className={`w-2 h-2 rounded-full ${i < 1 ? 'bg-brand' : 'bg-surface'}`} />
            ))}
          </div>
          <button onClick={handleConfirm} className='justify-self-end text-sm font-medium p-2 -m-2 text-brand hover:underline cursor-pointer' disabled={isLoading || favorites.length === 0}>
            {isLoading ? 'Saving...' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  )
}
