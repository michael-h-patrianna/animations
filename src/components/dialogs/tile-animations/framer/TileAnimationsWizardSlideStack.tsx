/**
 * Sequential slide-from-right stagger entrance for a list of panels.
 *
 * Copy-paste files: this file + TileAnimationsWizardSlideStack.module.css
 * Runtime deps: react, motion
 *
 * @example
 * <TileAnimationsWizardSlideStack stagger={260}>
 *   <StepPanel>...</StepPanel>
 *   <StepPanel>...</StepPanel>
 * </TileAnimationsWizardSlideStack>
 */

import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import { memo } from 'react'
import type { ReactNode } from 'react'
import { DemoCard } from '@/components/demo-blocks'
import styles from './TileAnimationsWizardSlideStack.module.css'

const DEFAULT_COUNT = 3

interface TileAnimationsWizardSlideStackProps {
  /** Panels to stagger in. When omitted, renders placeholder panels. */
  children?: ReactNode
  /** Delay between each panel's entrance in ms. Default 260. */
  stagger?: number
  /** Duration of each panel's entrance animation in ms. Default 312. */
  duration?: number
  /** Horizontal slide distance in px. Default 48. */
  distance?: number
}

function generatePlaceholders(count: number): ReactNode[] {
  return Array.from({ length: count }, (_, i) => (
    <DemoCard key={`placeholder-${i}`} title={`Stage ${i + 1}`} />
  ))
}

function TileAnimationsWizardSlideStackComponent({
  children,
  stagger = 260,
  duration = 312,
  distance = 48,
}: TileAnimationsWizardSlideStackProps) {
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

  const panelVariants = {
    hidden: { x: noMotion ? 0 : distance, scale: 0.94, opacity: 0 },
    visible: {
      x: 0,
      scale: 1,
      opacity: 1,
      transition: {
        duration: noMotion ? 0.15 : durationS,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    },
  }

  return (
    <m.div
      className={styles['pf-wizard-slide-fm']}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      data-animation-id="tile-animations__wizard-slide-stack"
    >
      <div className={styles['pf-wizard-slide-fm__panels']}>
        {renderItems.map((child, i) => (
          <m.div key={i} className={styles['pf-wizard-slide-fm__panel']} variants={panelVariants}>
            {child}
          </m.div>
        ))}
      </div>
    </m.div>
  )
}

export const TileAnimationsWizardSlideStack = memo(TileAnimationsWizardSlideStackComponent)
