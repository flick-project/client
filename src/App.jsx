import { Routes, Route, useLocation } from 'react-router-dom'
import AppLayout from './components/AppLayout.jsx'
import DiscoveryPage from './pages/DiscoveryPage.jsx'
import WatchlistPage from './pages/WatchlistPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import SettingsPage from './pages/SettingsPage.jsx'
import PrivacyPage from './pages/PrivacyPage.jsx'
import Toast from './components/Toast.jsx'
import { useToast } from './hooks/useToast.js'
import { useAuth } from './hooks/useAuth.js'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import { Film } from 'lucide-react'

const DiscoveryHeader = () => (
  <div className='flex items-center gap-2'>
    <Film size={28} className='text-brand rotate-90' />
    <h1 className='text-xl font-semibold'>Flick</h1>
  </div>
)

/**
 * Root component that renders the app shell with navigation and page routing.
 * @returns {React.ReactElement} The App component.
 */
function App () {
  const { toast, setToast } = useToast()
  const { token } = useAuth()
  const { pathname } = useLocation()
  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <AppLayout header={pathname === '/' ? <DiscoveryHeader /> : null}>
        <Routes>
          <Route path='/' element={<DiscoveryPage key={token} />} />
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
