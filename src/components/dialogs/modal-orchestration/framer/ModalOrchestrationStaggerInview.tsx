/**
 * Stagger-reveals child elements one by one on mount.
 *
 * Copy-paste files: this file + ModalOrchestrationStaggerInview.css
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
import { memo, useMemo } from 'react'
import type { ReactNode } from 'react'

const DEFAULT_COUNT = 12
const DEFAULT_DISTANCE = 60

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
    <div key={`placeholder-${i}`}>
      <h5>Item {i + 1}</h5>
      <p>Content {i + 1}</p>
    </div>
  ))
}

function ModalOrchestrationStaggerInviewComponent({
  children,
  stagger = 100,
  duration = 600,
  distance = DEFAULT_DISTANCE,
  columns = 4,
}: ModalOrchestrationStaggerInviewProps) {
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
          delayChildren: prefersReducedMotion === true ? 0 : staggerS * 2,
        },
      },
    }),
    [staggerS, prefersReducedMotion]
  )

  const itemVariants = useMemo(
    () => ({
      hidden: {
        opacity: 0,
        y: safeDistance,
        scale: 0.8,
      },
      visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
          duration: prefersReducedMotion === true ? 0 : durationS,
          ease: [0.25, 0.46, 0.45, 0.94] as const,
        },
      },
    }),
    [safeDistance, durationS, prefersReducedMotion]
  )

  return (
    <div
      className="pf-stagger-inview"
      data-animation-id="modal-orchestration__stagger-inview"
    >
      <m.div
        className="pf-stagger-inview__grid"
        style={{ gridTemplateColumns: `repeat(${columns}, 1fr)`, animation: 'none' }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {renderItems.map((child, i) => (
          <m.div
            key={i}
            className="pf-stagger-inview__item"
            variants={itemVariants}
            style={{ animation: 'none' }}
          >
            {child}
          </m.div>
        ))}
      </m.div>
    </div>
  )
}

export const ModalOrchestrationStaggerInview = memo(ModalOrchestrationStaggerInviewComponent)
