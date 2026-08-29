import { useCallback, useEffect, useRef, lazy, Suspense } from 'react'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import AppLayout from './components/AppLayout.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import DiscoveryPage from './pages/DiscoveryPage.jsx'
import DiscoveryHeader from './components/DiscoveryHeader.jsx'
import { useAuth } from './hooks/useAuth.js'
import { useDiscoveryQueue } from './hooks/useDiscoveryQueue.js'

const WatchlistPage = lazy(() => import('./pages/WatchlistPage.jsx'))
const ProfilePage = lazy(() => import('./pages/ProfilePage.jsx'))
const SettingsPage = lazy(() => import('./pages/SettingsPage.jsx'))
const PrivacyPage = lazy(() => import('./pages/PrivacyPage.jsx'))
const MovieOverlay = lazy(() => import('./components/MovieOverlay.jsx'))
const SearchModal = lazy(() => import('./components/SearchModal.jsx'))

/**
 * Root component that renders the app shell with navigation and page routing.
 * @returns {React.ReactElement} The App component.
 */
function App () {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const prevUser = useRef(user)
  const prevPathname = useRef(pathname)
  const { inject, eject, searchOpen, closeSearch } = useDiscoveryQueue()

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

  const isDiscovery = pathname === '/'
  const header = isDiscovery ? <DiscoveryHeader onSelect={handleSearchSelect} /> : null

  return (
    <>
      <Suspense fallback={null}>
        <MovieOverlay />
      </Suspense>
      <div className='hidden lg:block'>
        {searchOpen && <SearchModal onSelect={handleSearchSelect} onClose={eject} variant='discovery' />}
      </div>
      <AppLayout header={header} centered={isDiscovery}>
        <Routes>
          <Route path='/' element={<DiscoveryPage />} />
          <Route path='/watchlist' element={<ProtectedRoute><Suspense fallback={null}><WatchlistPage /></Suspense></ProtectedRoute>} />
          <Route path='/profile' element={<ProtectedRoute><Suspense fallback={null}><ProfilePage /></Suspense></ProtectedRoute>} />
          <Route path='/settings' element={<ProtectedRoute><Suspense fallback={null}><SettingsPage /></Suspense></ProtectedRoute>} />
          <Route path='/privacy' element={<Suspense fallback={null}><PrivacyPage /></Suspense>} />
        </Routes>
      </AppLayout>
    </>
  )
}

export default App
