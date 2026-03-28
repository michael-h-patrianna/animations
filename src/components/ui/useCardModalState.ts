/**
 * Hooks and helpers for card-level modal interactions: code viewer, preview, copy-link, auto-preview.
 */

import { useToastStore } from '@/demo-ui/stores/toastStore'
import { logger } from '@/services/logger'
import type { SourceTab } from '@/types/animation'
import { useCallback, useEffect, useRef, type ReactNode } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
import { useCodeViewer } from './useCodeViewer'
import { usePreviewModal } from './usePreviewModal'

// ── Shared Types ─────────────────────────────────────────────────────────

/** Props for render-prop children passed to AnimationCard. */
export type AnimationRenderProps = {
  bulbCount: number
  onColor: string
  prizeCount: number
  propOverrides: Record<string, unknown>
}

/** Children can be a ReactNode or a render-prop receiving control state. */
export type AnimationChild = ReactNode | ((props: AnimationRenderProps) => ReactNode)

// ── Render Helper ────────────────────────────────────────────────────────

const EMPTY_OVERRIDES: Record<string, unknown> = {}

/** Renders the animation child with the given control/override props. */
export function renderAnimationChild(
  child: AnimationChild,
  isVisible: boolean,
  infiniteAnimation: boolean,
  bulbCount: number,
  onColor: string,
  prizeCount: number,
  propOverrides: Record<string, unknown> = EMPTY_OVERRIDES
) {
  if (!isVisible && !infiniteAnimation) return null
  if (typeof child === 'function') return child({ bulbCount, onColor, prizeCount, propOverrides })
  return child
}

// ── Hooks ────────────────────────────────────────────────────────────────

/**
 * Auto-opens a preview when the URL contains `?animation=X&preview=desktop|mobile`.
 * Returns `opaque` from the `&opaque=1` query param.
 */
export function useAutoPreview(animationId: string, preview: ReturnType<typeof usePreviewModal>) {
  const [searchParams] = useSearchParams()
  const previewParam = searchParams.get('preview')
  const opaque = searchParams.get('opaque') === '1'
  const autoOpenedRef = useRef(false)

  useEffect(() => {
    if (autoOpenedRef.current) return
    const animParam = searchParams.get('animation')
    if (animParam !== animationId || !previewParam) return
    autoOpenedRef.current = true
    if (previewParam === 'mobile') preview.openMobile()
    else preview.openDesktop()
  }, [searchParams, animationId, previewParam, preview])

  return { opaque }
}

/** Copies a deep-link URL for the animation to the clipboard and shows a toast. */
export function useCopyLink(animationId: string) {
  const showToast = useToastStore((s) => s.showToast)
  const location = useLocation()

  const handleCopyLink = useCallback(() => {
    const url = `${window.location.origin}${location.pathname}?animation=${encodeURIComponent(animationId)}`
    navigator.clipboard.writeText(url).then(
      () => showToast('Animation URL copied to clipboard'),
      (err) => logger.warn('Clipboard write failed — browser may have denied access', err)
    )
  }, [animationId, showToast, location.pathname])

  return { handleCopyLink }
}

/** Surfaces code-viewer load errors as a toast notification. */
function useCodeViewerErrorToast(error: string | null) {
  const showToast = useToastStore((s) => s.showToast)

  useEffect(() => {
    if (error !== null) showToast(`Failed to load source: ${error}`)
  }, [error, showToast])
}

/** Orchestrates all modal-related hooks for a card. */
export function useCardModalState(animationId: string, sourceLoader?: () => Promise<SourceTab[]>) {
  const codeViewer = useCodeViewer(sourceLoader)
  const preview = usePreviewModal()
  const { opaque } = useAutoPreview(animationId, preview)
  const { handleCopyLink } = useCopyLink(animationId)

  useCodeViewerErrorToast(codeViewer.error)

  return { codeViewer, preview, opaque, handleCopyLink }
}
