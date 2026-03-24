import { Button } from '@/demo-ui/components/ui/Button'
import { useLayoutStore, type LayoutStore } from '@/demo-ui/stores/layoutStore'
import { sx } from '@/demo-ui/lib/sx'
import type { PropConfig } from '@/types/animation'
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useShallow } from 'zustand/react/shallow'
import { PropField } from './PropField'

// ── Constants ────────────────────────────────────────────────────────────

const PANEL_WIDTH = 320
const INITIAL_TOP = 80
const INITIAL_RIGHT = 24
const EDGE_PADDING = 8

// ── Drag hook ────────────────────────────────────────────────────────────

function useDrag(ref: React.RefObject<HTMLDivElement | null>) {
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null)
  const dragRef = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(
    null
  )

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!ref.current) return
      e.preventDefault()
      const rect = ref.current.getBoundingClientRect()
      dragRef.current = { startX: e.clientX, startY: e.clientY, origX: rect.left, origY: rect.top }
      ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    },
    [ref]
  )

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (dragRef.current == null) return
    const dx = e.clientX - dragRef.current.startX
    const dy = e.clientY - dragRef.current.startY
    const newX = Math.max(
      EDGE_PADDING,
      Math.min(window.innerWidth - PANEL_WIDTH - EDGE_PADDING, dragRef.current.origX + dx)
    )
    const newY = Math.max(
      EDGE_PADDING,
      Math.min(window.innerHeight - 100, dragRef.current.origY + dy)
    )
    setPosition({ x: newX, y: newY })
  }, [])

  const handlePointerUp = useCallback(() => {
    dragRef.current = null
  }, [])

  return { position, handlePointerDown, handlePointerMove, handlePointerUp }
}

// ── Panel header ─────────────────────────────────────────────────────────

function PanelHeaderActions({
  isDirty,
  onReset,
  onClose,
}: {
  isDirty: boolean
  onReset: () => void
  onClose: () => void
}) {
  return (
    <div className="flex items-center gap-1">
      {isDirty && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          ariaLabel="Reset to defaults"
          className="text-[10px] px-1.5 py-0.5 h-auto"
          data-testid="settings-reset-btn"
        >
          Reset
        </Button>
      )}
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        ariaLabel="Close settings"
        className="p-0.5"
        data-testid="settings-close-btn"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </Button>
    </div>
  )
}

function PanelHeader({
  title,
  isDirty,
  onReset,
  onClose,
  onPointerDown,
  onPointerMove,
  onPointerUp,
}: {
  title: string
  isDirty: boolean
  onReset: () => void
  onClose: () => void
  onPointerDown: (e: React.PointerEvent) => void
  onPointerMove: (e: React.PointerEvent) => void
  onPointerUp: () => void
}) {
  return (
    <div
      className="flex items-center justify-between px-3 py-2.5 border-b border-panel-border bg-panel-header/50 cursor-grab active:cursor-grabbing select-none touch-none"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      data-testid="settings-panel-header"
    >
      <div className="flex items-center gap-2">
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-text-tertiary shrink-0"
        >
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
        <h3
          className="text-xs font-bold text-text-primary tracking-wide uppercase m-0"
          data-testid="settings-panel-title"
        >
          {title}
        </h3>
      </div>
      <PanelHeaderActions isDirty={isDirty} onReset={onReset} onClose={onClose} />
    </div>
  )
}

// ── Panel body ───────────────────────────────────────────────────────────

function PanelBody({
  propsConfig,
  propOverrides,
  onPropChange,
}: {
  propsConfig: PropConfig[]
  propOverrides: Record<string, unknown>
  onPropChange: (name: string, value: unknown) => void
}) {
  const enabledProps = useMemo(() => propsConfig.filter((p) => p.disabled !== true), [propsConfig])
  const disabledProps = useMemo(() => propsConfig.filter((p) => p.disabled === true), [propsConfig])

  return (
    <div
      className="p-3 flex flex-col gap-3 max-h-[60vh] overflow-y-auto custom-scrollbar"
      data-testid="settings-panel-body"
    >
      {enabledProps.map((config) => (
        <PropField
          key={config.name}
          config={config}
          value={propOverrides[config.name]}
          onChange={onPropChange}
        />
      ))}
      {disabledProps.length > 0 && (
        <>
          <div className="border-t border-[var(--border-subtle)] pt-2 mt-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-text-tertiary">
              Code-only props
            </span>
          </div>
          {disabledProps.map((config) => (
            <PropField
              key={config.name}
              config={config}
              value={undefined}
              onChange={onPropChange}
            />
          ))}
        </>
      )}
    </div>
  )
}

// ── Main panel ───────────────────────────────────────────────────────────

interface FloatingSettingsPanelProps {
  title: string
  propsConfig: PropConfig[]
  propOverrides: Record<string, unknown>
  isDirty: boolean
  onPropChange: (name: string, value: unknown) => void
  onReset: () => void
  onApply: () => void
  onClose: () => void
}

function FloatingSettingsPanelComponent({
  title,
  propsConfig,
  propOverrides,
  isDirty,
  onPropChange,
  onReset,
  onApply,
  onClose,
}: FloatingSettingsPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const drag = useDrag(panelRef)
  const { theme, accent } = useLayoutStore(
    useShallow((s: LayoutStore) => ({ theme: s.theme, accent: s.accent }))
  )

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const positionStyle: React.CSSProperties =
    drag.position != null
      ? { left: drag.position.x, top: drag.position.y }
      : { right: INITIAL_RIGHT, top: INITIAL_TOP }

  return createPortal(
    <div
      ref={panelRef}
      className="fixed z-[100]"
      style={{ ...sx({}), width: PANEL_WIDTH, ...positionStyle }}
      data-demo-ui
      data-mode={theme}
      data-accent={accent}
      data-testid="floating-settings-panel"
    >
      <div
        role="dialog"
        aria-label={`Settings for ${title}`}
        className="glass-panel rounded-lg shadow-2xl overflow-hidden"
      >
        <PanelHeader
          title={title}
          isDirty={isDirty}
          onReset={onReset}
          onClose={onClose}
          onPointerDown={drag.handlePointerDown}
          onPointerMove={drag.handlePointerMove}
          onPointerUp={drag.handlePointerUp}
        />
        <PanelBody
          propsConfig={propsConfig}
          propOverrides={propOverrides}
          onPropChange={onPropChange}
        />
        <div className="px-3 py-2.5 border-t border-panel-border bg-panel-header/30">
          <Button
            variant="primary"
            size="sm"
            onClick={onApply}
            className="w-full"
            data-testid="settings-apply-btn"
          >
            Apply & Replay
          </Button>
        </div>
      </div>
    </div>,
    document.body
  )
}

export const FloatingSettingsPanel = memo(FloatingSettingsPanelComponent)
