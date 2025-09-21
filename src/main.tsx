import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { preloadImages } from '@/lib/preload'
import { CRITICAL_ICON_IMAGES } from '@/lib/preload-manifest'

// Preload critical icon animation images ASAP at startup
preloadImages(CRITICAL_ICON_IMAGES)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
