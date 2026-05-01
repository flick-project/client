import { Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation.jsx'
import DiscoveryPage from './pages/DiscoveryPage.jsx'
import WatchlistPage from './pages/WatchlistPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import Toast from './components/Toast.jsx'
import { useToast } from './hooks/useToast.js'
import { useAuth } from './hooks/useAuth.js'

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
      <aside className='w-64 p-4 lg:p-6 lg:py-8 h-full'>
        <Navigation />
      </aside>
      <main className='flex-1 flex items-center justify-center p-4 lg:p-8 overflow-y-auto'>
        <Routes>
          <Route path='/' element={<DiscoveryPage key={token} />} />
          <Route path='/' element={<WatchlistPage />} />
          <Route path='/' element={<ProfilePage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
