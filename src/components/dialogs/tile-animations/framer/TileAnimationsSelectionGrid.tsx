/**
 * Cascading stagger entrance for a grid of child elements on mount.
 *
 * Copy-paste files: this file + TileAnimationsSelectionGrid.module.css
 * Runtime deps: react, motion
 *
 * @example
 * <TileAnimationsSelectionGrid stagger={260} columns={3}>
 *   <OptionCard>...</OptionCard>
 *   <OptionCard>...</OptionCard>
 * </TileAnimationsSelectionGrid>
 */

import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import { memo } from 'react'
import type { ReactNode } from 'react'
import { DemoCard } from '@/components/demo-blocks'
import styles from './TileAnimationsSelectionGrid.module.css'

const DEFAULT_COUNT = 6

interface TileAnimationsSelectionGridProps {
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

function TileAnimationsSelectionGridComponent({
  children,
  stagger = 260,
  duration = 210,
  distance = 16,
  columns = 3,
}: TileAnimationsSelectionGridProps) {
  const prefersReducedMotion = useReducedMotion()

  const items = children !== undefined ? (Array.isArray(children) ? children : [children]) : []
  const renderItems = items.length > 0 ? items : generatePlaceholders(DEFAULT_COUNT)

  const noMotion = !!prefersReducedMotion
  const staggerS = stagger / 1000
  const durationS = duration / 1000

  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: noMotion ? 0 : staggerS },
    },
  }

  const itemVariants = {
    hidden: { y: noMotion ? 0 : distance, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: noMotion ? 0.15 : durationS,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    },
  }

  return (
    <m.div
      className={styles['pf-selection-grid-fm']}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      data-animation-id="tile-animations__selection-grid"
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
    >
      {renderItems.map((child, i) => (
        <m.div key={i} className={styles['pf-selection-grid-fm__item']} variants={itemVariants}>
          {child}
        </m.div>
      ))}
    </m.div>
  )
}

export const TileAnimationsSelectionGrid = memo(TileAnimationsSelectionGridComponent)
