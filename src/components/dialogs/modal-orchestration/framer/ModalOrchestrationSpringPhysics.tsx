/**
 * Spring-physics stagger entrance with interactive hover-lift and tap-press gestures.
 *
 * Copy-paste files: this file + ModalOrchestrationSpringPhysics.css
 * Runtime deps: react, motion
 *
 * @example
 * <ModalOrchestrationSpringPhysics stagger={100} stiffness={200} damping={15}>
 *   <ProductCard>...</ProductCard>
 *   <ProductCard>...</ProductCard>
 * </ModalOrchestrationSpringPhysics>
 */

import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import { memo, useMemo } from 'react'
import type { ReactNode } from 'react'
import { DemoCard } from '@/components/demo-blocks'

const DEFAULT_COUNT = 6

interface ModalOrchestrationSpringPhysicsProps {
  /** Items to bounce in. When omitted, renders placeholder tiles. */
  children?: ReactNode
  /** Delay between each item's entrance in ms. Default 100. */
  stagger?: number
  /** Spring stiffness. Higher = snappier. Default 200. */
  stiffness?: number
  /** Spring damping. Lower = more oscillation. Default 15. */
  damping?: number
  /** Spring mass. Higher = more inertia. Default 1.2. */
  mass?: number
  /** Number of grid columns. Default 3. */
  columns?: number
}

function generatePlaceholders(count: number): ReactNode[] {
  return Array.from({ length: count }, (_, i) => (
    <DemoCard key={`placeholder-${i}`} title="Elastic {i + 1}">
        <p>Spring bounce</p>
      </DemoCard>
  ))
}

function ModalOrchestrationSpringPhysicsComponent({
  children,
  stagger = 100,
  stiffness = 200,
  damping = 15,
  mass = 1.2,
  columns = 3,
}: ModalOrchestrationSpringPhysicsProps) {
  const prefersReducedMotion = useReducedMotion()

  const items = children !== undefined ? (Array.isArray(children) ? children : [children]) : []
  const renderItems = items.length > 0 ? items : generatePlaceholders(DEFAULT_COUNT)

  const staggerS = stagger / 1000

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
        scale: 0,
        y: -100,
        opacity: 0,
      },
      visible: {
        scale: 1,
        y: 0,
        opacity: 1,
        transition:
          prefersReducedMotion === true
            ? { duration: 0 }
            : {
                type: 'spring' as const,
                stiffness,
                damping,
                mass,
              },
      },
    }),
    [stiffness, damping, mass, prefersReducedMotion]
  )

  const hoverAnimation =
    prefersReducedMotion === true
      ? undefined
      : {
          scale: 1.05,
          y: -8,
          transition: {
            type: 'spring' as const,
            stiffness: 400,
            damping: 20,
            mass: 0.8,
          },
        }

  const tapAnimation =
    prefersReducedMotion === true
      ? undefined
      : {
          scale: 0.95,
          transition: {
            type: 'spring' as const,
            stiffness: 600,
            damping: 25,
          },
        }

  return (
    <m.div
      className="pf-spring-physics"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      data-animation-id="modal-orchestration__spring-physics"
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)`, animation: 'none' }}
    >
      {renderItems.map((child, i) => (
        <m.div
          key={i}
          className="pf-spring-physics__item"
          variants={itemVariants}
          whileHover={hoverAnimation}
          whileTap={tapAnimation}
          style={{ animation: 'none' }}
        >
          {child}
        </m.div>
      ))}
    </m.div>
  )
}

export const ModalOrchestrationSpringPhysics = memo(ModalOrchestrationSpringPhysicsComponent)
