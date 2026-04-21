import { Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation.jsx'
import DiscoveryPage from './pages/DiscoveryPage.jsx'
import WatchlistPage from './pages/WatchlistPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'

function App() {
  return (
    <div className="flex h-screen">
      <aside className="w-48 md:w-64 bg-surface-light p-4 md:p-6 h-full">
        <Navigation />
      </aside>
      <main className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
        <Routes>
          <Route path="/" element={<DiscoveryPage />} />
          <Route path="/" element={<WatchlistPage />} />
          <Route path="/" element={<ProfilePage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
