/**
 * Tab panel container with pop-scale tab entrance and sliding content transitions — CSS variant.
 * Supports controlled (activeIndex + onTabChange) or uncontrolled (internal state) usage.
 *
 * Copy-paste files: this file + ModalOrchestrationTabMorph.css
 * Runtime deps: react
 *
 * @example
 * <ModalOrchestrationTabMorph labels={['Overview', 'Details', 'Pricing']}>
 *   <OverviewPanel />
 *   <DetailsPanel />
 *   <PricingPanel />
 * </ModalOrchestrationTabMorph>
 */

import { memo, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'

import './ModalOrchestrationTabMorph.css'
import { DemoCard } from '@/components/demo-blocks'

const DEFAULT_TAB_COUNT = 4

interface ModalOrchestrationTabMorphProps {
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

function ModalOrchestrationTabMorphComponent({
  children,
  labels,
  activeIndex,
  onTabChange,
  stagger = 260,
}: ModalOrchestrationTabMorphProps) {
  const [internalIndex, setInternalIndex] = useState(0)
  const panelRef = useRef<HTMLDivElement>(null)
  const prevIndexRef = useRef(0)

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

  const handleTabClick = (index: number) => {
    if (onTabChange !== undefined) {
      onTabChange(index)
    }
    if (!isControlled) {
      setInternalIndex(index)
    }
  }

  // Handle panel slide transitions
  useEffect(() => {
    const panel = panelRef.current
    if (panel === null) return

    const isForward = safeIndex > prevIndexRef.current

    panel.classList.remove(
      'pf-tab-morph__panel--enter',
      'pf-tab-morph__panel--exit-left',
      'pf-tab-morph__panel--exit-right'
    )
    panel.classList.add(
      isForward ? 'pf-tab-morph__panel--exit-left' : 'pf-tab-morph__panel--exit-right'
    )

    const exitTimeout = setTimeout(() => {
      panel.classList.remove('pf-tab-morph__panel--exit-left', 'pf-tab-morph__panel--exit-right')
      panel.classList.add('pf-tab-morph__panel--enter')
    }, 200)

    prevIndexRef.current = safeIndex

    return () => clearTimeout(exitTimeout)
  }, [safeIndex])

  return (
    <div className="pf-tab-morph" data-animation-id="modal-orchestration__tab-morph">
      <div className="pf-tab-morph__nav">
        {tabLabels.map((label, i) => (
          <div
            key={i}
            className={`pf-tab-morph__tab pf-tab-morph__tab--animated${i === safeIndex ? ' pf-tab-morph__tab--active' : ''}`}
            style={{ animationDelay: `${(i * stagger) / 1000}s` }}
            onClick={() => handleTabClick(i)}
            data-testid={`tab-morph-tab-${i}`}
          >
            {label}
          </div>
        ))}
      </div>

      <div className="pf-tab-morph__content">
        <div ref={panelRef} className="pf-tab-morph__panel pf-tab-morph__panel--enter">
          {renderItems[safeIndex]}
        </div>
      </div>
    </div>
  )
}

export const ModalOrchestrationTabMorph = memo(ModalOrchestrationTabMorphComponent)
