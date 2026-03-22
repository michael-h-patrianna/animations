/**
 * Stagger entrance with scale bounce and gradient highlight background.
 *
 * Copy-paste files: this file + ModalOrchestrationGridHighlight.css
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
import { memo, useMemo } from 'react'
import type { ReactNode } from 'react'

const DEFAULT_COUNT = 5
const DEFAULT_DISTANCE = 16

interface ModalOrchestrationGridHighlightProps {
  /** Items to stagger in with highlight. When omitted, renders placeholder items. */
  children?: ReactNode
  /** Delay between each item's entrance in ms. Default 260. */
  stagger?: number
  /** Duration of each item's entrance animation in ms. Default 210. */
  duration?: number
  /** Vertical travel distance in px. Default 16. */
  distance?: number
  /** Number of grid columns. Default 2. */
  columns?: number
  /** Start color of the gradient highlight. Default uses theme variable. */
  highlightColor?: string
  /** End color of the gradient highlight. Default uses theme variable. */
  highlightAccent?: string
}

function generatePlaceholders(count: number): ReactNode[] {
  return Array.from({ length: count }, (_, i) => (
    <div key={`placeholder-${i}`}>
      <strong>Item {i + 1}</strong>
      <br />
      Highlight sweep
    </div>
  ))
}

function ModalOrchestrationGridHighlightComponent({
  children,
  stagger = 260,
  duration = 210,
  distance = DEFAULT_DISTANCE,
  columns = 2,
  highlightColor,
  highlightAccent,
}: ModalOrchestrationGridHighlightProps) {
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
        scale: 0.9,
      },
      visible: {
        y: 0,
        opacity: 1,
        scale: [0.9, 1.05, 1],
        transition: {
          duration: prefersReducedMotion === true ? 0 : durationS,
          ease: [0.25, 0.46, 0.45, 0.94] as const,
        },
      },
    }),
    [safeDistance, durationS, prefersReducedMotion]
  )

  const itemStyle = useMemo(() => {
    const style: Record<string, string> = { animation: 'none' }
    if (highlightColor !== undefined) {
      style['--pf-grid-highlight-start'] = highlightColor
    }
    if (highlightAccent !== undefined) {
      style['--pf-grid-highlight-end'] = highlightAccent
    }
    return style
  }, [highlightColor, highlightAccent])

  return (
    <m.div
      className="pf-grid-highlight"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      data-animation-id="modal-orchestration__grid-highlight"
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)`, animation: 'none' }}
    >
      {renderItems.map((child, i) => (
        <m.div
          key={i}
          className="pf-grid-highlight__item"
          variants={itemVariants}
          style={itemStyle}
        >
          {child}
        </m.div>
      ))}
    </m.div>
  )
}

export const ModalOrchestrationGridHighlight = memo(ModalOrchestrationGridHighlightComponent)
