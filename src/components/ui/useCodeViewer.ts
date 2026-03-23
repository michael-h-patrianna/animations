import { logger } from '@/services/logger'
import type { SourceTab } from '@/types/animation'
import { useCallback, useRef, useState } from 'react'

/**
 * Manages the code viewer modal state: open/close and lazy source loading.
 * Sources are loaded once on first open and cached for subsequent opens.
 *
 * Close-during-load safety: if close() is called while the sourceLoader is
 * pending, the loader result is still cached (avoiding a re-fetch) but the
 * modal is not reopened. This prevents the jarring "modal pops back open"
 * behavior when a user dismisses before sources arrive.
 *
 * Error observability: when the sourceLoader fails, `error` is set with the
 * failure message. Callers can use this to show a toast or inline error.
 * The error is cleared on the next successful open.
 */
export const useCodeViewer = (sourceLoader?: () => Promise<SourceTab[]>) => {
  const [isOpen, setIsOpen] = useState(false)
  const [sources, setSources] = useState<SourceTab[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const openIdRef = useRef(0)

  const open = useCallback(async () => {
    if (!sourceLoader) return
    const id = ++openIdRef.current
    if (!sources) {
      try {
        setError(null)
        const loaded = await sourceLoader()
        setSources(loaded)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error loading source code'
        logger.error('Failed to load animation source code', err)
        setError(message)
        return
      }
    }
    // Only open if no close() was called while the loader was pending
    if (openIdRef.current === id) {
      setIsOpen(true)
    }
  }, [sourceLoader, sources])

  const close = useCallback(() => {
    // Invalidate any pending open() so its setIsOpen(true) becomes a no-op
    openIdRef.current++
    setIsOpen(false)
  }, [])

  return { isOpen, sources, error, open, close }
}
