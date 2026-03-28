/**
 * Spring-physics stagger entrance with interactive hover-lift and tap-press gestures.
 *
 * Copy-paste files: this file + ModalOrchestrationSpringPhysics.css
 * Runtime deps: react, motion
 *
 * @example
 * <ModalOrchestrationSpringPhysics stagger={100} stiffness={300} damping={10}>
 *   <ProductCard>...</ProductCard>
 *   <ProductCard>...</ProductCard>
 * </ModalOrchestrationSpringPhysics>
 */

import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import { memo } from 'react'
import type { ReactNode } from 'react'
import { DemoCard } from '@/components/demo-blocks'
import styles from './ModalOrchestrationSpringPhysics.module.css'

const DEFAULT_COUNT = 6

interface ModalOrchestrationSpringPhysicsProps {
  /** Items to bounce in. When omitted, renders placeholder tiles. */
  children?: ReactNode
  /** Delay between each item's entrance in ms. Default 100. */
  stagger?: number
  /** Spring stiffness. Higher = snappier. Default 300. */
  stiffness?: number
  /** Spring damping. Lower = more oscillation. Default 10. */
  damping?: number
  /** Spring mass. Higher = more inertia. Default 1. */
  mass?: number
  /** Number of grid columns. Default 3. */
  columns?: number
}

function generatePlaceholders(count: number): ReactNode[] {
  return Array.from({ length: count }, (_, i) => (
    <DemoCard key={`placeholder-${i}`} title={`Elastic ${i + 1}`}>
      <p>Spring bounce</p>
    </DemoCard>
  ))
}

function ModalOrchestrationSpringPhysicsComponent({
  children,
  stagger = 100,
  stiffness = 300,
  damping = 10,
  mass = 1,
  columns = 3,
}: ModalOrchestrationSpringPhysicsProps) {
  const prefersReducedMotion = useReducedMotion()

  const items = children !== undefined ? (Array.isArray(children) ? children : [children]) : []
  const renderItems = items.length > 0 ? items : generatePlaceholders(DEFAULT_COUNT)

  const noMotion = !!prefersReducedMotion
  const staggerS = stagger / 1000

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
    hidden: { scale: 0, y: -100, opacity: 0 },
    visible: {
      scale: 1,
      y: 0,
      opacity: 1,
      transition: noMotion
        ? { duration: 0.15 }
        : {
            scale: { type: 'spring' as const, stiffness, damping, mass, restDelta: 0.005 },
            y: { type: 'spring' as const, stiffness, damping, mass, restDelta: 0.5 },
            opacity: { duration: 0.2 },
          },
    },
  }

  const hoverAnimation = noMotion
    ? undefined
    : {
        scale: 1.05,
        y: -8,
        transition: { type: 'spring' as const, stiffness: 300, damping: 12, mass: 0.8 },
      }

  const tapAnimation = noMotion
    ? undefined
    : {
        scale: 0.95,
        transition: { type: 'spring' as const, stiffness: 400, damping: 15 },
      }

  return (
    <m.div
      className={styles['pf-spring-physics-fm']}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      data-animation-id="modal-orchestration__spring-physics"
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
    >
      {renderItems.map((child, i) => (
        <m.div
          key={i}
          className={styles['pf-spring-physics-fm__item']}
          variants={itemVariants}
          whileHover={hoverAnimation}
          whileTap={tapAnimation}
        >
          {child}
        </m.div>
      ))}
    </m.div>
  )
}

export const ModalOrchestrationSpringPhysics = memo(ModalOrchestrationSpringPhysicsComponent)
