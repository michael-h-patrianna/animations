/**
 * 3D-tilt stagger entrance with CSS hover and tap transitions — CSS variant.
 *
 * Copy-paste files: this file + ModalOrchestrationMagneticHover.css
 * Runtime deps: react
 *
 * @example
 * <ModalOrchestrationMagneticHover stagger={100} columns={4}>
 *   <FeatureCard>...</FeatureCard>
 *   <FeatureCard>...</FeatureCard>
 * </ModalOrchestrationMagneticHover>
 */

import { memo, useCallback } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import styles from './ModalOrchestrationMagneticHover.module.css'
import { DemoCard } from '@/components/demo-blocks'

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

function ModalOrchestrationMagneticHoverComponent({
  children,
  stagger = 100,
  duration = 600,
  tiltIntensity = 5,
  columns = 4,
  minTileWidth = 96,
}: ModalOrchestrationMagneticHoverProps) {
  const items = children !== undefined ? (Array.isArray(children) ? children : [children]) : []
  const renderItems = items.length > 0 ? items : generatePlaceholders(DEFAULT_COUNT)

  const handleAnimationEnd = useCallback((e: React.AnimationEvent<HTMLDivElement>) => {
    const el = e.currentTarget
    const visibleClass = styles['pf-magnetic-hover__item--visible']
    if (visibleClass && el.classList.contains(visibleClass)) {
      el.classList.remove(visibleClass)
      el.classList.add(styles['pf-magnetic-hover__item--landed'] ?? '')
    }
  }, [])

  return (
    <div
      className={styles['pf-magnetic-hover']}
      data-animation-id="modal-orchestration__magnetic-hover"
      style={
        {
          ['--pf-magnetic-hover-columns' as string]: `${columns}`,
          ['--pf-magnetic-hover-min-tile-width' as string]: `${minTileWidth}px`,
          ['--pf-magnetic-hover-tilt' as string]: `${tiltIntensity}deg`,
        } as CSSProperties
      }
    >
      {renderItems.map((child, i) => (
        <div
          key={i}
          className={`${styles['pf-magnetic-hover__item']} ${styles['pf-magnetic-hover__item--visible']}`}
          style={{
            animationDelay: `${(200 + i * stagger) / 1000}s`,
            animationDuration: `${duration / 1000}s`,
          }}
          onAnimationEnd={handleAnimationEnd}
        >
          {child}
        </div>
      ))}
    </div>
  )
}

export const ModalOrchestrationMagneticHover = memo(ModalOrchestrationMagneticHoverComponent)
