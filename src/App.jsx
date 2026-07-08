import { useCallback, useEffect, useRef } from 'react'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import AppLayout from './components/AppLayout.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import DiscoveryPage from './pages/DiscoveryPage.jsx'
import WatchlistPage from './pages/WatchlistPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import SettingsPage from './pages/SettingsPage.jsx'
import PrivacyPage from './pages/PrivacyPage.jsx'
import DiscoveryHeader from './components/DiscoveryHeader.jsx'
import Toast from './components/Toast.jsx'
import SearchModal from './components/SearchModal.jsx'
import { useAuth } from './hooks/useAuth.js'
import { useToast } from './hooks/useToast.js'
import { useDiscoveryQueue } from './hooks/useDiscoveryQueue.js'

/**
 * Root component that renders the app shell with navigation and page routing.
 * @returns {React.ReactElement} The App component.
 */
function App () {
  const { user, loading } = useAuth()
  const { toast, setToast } = useToast()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const prevUser = useRef(user)
  const prevPathname = useRef(pathname)
  const { inject, eject, searchOpen, openSearch, closeSearch } = useDiscoveryQueue()

  useEffect(() => {
    if (loading) return
    if (prevUser.current && !user) {
      navigate('/')
    }
    prevUser.current = user
  }, [user, loading, navigate])

  const handleSearchSelect = useCallback((movie) => {
    if (movie) {
      inject(movie)
      closeSearch()
      if (pathname !== '/') navigate('/')
    } else {
      eject()
    }
  }, [inject, eject, closeSearch, pathname, navigate])

  useEffect(() => {
    if (prevPathname.current === '/' && pathname !== '/') {
      eject()
    }
    prevPathname.current = pathname
  }, [pathname, eject])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        openSearch()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [openSearch])

  const header = pathname === '/' ? <DiscoveryHeader onSelect={handleSearchSelect} /> : null

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className='hidden lg:block'>
        {searchOpen && <SearchModal onSelect={handleSearchSelect} onClose={eject} variant='discovery' />}
      </div>
      <AppLayout header={header}>
        <Routes>
          <Route path='/' element={<DiscoveryPage />} />
          <Route path='/watchlist' element={<ProtectedRoute><WatchlistPage /></ProtectedRoute>} />
          <Route path='/profile' element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path='/settings' element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
          <Route path='/privacy' element={<PrivacyPage />} />
        </Routes>
      </AppLayout>
    </>
  )
}

export default App
