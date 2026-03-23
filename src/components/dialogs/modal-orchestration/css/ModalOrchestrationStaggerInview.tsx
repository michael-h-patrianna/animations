/**
 * Stagger-reveals child elements one by one on mount — CSS variant.
 *
 * Copy-paste files: this file + ModalOrchestrationStaggerInview.css
 * Runtime deps: react
 *
 * @example
 * <ModalOrchestrationStaggerInview stagger={100} duration={600} distance={60}>
 *   <Card>...</Card>
 *   <Card>...</Card>
 * </ModalOrchestrationStaggerInview>
 */

import { memo, useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import './ModalOrchestrationStaggerInview.css'
import { DemoCard } from '@/components/demo-blocks'

const DEFAULT_COUNT = 12

interface ModalOrchestrationStaggerInviewProps {
  /** Items to stagger-reveal. When omitted, renders placeholder tiles. */
  children?: ReactNode
  /** Delay between each item's entrance in ms. Default 100. */
  stagger?: number
  /** Duration of each item's entrance animation in ms. Default 600. */
  duration?: number
  /** Vertical travel distance in px. Default 60. */
  distance?: number
  /** Number of grid columns. Default 4. */
  columns?: number
}

function generatePlaceholders(count: number): ReactNode[] {
  return Array.from({ length: count }, (_, i) => (
    <DemoCard key={`placeholder-${i}`} title={`Item ${i + 1}`}>
        <p></p>
      </DemoCard>
  ))
}

function ModalOrchestrationStaggerInviewComponent({
  children,
  stagger = 100,
  duration = 600,
  distance = 60,
  columns = 4,
}: ModalOrchestrationStaggerInviewProps) {
  const itemsRef = useRef<(HTMLDivElement | null)[]>([])

  const items = children !== undefined ? (Array.isArray(children) ? children : [children]) : []
  const renderItems = items.length > 0 ? items : generatePlaceholders(DEFAULT_COUNT)

  useEffect(() => {
    itemsRef.current.filter(Boolean).forEach((el, index) => {
      if (el !== null) {
        el.style.animationDelay = `${(index * stagger) / 1000}s`
        el.style.animationDuration = `${duration / 1000}s`
        el.style.setProperty('--pf-stagger-distance', `${distance}px`)
        el.classList.add('pf-stagger-inview__item--visible')
      }
    })
  }, [stagger, duration, distance])

  return (
    <div className="pf-stagger-inview" data-animation-id="modal-orchestration__stagger-inview">
      <div
        className="pf-stagger-inview__grid"
        style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
      >
        {renderItems.map((child, i) => (
          <div
            key={i}
            ref={(el) => {
              itemsRef.current[i] = el
            }}
            className="pf-stagger-inview__item"
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  )
}

export const ModalOrchestrationStaggerInview = memo(ModalOrchestrationStaggerInviewComponent)
