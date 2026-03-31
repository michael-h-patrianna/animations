/**
 * 3D-tilt stagger entrance with perspective hover and tap gestures.
 *
 * Copy-paste files: this file + TileAnimationsMagneticHover.module.css
 * Runtime deps: react, motion
 *
 * @example
 * <TileAnimationsMagneticHover stagger={100} tiltIntensity={5} columns={4}>
 *   <FeatureCard>...</FeatureCard>
 *   <FeatureCard>...</FeatureCard>
 * </TileAnimationsMagneticHover>
 */

import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import { memo } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { DemoCard } from '@/components/demo-blocks'
import styles from './TileAnimationsMagneticHover.module.css'

const DEFAULT_COUNT = 6

interface TileAnimationsMagneticHoverProps {
  /** Items to stagger in with 3D tilt. When omitted, renders placeholder tiles. */
  children?: ReactNode
  /** Delay between each item's entrance in ms. Default 100. */
  stagger?: number
  /** Duration of each item's entrance animation in ms. Default 600. */
  duration?: number
  /** Hover tilt intensity in degrees. Default 5. */
  tiltIntensity?: number
  /** Maximum number of grid columns before tiles wrap. Default 4. */
  columns?: number
  /** Minimum width for each tile before the grid wraps to fewer columns. Default 96. */
  minTileWidth?: number
}

function generatePlaceholders(count: number): ReactNode[] {
  return Array.from({ length: count }, (_, i) => (
    <DemoCard key={`placeholder-${i}`} title={`Hover ${i + 1}`}>
      <p>Magnetic tilt</p>
    </DemoCard>
  ))
}

function TileAnimationsMagneticHoverComponent({
  children,
  stagger = 100,
  duration = 600,
  tiltIntensity = 5,
  columns = 4,
  minTileWidth = 96,
}: TileAnimationsMagneticHoverProps) {
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
    hidden: { scale: 0, opacity: 0, rotateX: -90 },
    visible: {
      scale: 1,
      opacity: 1,
      rotateX: 0,
      transition: {
        duration: noMotion ? 0.15 : durationS,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    },
  }

  const hoverAnimation = noMotion
    ? undefined
    : {
        scale: 1.1,
        y: -12,
        rotateY: tiltIntensity,
        rotateX: tiltIntensity,
        transition: { type: 'spring' as const, stiffness: 300, damping: 20 },
      }

  const tapAnimation = noMotion
    ? undefined
    : {
        scale: 0.95,
        transition: { type: 'spring' as const, stiffness: 400, damping: 25 },
      }

  return (
    <m.div
      className={styles['pf-magnetic-hover-fm']}
      data-testid="magnetic-hover"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      data-animation-id="tile-animations__magnetic-hover"
      style={
        {
          ['--pf-magnetic-hover-columns' as string]: `${columns}`,
          ['--pf-magnetic-hover-min-tile-width' as string]: `${minTileWidth}px`,
        } as CSSProperties
      }
    >
      {renderItems.map((child, i) => (
        <m.div
          key={i}
          className={styles['pf-magnetic-hover-fm__item']}
          data-testid="magnetic-item"
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

export const TileAnimationsMagneticHover = memo(TileAnimationsMagneticHoverComponent)
