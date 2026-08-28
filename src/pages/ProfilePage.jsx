import { usePageMetadata } from '../hooks/usePageMetadata.js'
import { apiRequest } from '../services/api.js'
import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useToast } from '../hooks/useToast'
import { useAuth } from '../hooks/useAuth.js'
import { CircleUser, Settings } from 'lucide-react'
import PageHeader from '../components/PageHeader.jsx'
import FavoriteSearchModal from '../components/SearchModal.jsx'
import TasteTicket from '../components/TasteTicket.jsx'
import FavoriteMovies from '../components/FavoriteMovies.jsx'

/**
 * Profile page displaying user information and activity.
 * @returns {React.ReactElement} The ProfilePage component.
 */
export default function ProfilePage () {
  const { user } = useAuth()
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

  const avatarColor = (name) => {
    const colors = [
      'bg-red-500/30', 'bg-orange-500/30', 'bg-yellow-500/30',
      'bg-green-500/30', 'bg-blue-500/30', 'bg-purple-500/30',
    ]
    return colors[name.charCodeAt(0) % colors.length]
  }

  usePageMetadata(isLoading ? 'Profile' : profile?.displayName)

  if (isLoading || !profile) {
    return (
      <div className='w-full flex flex-col max-w-4xl gap-8'>
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
    <div className='w-full flex flex-col max-w-4xl md:p-4 md:pt-6'>
      <PageHeader action={
        <Link to='/settings' className='text-muted-foreground hover:text-foreground transition-colors'>
          <Settings size={24} />
        </Link>
      }
      />

      <div className='flex flex-col gap-8'>
        {/* Profile header */}
        <div className='flex flex-col gap-8 px-4 md:px-0 justify-between'>
          {/* Left: profile info */}
          <div className='flex flex-col items-center gap-6 shrink-0'>
            <div className='flex flex-col justify-center gap-3'>
              <div className={`flex flex-col items-center justify-center size-32 inset-0 rounded-full ${avatarColor(user.displayName)} text-3xl leading-none`}>
                {user.displayName[0]}
              </div>
            </div>
          </div>
        </div>

        <div className='flex items-center justify-center px-4 lg:px-0'>
          <TasteTicket profile={profile} stats={stats} />
        </div>

        {/* Favorites */}
        <div className='flex flex-col gap-4 p-4 lg:p-0'>
          <h2 className='tracking-wide'>Favorites</h2>
          <FavoriteMovies favorites={favorites} onAdd={() => setIsSearchOpen(true)} onRemove={handleRemove} />
        </div>
      </div>

      {isSearchOpen && <FavoriteSearchModal onSelect={handleAdd} onClose={() => setIsSearchOpen(false)} excludeIds={excludeIds} />}
    </div>
  )
}
