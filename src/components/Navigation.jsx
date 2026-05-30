import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Film, Compass, Bookmark, User, ChevronUp, Settings, LogOut, Search } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
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
  const navigate = useNavigate()
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { pathname } = useLocation()
  const menuRef = useRef(null)

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
    setIsMenuOpen(false)
  }

  // Close dropup on outside click.
  useEffect(() => {
    if (!isMenuOpen) return
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setIsMenuOpen(false)
    }
    document.addEventListener('pointerdown', handleClick)
    return () => document.removeEventListener('pointerdown', handleClick)
  }, [isMenuOpen])

  return (
    <nav className='hidden lg:flex flex-col h-full w-60 py-6 px-4 pr-6 gap-6'>
      {/* Logo */}
      <div className='flex items-center gap-3 px-2'>
        <Film size={28} className='text-brand rotate-90' />
        <h1 className='text-xl font-semibold leading-none'>Flick</h1>
      </div>

      {/* <div className='flex items-center justify-start gap-2.5 p-2 px-2.5 rounded-full bg-white/5'>
        <Search size={20} className='text-gray-400' />
        <input
          type='text'
          placeholder='Search for a movie...'
          className='text-sm bg-transparent leading-none outline-none w-full placeholder:text-gray-400'
        />
      </div> */}

      {/* Page links */}
      <ul className='flex flex-col gap-1 text-sm font-medium leading-none'>
        <li>
          <Link to='/' className={`flex items-center gap-4 p-2 rounded-lg hover:bg-white/10 ${pathname === '/' ? 'text-brand' : ''}`}>
            <Compass size={24} />
            Discover
          </Link>
        </li>
        <li>
          <Link to='/watchlist' onClick={requireAuth} className={`flex items-center gap-4 p-2 rounded-lg hover:bg-white/10 ${pathname === '/watchlist' ? 'text-brand' : ''}`}>
            <Bookmark size={24} />
            Watchlist
          </Link>
        </li>
        <li>
          <Link to='/profile' onClick={requireAuth} className={`flex items-center gap-4 p-2 rounded-lg hover:bg-white/10 ${pathname === '/profile' ? 'text-brand' : ''}`}>
            <User size={24} />
            Profile
          </Link>
        </li>
      </ul>

      {/* Auth button */}
      {!user && <Button className='w-full' onClick={() => setIsAuthOpen(true)}>Log in</Button>}
      {isAuthOpen && <AuthFlow onClose={() => setIsAuthOpen(false)} />}

      {/* Footer info */}
      <div className='flex flex-col gap-2 pt-4 px-2 text-xs leading-none text-gray-400 border-t border-white/10'>
        <Link to='/privacy' className='hover:text-gray-300'>Privacy Policy</Link>
        <p>Data provided by TMDB</p>
      </div>

      {/* Spacer */}
      <div className='flex-1' />

      {/* User section */}
      {user && (
        <div ref={menuRef} className='relative border border-white/10 rounded-lg'>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className='w-full flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 cursor-pointer'
          >
            {user.gravatar
              ? <img src={user.gravatar} alt='Avatar' className='rounded-full w-8 h-8' />
              : <div className='w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs leading-none'>{user.displayName[0]}</div>}
            <span className='text-sm font-medium leading-none text-gray-400 flex-1 text-left'>{user.displayName}</span>
            <ChevronUp size={14} className={`text-gray-400 transition-transform ${isMenuOpen ? '' : 'rotate-180'}`} />
          </button>

          {/* Dropup menu */}
          {isMenuOpen && (
            <div className='absolute bottom-full mb-2 left-0 w-full bg-white/3 border border-white/10 rounded-lg overflow-hidden shadow-lg'>
              <Link
                to='/settings'
                onClick={() => setIsMenuOpen(false)}
                className='flex items-center gap-3 px-3 py-3 text-sm leading-none hover:bg-white/10'
              >
                <Settings size={16} />
                Settings
              </Link>
              <button
                onClick={handleLogout}
                className='flex items-center gap-3 px-3 py-3 text-sm leading-none w-full hover:bg-white/10 cursor-pointer text-red-400'
              >
                <LogOut size={16} />
                Log out
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}
