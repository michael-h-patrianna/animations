import { useCallback, useState } from 'react'
import { useScrollLock } from '@/hooks/useScrollLock'

/** Viewport preview mode: full desktop or simulated mobile device. */
export type PreviewMode = 'desktop' | 'mobile'

/** State and actions for the viewport preview modal. */
export interface PreviewModalState {
  isOpen: boolean
  mode: PreviewMode
  replayKey: number
  openDesktop: () => void
  openMobile: () => void
  close: () => void
  replay: () => void
}

/**
 * Manages viewport preview modal state: open/close, mode switching, and
 * independent replay (not linked to the card's replay cycle).
 */
export function usePreviewModal(): PreviewModalState {
  const [isOpen, setIsOpen] = useState(false)
  const [mode, setMode] = useState<PreviewMode>('desktop')
  const [replayKey, setReplayKey] = useState(0)

  useScrollLock(isOpen)

  const openDesktop = useCallback(() => {
    setMode('desktop')
    setReplayKey((k) => k + 1)
    setIsOpen(true)
  }, [])

  const openMobile = useCallback(() => {
    setMode('mobile')
    setReplayKey((k) => k + 1)
    setIsOpen(true)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
  }, [])

  const replay = useCallback(() => {
    setReplayKey((k) => k + 1)
  }, [])

  return { isOpen, mode, replayKey, openDesktop, openMobile, close, replay }
}
