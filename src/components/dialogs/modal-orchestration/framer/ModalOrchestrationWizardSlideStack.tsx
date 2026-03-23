/**
 * Sequential slide-from-right stagger entrance for a list of panels.
 *
 * Copy-paste files: this file + ModalOrchestrationWizardSlideStack.css
 * Runtime deps: react, motion
 *
 * @example
 * <ModalOrchestrationWizardSlideStack stagger={260}>
 *   <StepPanel>...</StepPanel>
 *   <StepPanel>...</StepPanel>
 * </ModalOrchestrationWizardSlideStack>
 */

import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import { memo, useMemo } from 'react'
import type { ReactNode } from 'react'
import { DemoCard } from '@/components/demo-blocks'

const DEFAULT_COUNT = 3

interface ModalOrchestrationWizardSlideStackProps {
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
    <DemoCard key={`placeholder-${i}`} title={`Stage ${i + 1}`}>
        <p></p>
      </DemoCard>
  ))
}

function ModalOrchestrationWizardSlideStackComponent({
  children,
  stagger = 260,
  duration = 312,
  distance = 48,
}: ModalOrchestrationWizardSlideStackProps) {
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

  const panelVariants = useMemo(
    () => ({
      hidden: {
        x: safeDistance,
        scale: 0.94,
        opacity: 0,
      },
      visible: {
        x: 0,
        scale: 1,
        opacity: 1,
        transition: {
          duration: prefersReducedMotion === true ? 0 : durationS,
          ease: [0.25, 0.46, 0.45, 0.94] as const,
        },
      },
    }),
    [safeDistance, durationS, prefersReducedMotion]
  )

  return (
    <m.div
      className="pf-wizard-slide"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      data-animation-id="modal-orchestration__wizard-slide-stack"
      style={{ animation: 'none' }}
    >
      <div className="pf-wizard-slide__panels">
        {renderItems.map((child, i) => (
          <m.div
            key={i}
            className="pf-wizard-slide__panel"
            variants={panelVariants}
            style={{ animation: 'none' }}
          >
            {child}
          </m.div>
        ))}
      </div>
    </m.div>
  )
}

export const ModalOrchestrationWizardSlideStack = memo(ModalOrchestrationWizardSlideStackComponent)
