/**
 * Reduced-motion note: catalog-only data-reduced-motion mirroring supplements
 * OS @media (prefers-reduced-motion) rules; consumers do not need to copy it.
 * Tab panel container with pop-scale tab entrance and sliding content transitions — CSS variant.
 * Supports controlled (activeIndex + onTabChange) or uncontrolled (internal state) usage.
 *
 * Copy-paste files: this file + TileAnimationsTabMorph.module.css
 * Runtime deps: react
 *
 * @example
 * <TileAnimationsTabMorph labels={['Overview', 'Details', 'Pricing']}>
 *   <OverviewPanel />
 *   <DetailsPanel />
 *   <PricingPanel />
 * </TileAnimationsTabMorph>
 */

import { memo, useCallback, useEffect, useId, useRef, useState } from 'react'
import type { ReactNode } from 'react'

import styles from './TileAnimationsTabMorph.module.css'
import { DemoCard } from '@/components/demo-blocks'

const DEFAULT_TAB_COUNT = 4
const EXIT_DURATION_MS = 200

interface TileAnimationsTabMorphProps {
  /** Panel content — each child is one tab's content. When omitted, renders placeholder panels. */
  children?: ReactNode
  /** Tab header labels. Default generates "Tab 1", "Tab 2", etc. */
  labels?: string[]
  /** Controlled active tab index. When provided, component is controlled. */
  activeIndex?: number
  /** Callback when a tab is clicked. Fires in both controlled and uncontrolled mode. */
  onTabChange?: (index: number) => void
  /** Delay between each tab's entrance animation in ms. Default 260. */
  stagger?: number
}

function generatePlaceholders(count: number): ReactNode[] {
  return Array.from({ length: count }, (_, i) => (
    <DemoCard key={`placeholder-${i}`} title={`Content ${i + 1}`} />
  ))
}

function TileAnimationsTabMorphComponent({
  children,
  labels,
  activeIndex,
  onTabChange,
  stagger = 260,
}: TileAnimationsTabMorphProps) {
  const baseId = useId()
  const [internalIndex, setInternalIndex] = useState(0)
  /** The index currently rendered in the panel. Lags behind safeIndex during exit. */
  const [displayedIndex, setDisplayedIndex] = useState(() =>
    activeIndex !== undefined ? Math.max(0, activeIndex) : 0
  )
  const panelRef = useRef<HTMLDivElement>(null)
  const exitTimerRef = useRef(0)

  const items = children !== undefined ? (Array.isArray(children) ? children : [children]) : []
  const renderItems = items.length > 0 ? items : generatePlaceholders(DEFAULT_TAB_COUNT)
  const count = renderItems.length

  const isControlled = activeIndex !== undefined
  const currentIndex = isControlled ? activeIndex : internalIndex
  const safeIndex = Math.min(Math.max(currentIndex, 0), count - 1)

  const tabLabels =
    labels !== undefined && labels.length > 0
      ? labels
      : Array.from({ length: count }, (_, i) => `Tab ${i + 1}`)

  const handleTabClick = useCallback(
    (index: number) => {
      if (onTabChange !== undefined) {
        onTabChange(index)
      }
      if (!isControlled) {
        setInternalIndex(index)
      }
    },
    [isControlled, onTabChange]
  )

  const handleTabKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      let nextIndex: number | null = null
      if (e.key === 'ArrowRight') nextIndex = (safeIndex + 1) % count
      else if (e.key === 'ArrowLeft') nextIndex = (safeIndex - 1 + count) % count
      else if (e.key === 'Home') nextIndex = 0
      else if (e.key === 'End') nextIndex = count - 1
      if (nextIndex !== null) {
        e.preventDefault()
        handleTabClick(nextIndex)
        const nextTab = document.querySelector<HTMLElement>(
          `[data-testid="tab-morph-tab-${nextIndex}"]`
        )
        nextTab?.focus()
      }
    },
    [safeIndex, count, handleTabClick]
  )

  const enterClass = styles['pf-tab-morph__panel--enter'] ?? ''
  const exitLeftClass = styles['pf-tab-morph__panel--exit-left'] ?? ''
  const exitRightClass = styles['pf-tab-morph__panel--exit-right'] ?? ''

  // Transition panel: exit old content, then swap to new content with enter animation
  useEffect(() => {
    if (safeIndex === displayedIndex) return

    const panel = panelRef.current
    if (panel === null) {
      setDisplayedIndex(safeIndex)
      return
    }

    // Cancel any in-flight exit transition (handles rapid clicks)
    clearTimeout(exitTimerRef.current)

    const isForward = safeIndex > displayedIndex
    panel.classList.remove(enterClass, exitLeftClass, exitRightClass)
    panel.classList.add(isForward ? exitLeftClass : exitRightClass)

    exitTimerRef.current = window.setTimeout(() => {
      setDisplayedIndex(safeIndex)
      panel.classList.remove(exitLeftClass, exitRightClass)
      panel.classList.add(enterClass)
    }, EXIT_DURATION_MS)

    return () => {
      clearTimeout(exitTimerRef.current)
      // Clean up transition classes when the effect re-runs (e.g. rapid tab clicks)
      panel.classList.remove(exitLeftClass, exitRightClass)
      if (!panel.classList.contains(enterClass)) {
        panel.classList.add(enterClass)
      }
    }
  }, [safeIndex, displayedIndex, enterClass, exitLeftClass, exitRightClass])

  // Clean up timer on unmount
  useEffect(() => () => clearTimeout(exitTimerRef.current), [])

  return (
    <div className={styles['pf-tab-morph']} data-animation-id="tile-animations__tab-morph">
      <div className={styles['pf-tab-morph__nav']} role="tablist">
        {tabLabels.map((label, i) => (
          <div
            key={i}
            role="tab"
            id={`${baseId}-tab-${i}`}
            aria-selected={i === safeIndex}
            aria-controls={`${baseId}-panel`}
            tabIndex={i === safeIndex ? 0 : -1}
            className={`${styles['pf-tab-morph__tab']} ${styles['pf-tab-morph__tab--animated']}${i === safeIndex ? ` ${styles['pf-tab-morph__tab--active']}` : ''}`}
            style={{ animationDelay: `${(i * stagger) / 1000}s` }}
            onClick={() => handleTabClick(i)}
            onKeyDown={handleTabKeyDown}
            data-testid={`tab-morph-tab-${i}`}
          >
            {label}
          </div>
        ))}
      </div>

      <div
        className={styles['pf-tab-morph__content']}
        role="tabpanel"
        id={`${baseId}-panel`}
        aria-labelledby={`${baseId}-tab-${safeIndex}`}
      >
        <div
          ref={panelRef}
          className={`${styles['pf-tab-morph__panel']} ${styles['pf-tab-morph__panel--enter']}`}
        >
          {renderItems[displayedIndex]}
        </div>
      </div>
    </div>
  )
}

export const TileAnimationsTabMorph = memo(TileAnimationsTabMorphComponent)
