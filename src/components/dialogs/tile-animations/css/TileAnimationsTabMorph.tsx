/**
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

import { memo, useCallback, useEffect, useRef, useState } from 'react'
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
  const [internalIndex, setInternalIndex] = useState(0)
  /** The index currently rendered in the panel. Lags behind safeIndex during exit. */
  const [displayedIndex, setDisplayedIndex] = useState(0)
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
      <div className={styles['pf-tab-morph__nav']}>
        {tabLabels.map((label, i) => (
          <div
            key={i}
            className={`${styles['pf-tab-morph__tab']} ${styles['pf-tab-morph__tab--animated']}${i === safeIndex ? ` ${styles['pf-tab-morph__tab--active']}` : ''}`}
            style={{ animationDelay: `${(i * stagger) / 1000}s` }}
            onClick={() => handleTabClick(i)}
            data-testid={`tab-morph-tab-${i}`}
          >
            {label}
          </div>
        ))}
      </div>

      <div className={styles['pf-tab-morph__content']}>
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
