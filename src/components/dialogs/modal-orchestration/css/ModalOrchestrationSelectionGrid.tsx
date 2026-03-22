/**
 * Cascading stagger entrance for a grid of child elements on mount — CSS variant.
 *
 * Copy-paste files: this file + ModalOrchestrationSelectionGrid.css
 * Runtime deps: react
 *
 * @example
 * <ModalOrchestrationSelectionGrid stagger={260} columns={3}>
 *   <OptionCard>...</OptionCard>
 *   <OptionCard>...</OptionCard>
 * </ModalOrchestrationSelectionGrid>
 */

import { Children, memo, useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import './ModalOrchestrationSelectionGrid.css'

const DEFAULT_COUNT = 6

interface ModalOrchestrationSelectionGridProps {
  /** Items to cascade in. When omitted, renders placeholder tiles. */
  children?: ReactNode
  /** Delay between each item's entrance in ms. Default 260. */
  stagger?: number
  /** Duration of each item's entrance animation in ms. Default 210. */
  duration?: number
  /** Vertical travel distance in px. Default 16. */
  distance?: number
  /** Number of grid columns. Default 3. */
  columns?: number
}

function generatePlaceholders(count: number): ReactNode[] {
  return Array.from({ length: count }, (_, i) => (
    <div key={`placeholder-${i}`}>
      <strong>Option {i + 1}</strong>
      <br />
      Select item
    </div>
  ))
}

function ModalOrchestrationSelectionGridComponent({
  children,
  stagger = 260,
  duration = 210,
  distance = 16,
  columns = 3,
}: ModalOrchestrationSelectionGridProps) {
  const itemsRef = useRef<(HTMLDivElement | null)[]>([])

  const items = Children.toArray(children)
  const renderItems = items.length > 0 ? items : generatePlaceholders(DEFAULT_COUNT)

  useEffect(() => {
    itemsRef.current.filter(Boolean).forEach((el, index) => {
      if (el !== null) {
        el.style.animationDelay = `${(index * stagger) / 1000}s`
        el.style.animationDuration = `${duration / 1000}s`
        el.style.setProperty('--pf-cascade-distance', `${distance}px`)
        el.classList.add('pf-selection-grid__item--visible')
      }
    })
  }, [stagger, duration, distance])

  return (
    <div
      className="pf-selection-grid"
      data-animation-id="modal-orchestration__selection-grid"
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
    >
      {renderItems.map((child, i) => (
        <div
          key={i}
          ref={(el) => {
            itemsRef.current[i] = el
          }}
          className="pf-selection-grid__item"
        >
          {child}
        </div>
      ))}
    </div>
  )
}

export const ModalOrchestrationSelectionGrid = memo(ModalOrchestrationSelectionGridComponent)
