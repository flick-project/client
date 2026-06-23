import { usePageMetadata } from '../hooks/usePageMetadata.js'
import { apiRequest } from '../services/api.js'
import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useToast } from '../hooks/useToast'
import { posterUrl } from '../utils/imageUtils.js'
import { CircleUser, CirclePlus, X, Settings } from 'lucide-react'
import PageHeader from '../components/PageHeader.jsx'
import FavoriteSearchModal from '../components/FavoriteSearchModal.jsx'

/**
 * Profile page displaying user information and activity.
 * @returns {React.ReactElement} The ProfilePage component.
 */
export default function ProfilePage () {
  const [profile, setProfile] = useState(null)
  const [stats, setStats] = useState(null)
  const [favorites, setFavorites] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const { showToast } = useToast()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const excludeIds = useMemo(() => favorites.map(f => f.id), [favorites])

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true)
      try {
        const [profileData, statsData, favoritesData] = await Promise.all([
          apiRequest('/user/profile'),
          apiRequest('/user/stats'),
          apiRequest('/favorites')
        ])
        setProfile(profileData)
        setStats(statsData)
        setFavorites(favoritesData)
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchProfile()
  }, [])

  const handleAdd = async (movie) => {
    try {
      await apiRequest('/favorites', {
        method: 'POST',
        body: JSON.stringify({ movie })
      })
      setFavorites(prev => [...prev, movie])
      setIsSearchOpen(false)
    } catch (err) {
      console.error(err)
      if (err.status === 403) showToast('Maximum 5 favorites reached.', 'error')
      else if (err.status === 409) showToast('Movie already in favorites.', 'error')
      else showToast('Something went wrong. Please try again.', 'error')
    }
  }

  const handleRemove = async (movie) => {
    try {
      await apiRequest(`/favorites/${movie.id}`, { method: 'DELETE' })
      setFavorites(prev => prev.filter(f => f.id !== movie.id))
    } catch (err) {
      console.error(err)
      showToast('Something went wrong. Please try again.', 'error')
    }
  }

  const formatDate = (date) => new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })

  usePageMetadata(isLoading ? 'Profile' : profile?.displayName)

  if (isLoading || !profile) {
    return (
      <div className='w-full flex flex-col max-w-6xl md:p-8 gap-8'>
        <div className='flex gap-6 px-4 md:px-0'>
          <div className='w-24 h-24 md:w-32 md:h-32 rounded-full bg-white/5 animate-pulse' />
          <div className='flex flex-col gap-3 justify-center'>
            <div className='h-5 w-32 rounded bg-white/5 animate-pulse' />
            <div className='h-4 w-48 rounded bg-white/5 animate-pulse' />
            <div className='h-4 w-40 rounded bg-white/5 animate-pulse' />
          </div>
        </div>
        <hr className='border-t border-white/10' />
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 px-4 md:px-0'>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className='aspect-2/3 rounded-lg bg-white/5 animate-pulse' />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className='w-full flex flex-col max-w-6xl md:p-8'>
      <PageHeader action={
        <Link to='/settings' className='text-gray-400 hover:text-white transition-colors'>
          <Settings size={24} />
        </Link>
      }
      />

      <div className='flex flex-col gap-6 pb-8'>
        {/* Profile header */}
        <div className='flex gap-6 px-4 md:px-0'>
          {profile.gravatar
            ? <img src={profile.gravatar} alt='Avatar' className='rounded-full w-24 h-24 md:w-32 md:h-32' />
            : <CircleUser size={96} strokeWidth={1.25} className='md:w-32 md:h-32' />}
          <div className='flex flex-col justify-center gap-3'>
            <div className='flex flex-col gap-1.5'>
              <p className='text-xl font-semibold leading-none'>{profile.displayName}</p>
              <p className='text-sm text-gray-400 leading-none'>Member since {formatDate(profile.createdAt)}</p>
            </div>
            {/* Stats */}
            <div className='flex gap-6'>
              {[
                { label: 'Swipes', value: stats.totalInteractions },
                { label: 'Saves', value: stats.totalSaves },
                { label: 'Skips', value: stats.totalSkips },
              ].map(({ label, value }) => (
                <div key={label} className='flex flex-col gap-0.5'>
                  <span className='text-white font-medium text-sm leading-none'>{value}</span>
                  <span className='text-xs text-gray-400 leading-none'>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <hr className='border-t border-white/10' />

        {/* Favorites */}
        <div className='flex flex-col gap-4'>
          <h2 className='text-base font-medium px-4 md:px-0'>Favorite movies</h2>
          <div className='grid grid-cols-2 min-[380px]:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 px-4 md:px-0'>
            {favorites.map((fav) => (
              <div key={fav.id} className='relative group overflow-hidden rounded-lg will-change-transform'>
                <div className='aspect-2/3'>
                  <img
                    src={posterUrl(fav.poster_path, 92)}
                    srcSet={`
                      ${posterUrl(fav.poster_path, 92)} 92w,
                      ${posterUrl(fav.poster_path, 185)} 185w
                    `}
                    alt={fav.title}
                    className='w-full h-full object-cover'
                    loading='eager'
                  />
                </div>
                <div className='absolute inset-0 border border-white/10 rounded-lg pointer-events-none' />
                <button
                  onClick={() => handleRemove(fav)}
                  className='absolute top-1.5 right-1.5 bg-black/60 hover:bg-black/80 rounded-full p-1 cursor-pointer lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-150'
                  aria-label='Remove from favorites'
                >
                  <X size={20} />
                </button>
                {/* Tooltip */}
                <div className='opacity-0 group-hover:opacity-100 transition-opacity duration-150 absolute z-10 p-2 bottom-full mb-2 left-1/2 -translate-x-1/2 border border-white/10 bg-surface-light rounded-md pointer-events-none whitespace-nowrap'>
                  <p className='text-xs font-medium text-gray-300'>{fav.title} ({new Date(fav.release_date).getFullYear()})</p>
                  <div className='absolute left-1/2 -translate-x-1/2 -bottom-1 w-2 h-2 bg-surface-light rotate-45 border-r border-b border-white/10' />
                </div>
              </div>
            ))}
            {favorites.length < 5 && (
              <button
                onClick={() => setIsSearchOpen(true)}
                className='flex items-center justify-center aspect-2/3 rounded-lg border border-dashed border-white/20 text-gray-500 hover:text-gray-300 hover:border-white/40 cursor-pointer transition-colors duration-150'
                aria-label='Add favorite movie'
              >
                <CirclePlus size={32} strokeWidth={1} />
              </button>
            )}
          </div>
        </div>
      </div>

      {isSearchOpen && <FavoriteSearchModal onSelect={handleAdd} onClose={() => setIsSearchOpen(false)} excludeIds={excludeIds} />}
    </div>
  )
}
