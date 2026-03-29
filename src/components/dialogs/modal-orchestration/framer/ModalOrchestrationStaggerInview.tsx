/**
 * Stagger-reveals child elements one by one on mount.
 *
 * Copy-paste files: this file + ModalOrchestrationStaggerInview.module.css
 * Runtime deps: react, motion
 *
 * @example
 * <ModalOrchestrationStaggerInview stagger={100} duration={600} distance={60}>
 *   <Card>...</Card>
 *   <Card>...</Card>
 * </ModalOrchestrationStaggerInview>
 */

import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import { memo } from 'react'
import type { ReactNode } from 'react'
import { DemoCard } from '@/components/demo-blocks'
import styles from './ModalOrchestrationStaggerInview.module.css'

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
    <DemoCard key={`placeholder-${i}`} title={`Item ${i + 1}`} />
  ))
}

function ModalOrchestrationStaggerInviewComponent({
  children,
  stagger = 100,
  duration = 600,
  distance = 60,
  columns = 4,
}: ModalOrchestrationStaggerInviewProps) {
  const prefersReducedMotion = useReducedMotion()

  const items = children !== undefined ? (Array.isArray(children) ? children : [children]) : []
  const renderItems = items.length > 0 ? items : generatePlaceholders(DEFAULT_COUNT)

  const noMotion = !!prefersReducedMotion
  const staggerS = stagger / 1000
  const durationS = duration / 1000

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: noMotion ? 0 : staggerS,
        delayChildren: noMotion ? 0 : staggerS * 2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: noMotion ? 0 : distance, scale: 0.8 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: noMotion ? 0.15 : durationS,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    },
  }

  return (
    <div
      className={styles['pf-stagger-inview-fm']}
      data-animation-id="modal-orchestration__stagger-inview"
    >
      <m.div
        className={styles['pf-stagger-inview-fm__grid']}
        style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {renderItems.map((child, i) => (
          <m.div key={i} className={styles['pf-stagger-inview-fm__item']} variants={itemVariants}>
            {child}
          </m.div>
        ))}
      </m.div>
    </div>
  )
}

export const ModalOrchestrationStaggerInview = memo(ModalOrchestrationStaggerInviewComponent)
