/**
 * Rotate-scale morph entrance for side-by-side comparison panes — CSS variant.
 *
 * Copy-paste files: this file + TileAnimationsComparisonMorph.module.css
 * Runtime deps: react
 *
 * @example
 * <TileAnimationsComparisonMorph stagger={260}>
 *   <PricingPlanA>...</PricingPlanA>
 *   <PricingPlanB>...</PricingPlanB>
 * </TileAnimationsComparisonMorph>
 */

import { memo } from 'react'
import type { ReactNode } from 'react'
import styles from './TileAnimationsComparisonMorph.module.css'
import { DemoCard } from '@/components/demo-blocks'

const DEFAULT_COUNT = 2

interface TileAnimationsComparisonMorphProps {
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
    <DemoCard key={`placeholder-${i}`} title={labels[i] ?? `Option ${i + 1}`}>
      <p>Comparison pane {i + 1} with details and benefits.</p>
    </DemoCard>
  ))
}

function TileAnimationsComparisonMorphComponent({
  children,
  stagger = 260,
  duration = 312,
}: TileAnimationsComparisonMorphProps) {
  const items = children !== undefined ? (Array.isArray(children) ? children : [children]) : []
  const renderItems = items.length > 0 ? items : generatePlaceholders(DEFAULT_COUNT)

  return (
    <div
      className={styles['pf-comparison-morph']}
      data-animation-id="tile-animations__comparison-morph"
    >
      {renderItems.map((child, i) => (
        <div
          key={i}
          className={`${styles['pf-comparison-morph__pane']} ${styles['pf-comparison-morph__pane--visible']}`}
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

export const TileAnimationsComparisonMorph = memo(TileAnimationsComparisonMorphComponent)
