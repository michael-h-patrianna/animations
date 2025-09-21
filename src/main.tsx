import { preloadImages } from '@/lib/preload'
import { CRITICAL_ICON_IMAGES } from '@/lib/preload-manifest'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Preload critical icon animation images ASAP at startup
preloadImages(CRITICAL_ICON_IMAGES)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
