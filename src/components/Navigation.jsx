import { Link } from 'react-router-dom'
import { Compass, Bookmark, User } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../hooks/useAuth.js'
import { useNavigate } from 'react-router-dom'
import AuthModal from './AuthModal.jsx'
import Button from './Button.jsx'
import { useToast } from '../hooks/useToast.js'

/**
 * Main navigation sidebar with page links and authentication button.
 * @returns {React.ReactElement} The Navigation component.
 */
function Navigation () {
  const { user, logout } = useAuth()
  const { showToast } = useToast()
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    showToast('Logged out successfully!', 'success')
    navigate('/')
  }

  return (
    <nav className='flex flex-col gap-6'>
      <h1 className='text-2xl font-semibold'>Flick</h1>
      <ul className='flex flex-col gap-2'>
        <li>
          <Link to='/' className='flex items-center gap-4 py-2 hover:text-brand'>
            <Compass size={20} />
            Discover
          </Link>
        </li>
        <li>
          <Link to='/watchlist' className='flex items-center gap-4 py-2 hover:text-brand'>
            <Bookmark size={20} />
            Watchlist
          </Link>
        </li>
        <li>
          <Link to='/profile' className='flex items-center gap-4 py-2 hover:text-brand'>
            <User size={20} />
            {user
              ? user.displayName
              : <span>Profile</span>}
          </Link>
        </li>
      </ul>
      {/* Show login if user isn't logged in, and logout if they are. */}
      {user
        ? <Button onClick={handleLogout}>Log out</Button>
        : <Button onClick={() => setIsAuthOpen(true)}>Log in</Button>}

      {isAuthOpen && <AuthModal onClose={() => setIsAuthOpen(false)} />}
    </nav>
  )
}

export default Navigation
