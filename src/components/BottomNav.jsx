import { Link, useLocation } from 'react-router-dom'
import { Compass, Bookmark, User } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../hooks/useAuth.js'
import AuthFlow from './AuthFlow.jsx'

/**
 * Mobile bottom navigation bar.
 * Hidden on desktop where the sidebar is used instead.
 * @returns {React.ReactElement} The BottomNav component.
 */
export default function BottomNav () {
  const { user } = useAuth()
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const { pathname } = useLocation()

  // Open the auth modal if the user is not logged in.
  const requireAuth = (e) => {
    if (!user) {
      e.preventDefault()
      setIsAuthOpen(true)
    }
  }

  return (
    <nav className='fixed w-full bottom-0 flex lg:hidden items-center justify-around border-t border-white/10 bg-surface h-14 z-99'>
      <Link to='/' className={`flex flex-col items-center gap-1 ${pathname === '/' ? 'text-brand' : 'text-gray-400'}`}>
        <Compass size={24} />
        <p className='text-xs leading-none'>Discover</p>
      </Link>
      <Link to='/watchlist' onClick={requireAuth} className={`flex flex-col items-center gap-1 ${pathname === '/watchlist' ? 'text-brand' : 'text-gray-400'}`}>
        <Bookmark size={24} />
        <p className='text-xs leading-none'>Watchlist</p>
      </Link>
      <Link to='/profile' onClick={requireAuth} className={`flex flex-col items-center gap-1 ${pathname === '/profile' ? 'text-brand' : 'text-gray-400'}`}>
        <User size={24} />
        <p className='text-xs leading-none'>Profile</p>
      </Link>
      {isAuthOpen && <AuthFlow onClose={() => setIsAuthOpen(false)} />}
    </nav>
  )
}
