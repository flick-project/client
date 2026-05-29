import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Film, Compass, Bookmark, User } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../hooks/useAuth.js'
import { useToast } from '../hooks/useToast.js'
import Button from './Button.jsx'
import AuthFlow from './AuthFlow.jsx'

/**
 * Desktop sidebar navigation with page links, auth controls, and footer.
 * Hidden on mobile where BottomNav is used instead.
 * @returns {React.ReactElement} The Navigation component.
 */
export default function Navigation () {
  const { user, logout } = useAuth()
  const { showToast } = useToast()
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const requireAuth = (e) => {
    if (!user) {
      e.preventDefault()
      setIsAuthOpen(true)
    }
  }

  const handleLogout = () => {
    logout()
    showToast('Logged out successfully!', 'success')
    navigate('/')
  }

  return (
    <nav className='hidden md:flex flex-col h-full w-60 gap-6 p-6'>
      <div className='flex flex-col gap-10'>
        {/* Logo */}
        <div className='flex items-center gap-3'>
          <Film size={28} className='text-brand rotate-90' />
          <h1 className='text-xl font-semibold'>Flick</h1>
        </div>

        {/* Page links */}
        <ul className='flex flex-col gap-5 text-sm font-medium'>
          <li>
            <Link to='/' className={`flex items-center gap-4 p-2 -m-2 rounded-lg hover:bg-white/10 ${pathname === '/' ? 'text-brand' : ''}`}>
              <Compass size={24} />
              Discover
            </Link>
          </li>
          <li>
            <Link to='/watchlist' onClick={requireAuth} className={`flex items-center gap-4 p-2 -m-2 rounded-lg hover:bg-white/10 ${pathname === '/watchlist' ? 'text-brand' : ''}`}>
              <Bookmark size={24} />
              Watchlist
            </Link>
          </li>
          <li>
            <Link to='/profile' onClick={requireAuth} className={`flex items-center gap-4 p-2 -m-2 rounded-lg hover:bg-white/10 ${pathname === '/profile' ? 'text-brand' : ''}`}>
              <User size={24} />
              {user ? user.displayName : 'Profile'}
            </Link>
          </li>
        </ul>

        {user
          ? <Button className='w-full' onClick={handleLogout}>Log out</Button>
          : <Button className='w-full' onClick={() => setIsAuthOpen(true)}>Log in</Button>}
      </div>

      {isAuthOpen && <AuthFlow onClose={() => setIsAuthOpen(false)} />}

      {/* Footer */}
      <hr className='border-white/10' />
      <div className='flex flex-wrap gap-4 w-full text-xs font-medium leading-none'>
        <Link to='/privacy' className='font-semibold text-gray-400'>Privacy Policy</Link>
        <p className='text-gray-500'>Powered by TMDB</p>
      </div>
    </nav>
  )
}
