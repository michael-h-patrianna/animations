/**
 * Stagger entrance with scale bounce and gradient highlight background — CSS variant.
 *
 * Copy-paste files: this file + ModalOrchestrationGridHighlight.css
 * Runtime deps: react
 *
 * @example
 * <ModalOrchestrationGridHighlight stagger={260} columns={2}>
 *   <PricingTier>...</PricingTier>
 *   <PricingTier>...</PricingTier>
 * </ModalOrchestrationGridHighlight>
 */

import { memo, useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import './ModalOrchestrationGridHighlight.css'
import { DemoCard } from '@/components/demo-blocks'

const DEFAULT_COUNT = 5

interface ModalOrchestrationGridHighlightProps {
  /** Items to stagger in with highlight. When omitted, renders placeholder items. */
  children?: ReactNode
  /** Delay between each item's entrance in ms. Default 260. */
  stagger?: number
  /** Duration of each item's entrance animation in ms. Default 210. */
  duration?: number
  /** Number of grid columns. Default 2. */
  columns?: number
  /** Start color of the gradient highlight. */
  highlightColor?: string
  /** End color of the gradient highlight. */
  highlightAccent?: string
}

function generatePlaceholders(count: number): ReactNode[] {
  return Array.from({ length: count }, (_, i) => (
    <DemoCard key={`placeholder-${i}`} title={`Item ${i + 1}`}>
      <p>Highlight sweep</p>
    </DemoCard>
  ))
}

function ModalOrchestrationGridHighlightComponent({
  children,
  stagger = 260,
  duration = 210,
  columns = 2,
  highlightColor,
  highlightAccent,
}: ModalOrchestrationGridHighlightProps) {
  const itemsRef = useRef<(HTMLDivElement | null)[]>([])

  const items = children !== undefined ? (Array.isArray(children) ? children : [children]) : []
  const renderItems = items.length > 0 ? items : generatePlaceholders(DEFAULT_COUNT)

  useEffect(() => {
    itemsRef.current.filter(Boolean).forEach((el, index) => {
      if (el !== null) {
        el.style.animationDelay = `${(index * stagger) / 1000}s`
        el.style.animationDuration = `${duration / 1000}s`
        if (highlightColor !== undefined) {
          el.style.setProperty('--pf-grid-highlight-start', highlightColor)
        }
        if (highlightAccent !== undefined) {
          el.style.setProperty('--pf-grid-highlight-end', highlightAccent)
        }
        el.classList.add('pf-grid-highlight__item--visible')
      }
    })
  }, [stagger, duration, highlightColor, highlightAccent])

  return (
    <div
      className="pf-grid-highlight"
      data-animation-id="modal-orchestration__grid-highlight"
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
    >
      {renderItems.map((child, i) => (
        <div
          key={i}
          ref={(el) => {
            itemsRef.current[i] = el
          }}
          className="pf-grid-highlight__item"
        >
          {child}
        </div>
      ))}
    </div>
  )
}

export const ModalOrchestrationGridHighlight = memo(ModalOrchestrationGridHighlightComponent)
