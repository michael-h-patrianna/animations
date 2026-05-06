/**
 * Reduced-motion note: catalog-only data-reduced-motion mirroring supplements
 * OS @media (prefers-reduced-motion) rules; consumers do not need to copy it.
 * Spring-physics stagger entrance with CSS hover-lift and tap-press transitions — CSS variant.
 *
 * Copy-paste files: this file + TileAnimationsSpringPhysics.module.css
 * Runtime deps: react
 *
 * @example
 * <TileAnimationsSpringPhysics stagger={100} columns={3}>
 *   <ProductCard>...</ProductCard>
 *   <ProductCard>...</ProductCard>
 * </TileAnimationsSpringPhysics>
 */

import { memo, useCallback } from 'react'
import type { ReactNode } from 'react'
import styles from './TileAnimationsSpringPhysics.module.css'
import { DemoCard } from '@/components/demo-blocks'

const DEFAULT_COUNT = 6

interface TileAnimationsSpringPhysicsProps {
  /** Items to bounce in. When omitted, renders placeholder tiles. */
  children?: ReactNode
  /** Delay between each item's entrance in ms. Default 100. */
  stagger?: number
  /** Duration of each item's entrance animation in ms. Default 800. */
  duration?: number
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

function TileAnimationsSpringPhysicsComponent({
  children,
  stagger = 100,
  duration = 800,
  columns = 3,
}: TileAnimationsSpringPhysicsProps) {
  const items = children !== undefined ? (Array.isArray(children) ? children : [children]) : []
  const renderItems = items.length > 0 ? items : generatePlaceholders(DEFAULT_COUNT)

  const handleAnimationEnd = useCallback((e: React.AnimationEvent<HTMLDivElement>) => {
    const el = e.currentTarget
    const visibleClass = styles['pf-spring-physics__item--visible']
    if (visibleClass && el.classList.contains(visibleClass)) {
      el.classList.remove(visibleClass)
      el.classList.add(styles['pf-spring-physics__item--landed'] ?? '')
    }
  }, [])

  return (
    <div
      className={styles['pf-spring-physics']}
      data-animation-id="tile-animations__spring-physics"
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
    >
      {renderItems.map((child, i) => (
        <div
          key={i}
          className={`${styles['pf-spring-physics__item']} ${styles['pf-spring-physics__item--visible']}`}
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

export const TileAnimationsSpringPhysics = memo(TileAnimationsSpringPhysicsComponent)
