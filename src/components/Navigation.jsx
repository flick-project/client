import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { Film, Compass, Bookmark, User, ChevronsUpDown, Settings, LogOut } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth.js'
import { useToast } from '../hooks/useToast.js'
import { useDiscoveryQueue } from '../hooks/useDiscoveryQueue.js'
import Button from './Button.jsx'
import AuthFlow from './AuthFlow.jsx'
import Modal from './Modal.jsx'

const navLinks = [
  { to: '/', icon: Compass, label: 'Discover', protected: false },
  { to: '/watchlist', icon: Bookmark, label: 'Watchlist', protected: true },
  { to: '/profile', icon: User, label: 'Profile', protected: true },
]

/**
 * Desktop sidebar navigation with page links, auth controls, and footer.
 * Hidden on mobile where BottomNav is used instead.
 * @returns {React.ReactElement} The Navigation component.
 */
export default function Navigation () {
  const { user, logout } = useAuth()
  const { showToast } = useToast()
  const { reset } = useDiscoveryQueue()
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { pathname } = useLocation()
  const menuRef = useRef(null)
  const navigate = useNavigate()

  const navLink = (to) =>
  `flex items-center gap-4 px-3 py-2.5 rounded-lg text-sm font-medium leading-none hover:bg-white/10 ${pathname === to ? 'text-brand bg-brand/10' : ''}`

  const requireAuth = (e) => {
    if (!user) {
      e.preventDefault()
      setIsAuthOpen(true)
    }
  }

  const handleLogout = async () => {
    await logout()
    await reset()
    showToast('Logged out successfully!', 'success')
    navigate('/')
  }

  const avatarColor = (name) => {
    const colors = [
      'bg-red-500/30', 'bg-orange-500/30', 'bg-yellow-500/30',
      'bg-green-500/30', 'bg-blue-500/30', 'bg-purple-500/30',
    ]
    return colors[name.charCodeAt(0) % colors.length]
  }

  useEffect(() => {
    if (!isMenuOpen) return
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setIsMenuOpen(false)
    }
    document.addEventListener('pointerdown', handleClick)
    return () => document.removeEventListener('pointerdown', handleClick)
  }, [isMenuOpen])

  return (
    <nav className='flex flex-col h-full w-64 py-4'>
      {/* Top section */}
      <div className='flex flex-col gap-4 px-4'>
        <div className='flex items-center gap-3.5 px-2.5 py-2'>
          <Film size={28} className='text-brand rotate-90' />
          <h1 className='text-xl font-bold leading-none tracking-wide'>Flick</h1>
        </div>

        <ul className='flex flex-col'>
          {navLinks.map(({ to, icon: Icon, label, protected: isProtected }) => (
            <li key={to}>
              <Link to={to} onClick={isProtected ? requireAuth : undefined} className={navLink(to)}>
                <Icon size={24} />
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {!user && (
          <div className='px-2'>
            <Button full onClick={() => setIsAuthOpen(true)}>Log in</Button>
          </div>
        )}

        <Modal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)}>
          <AuthFlow onClose={() => setIsAuthOpen(false)} />
        </Modal>
      </div>

      {user && <hr className='border-t border-white/10 my-4' />}
      {user && <div className='flex-1' />}
      {user && <hr className='border-t border-white/10 my-4' />}

      {/* User section */}
      {user && (
        <div ref={menuRef} className='relative px-4'>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className='w-full flex items-center gap-2 p-2 rounded-lg hover:bg-white/10 cursor-pointer'
          >
            {user.gravatar
              ? <img src={user.gravatar} alt='Avatar' className='rounded-full w-8 h-8 shrink-0' />
              : <div className={`w-8 h-8 shrink-0 rounded-full ${avatarColor(user.displayName)} flex items-center justify-center text-sm leading-none`}>{user.displayName[0]}</div>}
            <div className='flex flex-col gap-1 min-w-0 flex-1'>
              <span className='text-sm text-left font-medium leading-none truncate'>{user.displayName}</span>
              <span className='text-xs text-gray-300 text-left leading-none truncate'>{user.email}</span>
            </div>
            <ChevronsUpDown size={16} className='shrink-0 text-gray-300' />
          </button>

          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                className='absolute left-full ml-2 bottom-0 w-56 bg-surface-light border border-white/10 rounded-lg overflow-hidden shadow-lg z-99'
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.15 }}
              >
                <div className='flex items-center gap-3 px-3 py-3 border-b border-white/10'>
                  {user.gravatar
                    ? <img src={user.gravatar} alt='Avatar' className='rounded-full w-8 h-8 shrink-0' />
                    : <div className={`w-8 h-8 shrink-0 rounded-full ${avatarColor(user.displayName)} flex items-center justify-center text-sm leading-none`}>{user.displayName[0]}</div>}
                  <div className='flex flex-col gap-1 min-w-0'>
                    <span className='text-sm font-medium leading-none'>{user.displayName}</span>
                    <span className='text-xs leading-none text-gray-300 truncate'>{user.email}</span>
                  </div>
                </div>
                <Link
                  to='/settings'
                  onClick={() => setIsMenuOpen(false)}
                  className='flex items-center gap-3 px-3 py-2 text-sm leading-none hover:bg-white/10 transition-colors'
                >
                  <Settings size={16} />
                  Settings
                </Link>
                <button
                  onClick={() => { setIsMenuOpen(false); handleLogout() }}
                  className='w-full flex items-center gap-3 px-3 py-2 text-sm leading-none hover:bg-white/10 transition-colors text-red-400 cursor-pointer'
                >
                  <LogOut size={16} />
                  Log out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </nav>
  )
}
