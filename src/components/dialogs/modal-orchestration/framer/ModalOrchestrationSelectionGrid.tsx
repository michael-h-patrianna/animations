/**
 * Cascading stagger entrance for a grid of child elements on mount.
 *
 * Copy-paste files: this file + ModalOrchestrationSelectionGrid.css
 * Runtime deps: react, motion
 *
 * @example
 * <ModalOrchestrationSelectionGrid stagger={260} columns={3}>
 *   <OptionCard>...</OptionCard>
 *   <OptionCard>...</OptionCard>
 * </ModalOrchestrationSelectionGrid>
 */

import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import { memo, useMemo } from 'react'
import type { ReactNode } from 'react'
import { DemoCard } from '@/components/demo-blocks'

const DEFAULT_COUNT = 6
const DEFAULT_DISTANCE = 16

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
  distance = DEFAULT_DISTANCE,
  columns = 3,
}: ModalOrchestrationSelectionGridProps) {
  const prefersReducedMotion = useReducedMotion()

  const items = children !== undefined ? (Array.isArray(children) ? children : [children]) : []
  const renderItems = items.length > 0 ? items : generatePlaceholders(DEFAULT_COUNT)

  const staggerS = stagger / 1000
  const durationS = duration / 1000
  const safeDistance = prefersReducedMotion === true ? 0 : distance

  const containerVariants = useMemo(
    () => ({
      hidden: {},
      visible: {
        transition: {
          staggerChildren: prefersReducedMotion === true ? 0 : staggerS,
        },
      },
    }),
    [staggerS, prefersReducedMotion]
  )

  const itemVariants = useMemo(
    () => ({
      hidden: {
        y: safeDistance,
        opacity: 0,
      },
      visible: {
        y: 0,
        opacity: 1,
        transition: {
          duration: prefersReducedMotion === true ? 0 : durationS,
          ease: [0.25, 0.46, 0.45, 0.94] as const,
        },
      },
    }),
    [safeDistance, durationS, prefersReducedMotion]
  )

  return (
    <m.div
      className="pf-selection-grid"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      data-animation-id="modal-orchestration__selection-grid"
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)`, animation: 'none' }}
    >
      {renderItems.map((child, i) => (
        <m.div
          key={i}
          className="pf-selection-grid__item"
          variants={itemVariants}
          style={{ animation: 'none' }}
        >
          {child}
        </m.div>
      ))}
    </m.div>
  )
}

export const ModalOrchestrationSelectionGrid = memo(ModalOrchestrationSelectionGridComponent)
