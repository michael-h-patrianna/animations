import { logger } from '@/services/logger'
import type { SourceTab } from '@/types/animation'
import { useCallback, useState } from 'react'

/**
 * Manages the code viewer modal state: open/close and lazy source loading.
 * Sources are loaded once on first open and cached for subsequent opens.
 */
export const useCodeViewer = (sourceLoader?: () => Promise<SourceTab[]>) => {
  const [isOpen, setIsOpen] = useState(false)
  const [sources, setSources] = useState<SourceTab[] | null>(null)

  const open = useCallback(async () => {
    if (!sourceLoader) return
    if (!sources) {
      try {
        setSources(await sourceLoader())
      } catch (err) {
        logger.error('Failed to load animation source code', err)
        return
      }
    }
    setIsOpen(true)
  }, [sourceLoader, sources])

  const close = useCallback(() => setIsOpen(false), [])

  return { isOpen, sources, open, close }
}
