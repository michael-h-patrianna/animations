/**
 * Stagger entrance with scale bounce for a grid of children.
 *
 * Copy-paste files: this file + ModalOrchestrationGridHighlight.module.css
 * Runtime deps: react, motion
 *
 * @example
 * <ModalOrchestrationGridHighlight stagger={260} columns={2}>
 *   <PricingTier>...</PricingTier>
 *   <PricingTier>...</PricingTier>
 * </ModalOrchestrationGridHighlight>
 */

import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import { memo } from 'react'
import type { ReactNode } from 'react'
import { DemoCard } from '@/components/demo-blocks'
import styles from './ModalOrchestrationGridHighlight.module.css'

const DEFAULT_COUNT = 5

interface ModalOrchestrationGridHighlightProps {
  /** Items to stagger in. When omitted, renders placeholder items. */
  children?: ReactNode
  /** Delay between each item's entrance in ms. Default 260. */
  stagger?: number
  /** Duration of each item's entrance animation in ms. Default 210. */
  duration?: number
  /** Vertical travel distance in px. Default 16. */
  distance?: number
  /** Number of grid columns. Default 2. */
  columns?: number
}

function generatePlaceholders(count: number): ReactNode[] {
  return Array.from({ length: count }, (_, i) => (
    <DemoCard key={`placeholder-${i}`} title={`Item ${i + 1}`} />
  ))
}

function ModalOrchestrationGridHighlightComponent({
  children,
  stagger = 260,
  duration = 210,
  distance = 16,
  columns = 2,
}: ModalOrchestrationGridHighlightProps) {
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
    hidden: { y: noMotion ? 0 : distance, opacity: 0, scale: 0.9 },
    visible: {
      y: 0,
      opacity: 1,
      scale: [0.9, 1.05, 1],
      transition: {
        duration: noMotion ? 0.15 : durationS,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    },
  }

  return (
    <m.div
      className={styles['pf-grid-highlight-fm']}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      data-animation-id="modal-orchestration__grid-highlight"
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
    >
      {renderItems.map((child, i) => (
        <m.div key={i} className={styles['pf-grid-highlight-fm__item']} variants={itemVariants}>
          {child}
        </m.div>
      ))}
    </m.div>
  )
}

export const ModalOrchestrationGridHighlight = memo(ModalOrchestrationGridHighlightComponent)
