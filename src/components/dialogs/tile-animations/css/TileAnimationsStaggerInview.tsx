/**
 * Stagger-reveals child elements one by one on mount — CSS variant.
 *
 * Copy-paste files: this file + TileAnimationsStaggerInview.module.css
 * Runtime deps: react
 *
 * @example
 * <TileAnimationsStaggerInview stagger={100} duration={600} distance={60}>
 *   <Card>...</Card>
 *   <Card>...</Card>
 * </TileAnimationsStaggerInview>
 */

import { memo } from 'react'
import type { ReactNode } from 'react'
import styles from './TileAnimationsStaggerInview.module.css'
import { DemoCard } from '@/components/demo-blocks'

const DEFAULT_COUNT = 12

interface TileAnimationsStaggerInviewProps {
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
    <DemoCard key={`placeholder-${i}`} title={`Item ${i + 1}`} />
  ))
}

function TileAnimationsStaggerInviewComponent({
  children,
  stagger = 100,
  duration = 600,
  distance = 60,
  columns = 4,
}: TileAnimationsStaggerInviewProps) {
  const items = children !== undefined ? (Array.isArray(children) ? children : [children]) : []
  const renderItems = items.length > 0 ? items : generatePlaceholders(DEFAULT_COUNT)

  return (
    <div
      className={styles['pf-stagger-inview']}
      data-animation-id="tile-animations__stagger-inview"
    >
      <div
        className={styles['pf-stagger-inview__grid']}
        style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
      >
        {renderItems.map((child, i) => (
          <div
            key={i}
            className={`${styles['pf-stagger-inview__item']} ${styles['pf-stagger-inview__item--visible']}`}
            style={
              {
                animationDelay: `${(i * stagger) / 1000}s`,
                animationDuration: `${duration / 1000}s`,
                '--pf-stagger-distance': `${distance}px`,
              } as React.CSSProperties
            }
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  )
}

export const TileAnimationsStaggerInview = memo(TileAnimationsStaggerInviewComponent)
