import { usePageTitle } from '../hooks/usePageTitle.js'
import { apiRequest } from '../services/api.js'
import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useToast } from '../hooks/useToast'
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
          apiRequest('/user/favorites')
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
      await apiRequest('/user/favorite', {
        method: 'POST',
        body: JSON.stringify({ movie })
      })
      setFavorites(prev => [...prev, movie])
      setIsSearchOpen(false)
    } catch (err) {
      console.error(err)
      if (err.status === 403) {
        showToast('Maximum 5 favorites reached.', 'error')
      } else if (err.status === 409) {
        showToast('Movie already in favorites.', 'error')
      } else {
        showToast('Something went wrong. Please try again.', 'error')
      }
    }
  }

  const handleRemove = async (movie) => {
    try {
      await apiRequest(`/user/favorites/${movie.id}`, { method: 'DELETE' })
      setFavorites(prev => prev.filter(f => f.id !== movie.id))
    } catch (err) {
      console.error(err)
      showToast('Something went wrong. Please try again.', 'error')
    }
  }

  const formatDate = (date) => new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })

  usePageTitle(isLoading ? 'Profile' : profile?.displayName)
  if (isLoading || !profile) return <p>Loading</p>
  return (
    <div className='w-full flex flex-col max-w-6xl md:p-8'>

      <PageHeader action={
        <Link to='/settings' className='hover:text-gray-200'>
          <Settings size={24} />
        </Link>
      }
      />

      {/* Profile info and stats mobile */}
      <div className='flex flex-col gap-6 pb-4'>
        <div className='flex md:hidden flex-col gap-4 items-center px-6'>
          <div className='flex gap-4'>
            {profile.gravatar
              ? <img src={profile.gravatar} alt='Avatar' className='rounded-full w-24 h-24' />
              : <CircleUser size={96} strokeWidth={1.25} />}
          </div>
          <div className='flex flex-col gap-2'>
            <p className='text-xl font-semibold leading-none text-center'>{profile.displayName}</p>
            <p className='text-sm font-medium leading-none text-center text-gray-400'>Member since {formatDate(profile.createdAt)}</p>
          </div>
          <div className='flex gap-8 items-center'>
            <div className='flex flex-col items-center'>
              <span className='text-white font-medium'>{stats.totalInteractions}</span>
              <span className='text-sm text-gray-400'>Swipes</span>
            </div>
            <div className='flex flex-col items-center'>
              <span className='text-white font-medium'>{stats.totalSaves}</span>
              <span className='text-sm text-gray-400'>Saves</span>
            </div>
            <div className='flex flex-col items-center'>
              <span className='text-white font-medium'>{stats.totalSkips}</span>
              <span className='text-sm text-gray-400'>Skips</span>
            </div>
          </div>
        </div>

        {/* Profile info and stats desktop */}
        <div className='hidden md:flex gap-6 w-full justify-between px-6 md:px-0'>
          <div className='flex gap-6'>
            {profile.gravatar
              ? <img src={profile.gravatar} alt='Avatar' className='rounded-full w-32 h-32' />
              : <CircleUser size={128} strokeWidth={1.25} />}
            <div className='flex flex-col items-start justify-center gap-4'>
              <div className='flex flex-col gap-2'>
                <p className='text-xl font-semibold leading-none'>{profile.displayName}</p>
                <p className='text-sm font-medium leading-none text-gray-400'>Member since {formatDate(profile.createdAt)}</p>
              </div>
              <p className='text-sm leading-none text-gray-400'>
                <span className='text-white font-medium'>{stats.totalInteractions}</span> swipes
                <span className='px-2 text-gray-600'>|</span>
                <span className='text-white font-medium'>{stats.totalSaves}</span> saves
                <span className='px-2 text-gray-600'>|</span>
                <span className='text-white font-medium'>{stats.totalSkips}</span> skips
              </p>
              <Link to='/settings' className='bg-white/5 border border-white/10 p-2 rounded-full hover:bg-white/10 text-gray-300 hover:text-gray-100'>
                <Settings size={20} />
              </Link>
            </div>
          </div>
        </div>
        <hr className='border-white/10' />

        <h2 className='text-base font-medium px-4'>Favorite movies</h2>
        <div className='grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 w-full px-4 md:px-0'>
          {favorites.map((fav) => (
            <div key={fav.id} className='relative group'>
              <div className='w-full aspect-2/3 rounded-lg overflow-hidden border border-solid border-white/10'>
                <img src={`https://image.tmdb.org/t/p/w154${fav.poster_path}`} alt={fav.title} className='w-full h-full object-cover' />
                <div className='absolute inset-0 opacity-0 hover:opacity-100'>
                  <button onClick={() => handleRemove(fav)} className='absolute top-2 right-2 bg-black/60 rounded-full p-1 cursor-pointer'>
                    <X size={20} />
                  </button>
                </div>
              </div>
              <div className='opacity-0 group-hover:opacity-100 transition-opacity duration-300 group-hover:delay-1000 absolute z-99 p-2 bottom-full mb-2 left-1/2 -translate-x-1/2 border border-white/10 bg-surface-light rounded-md pointer-events-none'>
                <p className='text-sm font-medium leading-none text-center whitespace-nowrap text-gray-300 text-shadow-md'>{fav.title} ({new Date(fav.release_date).getFullYear()})</p>
                <div className='absolute left-1/2 -translate-x-1/2 -bottom-1 w-2 h-2 bg-surface-light rotate-45 border-r border-b border-white/10' />
              </div>
            </div>
          ))}
          {favorites.length < 5 && (
            <button onClick={() => setIsSearchOpen(true)} className='flex items-center justify-center w-full aspect-2/3 rounded-lg border border-dashed border-white/20 text-gray-400 cursor-pointer'>
              <CirclePlus size={32} strokeWidth={1} />
            </button>
          )}
        </div>
        {isSearchOpen && <FavoriteSearchModal onSelect={handleAdd} onClose={() => setIsSearchOpen(false)} excludeIds={excludeIds} />}
      </div>
    </div>
  )
}
