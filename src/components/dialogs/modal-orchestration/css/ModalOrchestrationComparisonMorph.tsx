/**
 * Rotate-scale morph entrance for side-by-side comparison panes — CSS variant.
 *
 * Copy-paste files: this file + ModalOrchestrationComparisonMorph.css
 * Runtime deps: react
 *
 * @example
 * <ModalOrchestrationComparisonMorph stagger={260}>
 *   <PricingPlanA>...</PricingPlanA>
 *   <PricingPlanB>...</PricingPlanB>
 * </ModalOrchestrationComparisonMorph>
 */

import { memo, useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import './ModalOrchestrationComparisonMorph.css'

const DEFAULT_COUNT = 2

interface ModalOrchestrationComparisonMorphProps {
  /** Comparison panes (typically 2). When omitted, renders placeholder panes. */
  children?: ReactNode
  /** Delay between each pane's entrance in ms. Default 260. */
  stagger?: number
  /** Duration of each pane's entrance animation in ms. Default 312. */
  duration?: number
}

function generatePlaceholders(count: number): ReactNode[] {
  const labels = ['Option A', 'Option B', 'Option C', 'Option D']
  return Array.from({ length: count }, (_, i) => (
    <div key={`placeholder-${i}`}>
      <h5>{labels[i] ?? `Option ${i + 1}`}</h5>
      <p>Comparison pane {i + 1} with details and benefits.</p>
    </div>
  ))
}

function ModalOrchestrationComparisonMorphComponent({
  children,
  stagger = 260,
  duration = 312,
}: ModalOrchestrationComparisonMorphProps) {
  const panesRef = useRef<(HTMLDivElement | null)[]>([])

  const items = children !== undefined ? (Array.isArray(children) ? children : [children]) : []
  const renderItems = items.length > 0 ? items : generatePlaceholders(DEFAULT_COUNT)

  useEffect(() => {
    panesRef.current.filter(Boolean).forEach((el, index) => {
      if (el !== null) {
        el.style.animationDelay = `${(index * stagger) / 1000}s`
        el.style.animationDuration = `${duration / 1000}s`
        el.classList.add('pf-comparison-morph__pane--visible')
      }
    })
  }, [stagger, duration])

  return (
    <div
      className="pf-comparison-morph"
      data-animation-id="modal-orchestration__comparison-morph"
    >
      {renderItems.map((child, i) => (
        <div
          key={i}
          ref={(el) => {
            panesRef.current[i] = el
          }}
          className="pf-comparison-morph__pane"
        >
          {child}
        </div>
      ))}
    </div>
  )
}

export const ModalOrchestrationComparisonMorph = memo(ModalOrchestrationComparisonMorphComponent)
