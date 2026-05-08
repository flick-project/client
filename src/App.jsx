import { Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation.jsx'
import DiscoveryPage from './pages/DiscoveryPage.jsx'
import WatchlistPage from './pages/WatchlistPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
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
    <div className='flex h-screen'>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <aside>
        <Navigation />
      </aside>
      <main className='flex flex-1 justify-center overflow-y-auto'>
        <Routes>
          <Route path='/' element={<DiscoveryPage key={token} />} />
          <Route path='/watchlist' element={<ProtectedRoute><WatchlistPage /></ProtectedRoute>} />
          <Route path='/profile' element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  )
}

export default App
