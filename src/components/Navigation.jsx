import { Link } from 'react-router-dom'
import { Compass, Bookmark, User } from 'lucide-react'
import { useState } from 'react'
import AuthModal from './AuthModal.jsx'
import Button from './Button.jsx'

/**
 * Main navigation sidebar with page links and authentication button.
 * @returns {React.ReactElement} The Navigation component.
 */
function Navigation () {
  const [isAuthOpen, setIsAuthOpen] = useState(false)

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
            Profile
          </Link>
        </li>
      </ul>
      <Button onClick={() => setIsAuthOpen(true)}>
        Log in
      </Button>

      {isAuthOpen && <AuthModal onClose={() => setIsAuthOpen(false)} />}
    </nav>
  )
}

export default Navigation
