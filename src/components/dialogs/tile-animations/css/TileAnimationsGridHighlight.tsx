/**
 * Reduced-motion note: catalog-only data-reduced-motion mirroring supplements
 * OS @media (prefers-reduced-motion) rules; consumers do not need to copy it.
 * Stagger entrance with scale bounce for a grid of children — CSS variant.
 *
 * Copy-paste files: this file + TileAnimationsGridHighlight.module.css
 * Runtime deps: react
 *
 * @example
 * <TileAnimationsGridHighlight stagger={260} columns={2}>
 *   <PricingTier>...</PricingTier>
 *   <PricingTier>...</PricingTier>
 * </TileAnimationsGridHighlight>
 */

import { memo } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import styles from './TileAnimationsGridHighlight.module.css'
import { DemoCard } from '@/components/demo-blocks'

const DEFAULT_COUNT = 5

interface TileAnimationsGridHighlightProps {
  /** Items to stagger in. When omitted, renders placeholder items. */
  children?: ReactNode
  /** Delay between each item's entrance in ms. Default 260. */
  stagger?: number
  /** Duration of each item's entrance animation in ms. Default 210. */
  duration?: number
  /** Vertical entrance distance in px. Default 16. */
  distance?: number
  /** Number of grid columns. Default 2. */
  columns?: number
}

function generatePlaceholders(count: number): ReactNode[] {
  return Array.from({ length: count }, (_, i) => (
    <DemoCard key={`placeholder-${i}`} title={`Item ${i + 1}`} />
  ))
}

function TileAnimationsGridHighlightComponent({
  children,
  stagger = 260,
  duration = 210,
  distance = 16,
  columns = 2,
}: TileAnimationsGridHighlightProps) {
  const items = children !== undefined ? (Array.isArray(children) ? children : [children]) : []
  const renderItems = items.length > 0 ? items : generatePlaceholders(DEFAULT_COUNT)

  return (
    <div
      className={styles['pf-grid-highlight']}
      data-animation-id="tile-animations__grid-highlight"
      style={
        {
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          ['--pf-grid-highlight-distance' as string]: `${distance}px`,
        } as CSSProperties
      }
    >
      {renderItems.map((child, i) => (
        <div
          key={i}
          className={`${styles['pf-grid-highlight__item']} ${styles['pf-grid-highlight__item--visible']}`}
          style={{
            animationDelay: `${(i * stagger) / 1000}s`,
            animationDuration: `${duration / 1000}s`,
          }}
        >
          {child}
        </div>
      ))}
    </div>
  )
}

export const TileAnimationsGridHighlight = memo(TileAnimationsGridHighlightComponent)
