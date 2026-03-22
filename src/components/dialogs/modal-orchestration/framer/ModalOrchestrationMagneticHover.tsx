/**
 * 3D-tilt stagger entrance with perspective hover and tap gestures.
 *
 * Copy-paste files: this file + ModalOrchestrationMagneticHover.css
 * Runtime deps: react, motion
 *
 * @example
 * <ModalOrchestrationMagneticHover stagger={100} tiltIntensity={5} columns={4}>
 *   <FeatureCard>...</FeatureCard>
 *   <FeatureCard>...</FeatureCard>
 * </ModalOrchestrationMagneticHover>
 */

import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import { Children, memo, useMemo } from 'react'
import type { ReactNode } from 'react'

const DEFAULT_COUNT = 6

interface ModalOrchestrationMagneticHoverProps {
  /** Items to stagger in with 3D tilt. When omitted, renders placeholder tiles. */
  children?: ReactNode
  /** Delay between each item's entrance in ms. Default 100. */
  stagger?: number
  /** Duration of each item's entrance animation in ms. Default 600. */
  duration?: number
  /** Hover tilt intensity in degrees. Default 5. */
  tiltIntensity?: number
  /** Number of grid columns. Default 4. */
  columns?: number
}

function generatePlaceholders(count: number): ReactNode[] {
  return Array.from({ length: count }, (_, i) => (
    <div key={`placeholder-${i}`}>
      <h5>Hover {i + 1}</h5>
      <p>Magnetic tilt</p>
    </div>
  ))
}

function ModalOrchestrationMagneticHoverComponent({
  children,
  stagger = 100,
  duration = 600,
  tiltIntensity = 5,
  columns = 4,
}: ModalOrchestrationMagneticHoverProps) {
  const prefersReducedMotion = useReducedMotion()

  const items = Children.toArray(children)
  const renderItems = items.length > 0 ? items : generatePlaceholders(DEFAULT_COUNT)

  const staggerS = stagger / 1000
  const durationS = duration / 1000

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
        opacity: 0,
        rotateX: -90,
      },
      visible: {
        scale: 1,
        opacity: 1,
        rotateX: 0,
        transition: {
          duration: prefersReducedMotion === true ? 0 : durationS,
          ease: [0.25, 0.46, 0.45, 0.94] as const,
        },
      },
    }),
    [durationS, prefersReducedMotion]
  )

  const hoverAnimation =
    prefersReducedMotion === true
      ? undefined
      : {
          scale: 1.1,
          y: -12,
          rotateY: tiltIntensity,
          rotateX: tiltIntensity,
          transition: {
            type: 'spring' as const,
            stiffness: 300,
            damping: 20,
          },
        }

  const tapAnimation =
    prefersReducedMotion === true
      ? undefined
      : {
          scale: 0.95,
          transition: {
            type: 'spring' as const,
            stiffness: 400,
            damping: 25,
          },
        }

  return (
    <m.div
      className="pf-magnetic-hover"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      data-animation-id="modal-orchestration__magnetic-hover"
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)`, animation: 'none' }}
    >
      {renderItems.map((child, i) => (
        <m.div
          key={i}
          className="pf-magnetic-hover__item"
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

export const ModalOrchestrationMagneticHover = memo(ModalOrchestrationMagneticHoverComponent)
