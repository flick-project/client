import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthProvider.jsx'
import { ToastProvider } from './context/ToastProvider.jsx'
import { DiscoveryProvider } from './context/DiscoveryProvider.jsx'
import { MovieOverlayProvider } from './context/MovieOverlayProvider.jsx'
import { ImportProvider } from './context/ImportProvider.jsx'
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ImportProvider>
          <ToastProvider>
            <DiscoveryProvider>
              <MovieOverlayProvider>
                <App />
              </MovieOverlayProvider>
            </DiscoveryProvider>
          </ToastProvider>
        </ImportProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
)
