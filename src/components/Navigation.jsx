import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Film, Compass, Bookmark, User } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../hooks/useAuth.js'
import { useToast } from '../hooks/useToast.js'
import Button from './Button.jsx'
import AuthFlow from './AuthFlow.jsx'

/**
 * Main navigation sidebar with page links and authentication button.
 * @returns {React.ReactElement} The Navigation component.
 */
function Navigation () {
  const { user, logout } = useAuth()
  const { showToast } = useToast()
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const { pathname } = useLocation()
  const navigate = useNavigate()

  // Open the auth modal if the user is not logged in.
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
    <nav className='w-60 h-full flex flex-col gap-6 p-6'>
      <div className='flex flex-col gap-10'>
        <div className='flex items-center gap-3'>
          <Film size={28} className='text-brand rotate-90' />
          <h1 className='text-xl font-semibold'>Flick</h1>
        </div>
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
              {user ? user.displayName : <span>Profile</span>}
            </Link>
          </li>
        </ul>
        {/* Show login if user isn't logged in, and logout if they are. */}
        {user
          ? <Button className='w-fill' onClick={handleLogout}>Log out</Button>
          : <Button className='w-fill' onClick={() => setIsAuthOpen(true)}>Log in</Button>}
      </div>
      {isAuthOpen && <AuthFlow onClose={() => setIsAuthOpen(false)} />}
      <hr className='border-white/10' />
      <small className='w-full text-xs text-white/40 leading-none'>Movie data provided by TMDB</small>
    </nav>
  )
}

export default Navigation
