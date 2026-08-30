import { Link, useLocation } from 'react-router-dom'
import { Compass, Bookmark, User } from 'lucide-react'
import { useAuth } from '../hooks/useAuth.js'
import { useAuthFlow } from '../hooks/useAuthFlow.js'

const navLinks = [
  { to: '/', icon: Compass, label: 'Discover', protected: false },
  { to: '/watchlist', icon: Bookmark, label: 'Watchlist', protected: true },
  { to: '/profile', icon: User, label: 'Profile', protected: true }
]

/**
 * Mobile bottom navigation bar.
 * Hidden on desktop where the sidebar is used instead.
 * @returns {React.ReactElement} The BottomNav component.
 */
export default function BottomNav () {
  const { user } = useAuth()
  const { openAuthFlow } = useAuthFlow()
  const { pathname } = useLocation()

  const navLink = (to) =>
    `flex flex-col items-center justify-center gap-1 size-12 ${pathname === to ? 'text-primary' : 'text-muted-foreground'}`

  // Open the auth modal if the user is not logged in.
  const guardProtected = (e) => {
    if (!user) {
      e.preventDefault()
      openAuthFlow()
    }
  }

  return (
    <nav className='flex lg:hidden items-center justify-around h-14 border-t border-white/10 bg-surface'>
      {navLinks.map(({ to, icon: Icon, label, protected: isProtected }) => (
        <Link key={to} to={to} onClick={isProtected ? guardProtected : undefined} className={navLink(to)}>
          <Icon size={24} />
          <p className='text-xs leading-none'>{label}</p>
        </Link>
      ))}
    </nav>
  )
}
