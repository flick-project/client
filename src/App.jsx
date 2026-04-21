import Navigation from './components/Navigation.jsx'
import DiscoveryPage from './pages/DiscoveryPage.jsx'

function App() {
  return (
    <div className="flex h-screen">
      <aside className="w-48 md:w-64 bg-surface-light p-4 md:p-8 h-full">
        <Navigation />
      </aside>
      <main className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
        <DiscoveryPage />
      </main>
    </div>
  )
}

export default App
