import { Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation.jsx'
import BottomNav from './components/BottomNav.jsx'
import DiscoveryPage from './pages/DiscoveryPage.jsx'
import WatchlistPage from './pages/WatchlistPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import SettingsPage from './pages/SettingsPage.jsx'
import PrivacyPage from './pages/PrivacyPage.jsx'
import Toast from './components/Toast.jsx'
import { useToast } from './hooks/useToast.js'
import { useAuth } from './hooks/useAuth.js'
import ProtectedRoute from './components/ProtectedRoute.jsx'

/**
 * Root component that renders the app shell with navigation and page routing.
 * @returns {React.ReactElement} The App component.
 */
function App () {
  const { toast, setToast } = useToast()
  const { token } = useAuth()

  return (
    <div className='flex flex-col md:flex-row h-dvh'>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <aside className='fixed hidden lg:block left-0 top-0 h-full z-10'>
        <Navigation />
      </aside>
      <main className='flex flex-1 justify-center min-h-0 max-sm:pb-14 lg:ml-60'>
        <Routes>
          <Route path='/' element={<DiscoveryPage key={token} />} />
          <Route path='/watchlist' element={<ProtectedRoute><WatchlistPage /></ProtectedRoute>} />
          <Route path='/profile' element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path='/settings' element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
          <Route path='/privacy' element={<PrivacyPage />} />
        </Routes>
      </main>
      <BottomNav />
    </div>
  )
}

export default App
