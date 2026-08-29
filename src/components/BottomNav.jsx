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
    <nav className='flex lg:hidden items-center justify-around h-14 border-t border-white/10 bg-surface'>
      <Link to='/' className={`flex flex-col items-center justify-center gap-1 size-12 ${pathname === '/' ? 'text-red-500' : 'text-muted-foreground'}`}>
        <Compass size={24} />
        <p className='text-xs leading-none'>Discover</p>
      </Link>
      <Link to='/watchlist' onClick={requireAuth} className={`flex flex-col items-center justify-center gap-1 size-12 ${pathname === '/watchlist' ? 'text-primary' : 'text-muted-foreground'}`}>
        <Bookmark size={24} />
        <p className='text-xs leading-none'>Watchlist</p>
      </Link>
      <Link to='/profile' onClick={requireAuth} className={`flex flex-col items-center justify-center gap-1 size-12 ${pathname === '/profile' ? 'text-primary' : 'text-muted-foreground'}`}>
        <User size={24} />
        <p className='text-xs leading-none'>Profile</p>
      </Link>
      <AuthFlow isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </nav>
  )
}
