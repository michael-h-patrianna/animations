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

import { memo } from 'react'
import type { ReactNode } from 'react'
import styles from './ModalOrchestrationSelectionGrid.module.css'
import { DemoCard } from '@/components/demo-blocks'

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
    <DemoCard key={`placeholder-${i}`} title={`Option ${i + 1}`}>
      <p>Select item</p>
    </DemoCard>
  ))
}

function ModalOrchestrationSelectionGridComponent({
  children,
  stagger = 260,
  duration = 210,
  distance = 16,
  columns = 3,
}: ModalOrchestrationSelectionGridProps) {
  const items = children !== undefined ? (Array.isArray(children) ? children : [children]) : []
  const renderItems = items.length > 0 ? items : generatePlaceholders(DEFAULT_COUNT)

  return (
    <div
      className={styles['pf-selection-grid']}
      data-animation-id="modal-orchestration__selection-grid"
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
    >
      {renderItems.map((child, i) => (
        <div
          key={i}
          className={`${styles['pf-selection-grid__item']} ${styles['pf-selection-grid__item--visible']}`}
          style={
            {
              animationDelay: `${(i * stagger) / 1000}s`,
              animationDuration: `${duration / 1000}s`,
              '--pf-cascade-distance': `${distance}px`,
            } as React.CSSProperties
          }
        >
          {child}
        </div>
      ))}
    </div>
  )
}

export const ModalOrchestrationSelectionGrid = memo(ModalOrchestrationSelectionGridComponent)
