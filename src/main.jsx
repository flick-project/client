import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthProvider.jsx'
import { ToastProvider } from './context/ToastProvider.jsx'
import { DiscoveryProvider } from './context/DiscoveryProvider.jsx'
import { MovieOverlayProvider } from './context/MovieOverlayProvider.jsx'
import { ImportProvider } from './context/ImportProvider.jsx'
import interFont from './assets/fonts/InterVariable.woff2?url'
import App from './App.jsx'
import './index.css'

const link = document.createElement('link')
link.rel = 'preload'
link.href = interFont
link.as = 'font'
link.type = 'font/woff2'
link.crossOrigin = 'anonymous'
document.head.appendChild(link)

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
