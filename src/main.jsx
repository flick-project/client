import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthProvider.jsx'
import { AuthFlowProvider } from './context/AuthFlowProvider.jsx'
import { DiscoveryProvider } from './context/DiscoveryProvider.jsx'
import { MovieOverlayProvider } from './context/MovieOverlayProvider.jsx'
import { ImportProvider } from './context/ImportProvider.jsx'
import { Toaster } from '@/components/ui/sonner'
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
          <DiscoveryProvider>
            <MovieOverlayProvider>
              <AuthFlowProvider>
                <App />
                <Toaster richColors />
              </AuthFlowProvider>
            </MovieOverlayProvider>
          </DiscoveryProvider>
        </ImportProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
)
