import ErrorBoundary from '@/components/ErrorBoundary'
import { CodeModeProvider } from '@/contexts/CodeModeContext'
import { preloadImages } from '@/lib/preload'
import { CRITICAL_ICON_IMAGES } from '@/lib/preload-manifest'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import App from './App.tsx'
import './index.css'

// Preload critical icon animation images ASAP at startup
preloadImages(CRITICAL_ICON_IMAGES)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <CodeModeProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/:groupId" element={<App />} />
          </Routes>
        </BrowserRouter>
      </CodeModeProvider>
    </ErrorBoundary>
  </StrictMode>
)
