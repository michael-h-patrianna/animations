/**
 * Rotate-scale morph entrance for side-by-side comparison panes.
 *
 * Copy-paste files: this file + ModalOrchestrationComparisonMorph.css
 * Runtime deps: react, motion
 *
 * @example
 * <ModalOrchestrationComparisonMorph stagger={260}>
 *   <PricingPlanA>...</PricingPlanA>
 *   <PricingPlanB>...</PricingPlanB>
 * </ModalOrchestrationComparisonMorph>
 */

import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import { memo } from 'react'
import type { ReactNode } from 'react'
import { DemoCard } from '@/components/demo-blocks'

const DEFAULT_COUNT = 2

interface ModalOrchestrationComparisonMorphProps {
  /** Comparison panes (typically 2). When omitted, renders placeholder panes. */
  children?: ReactNode
  /** Delay between each pane's entrance in ms. Default 260. */
  stagger?: number
  /** Duration of each pane's entrance animation in ms. Default 312. */
  duration?: number
}

function generatePlaceholders(count: number): ReactNode[] {
  const labels = ['Option A', 'Option B', 'Option C', 'Option D']
  return Array.from({ length: count }, (_, i) => (
    <DemoCard key={`placeholder-${i}`} title={labels[i] ?? `Option ${i + 1}`}>
      <p>Comparison pane {i + 1} with details and benefits.</p>
    </DemoCard>
  ))
}

function ModalOrchestrationComparisonMorphComponent({
  children,
  stagger = 260,
  duration = 312,
}: ModalOrchestrationComparisonMorphProps) {
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

  const paneVariants = {
    hidden: { rotate: -6, scale: 0.82, opacity: 0 },
    visible: {
      rotate: 0,
      scale: 1,
      opacity: 1,
      transition: {
        duration: noMotion ? 0.15 : durationS,
        ease: [0.68, -0.55, 0.265, 1.55] as const,
      },
    },
  }

  return (
    <m.div
      className="pf-comparison-morph"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      data-animation-id="modal-orchestration__comparison-morph"
      style={{ animation: 'none' }}
    >
      {renderItems.map((child, i) => (
        <m.div
          key={i}
          className="pf-comparison-morph__pane"
          variants={paneVariants}
          style={{ animation: 'none' }}
        >
          {child}
        </m.div>
      ))}
    </m.div>
  )
}

export const ModalOrchestrationComparisonMorph = memo(ModalOrchestrationComparisonMorphComponent)
