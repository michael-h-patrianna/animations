import { ErrorBoundary } from '@/components/ErrorBoundary'
import { NotFound } from '@/components/NotFound'
import { CodeModeProvider } from '@/contexts/CodeModeContext'
import { preloadImages } from '@/lib/preload'
import { CRITICAL_ICON_IMAGES } from '@/lib/preload-manifest'
import { LazyMotion } from 'motion/react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { App } from './App.tsx'
import './index.css'
import './demo-ui/styles/index.css'

const loadFeatures = () => import('./features').then((res) => res.features)

// Preload critical icon animation images ASAP at startup
preloadImages(CRITICAL_ICON_IMAGES)

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Root element #root not found. Verify index.html contains <div id="root"></div>.')
}

createRoot(rootElement).render(
  <StrictMode>
    <ErrorBoundary>
      <LazyMotion features={loadFeatures} strict>
        <CodeModeProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<App />} />
              <Route path="/:groupId" element={<App />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </CodeModeProvider>
      </LazyMotion>
    </ErrorBoundary>
  </StrictMode>
)
