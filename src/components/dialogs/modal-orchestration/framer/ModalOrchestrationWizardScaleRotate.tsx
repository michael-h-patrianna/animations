/**
 * Two-layer stagger entrance: pop-scale step indicators + rotate-morph content panels.
 *
 * Copy-paste files: this file + ModalOrchestrationWizardScaleRotate.css
 * Runtime deps: react, motion
 *
 * @example
 * <ModalOrchestrationWizardScaleRotate stepLabels={['Setup', 'Configure', 'Launch']} activeStep={0}>
 *   <SetupPanel />
 *   <ConfigPanel />
 *   <LaunchPanel />
 * </ModalOrchestrationWizardScaleRotate>
 */

import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import { memo, useMemo } from 'react'
import type { ReactNode } from 'react'
import { DemoCard } from '@/components/demo-blocks'

const DEFAULT_COUNT = 3

interface ModalOrchestrationWizardScaleRotateProps {
  /** Panel content to stagger in. When omitted, renders placeholder panels. */
  children?: ReactNode
  /** Labels for step indicators. Default generates "Step 1", "Step 2", etc. */
  stepLabels?: string[]
  /** Index of the highlighted step/panel (0-based). Default 0. */
  activeStep?: number
  /** Delay between each element's entrance in ms. Default 260. */
  stagger?: number
  /** Duration of each panel's entrance animation in ms. Default 312. */
  duration?: number
}

function generatePlaceholders(count: number): ReactNode[] {
  return Array.from({ length: count }, (_, i) => (
    <DemoCard key={`placeholder-${i}`} title={`Stage ${i + 1}`}>
        <p></p>
      </DemoCard>
  ))
}

function ModalOrchestrationWizardScaleRotateComponent({
  children,
  stepLabels,
  activeStep = 0,
  stagger = 260,
  duration = 312,
}: ModalOrchestrationWizardScaleRotateProps) {
  const prefersReducedMotion = useReducedMotion()

  const items = children !== undefined ? (Array.isArray(children) ? children : [children]) : []
  const renderItems = items.length > 0 ? items : generatePlaceholders(DEFAULT_COUNT)
  const count = renderItems.length
  const labels =
    stepLabels !== undefined && stepLabels.length > 0
      ? stepLabels
      : Array.from({ length: count }, (_, i) => `Step ${i + 1}`)

  const staggerS = stagger / 1000
  const durationS = duration / 1000

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

  const stepVariants = useMemo(
    () => ({
      hidden: {
        scale: 0.9,
        opacity: 0.3,
      },
      visible: {
        scale: [0.9, 1.06, 1],
        opacity: [0.3, 1, 1],
        transition: {
          duration: prefersReducedMotion === true ? 0 : 0.46,
          ease: [0.34, 1.56, 0.64, 1] as const,
        },
      },
    }),
    [prefersReducedMotion]
  )

  const panelVariants = useMemo(
    () => ({
      hidden: {
        rotate: -6,
        scale: 0.82,
        opacity: 0,
      },
      visible: {
        rotate: 0,
        scale: 1,
        opacity: 1,
        transition: {
          duration: prefersReducedMotion === true ? 0 : durationS,
          ease: [0.68, -0.55, 0.265, 1.55] as const,
        },
      },
    }),
    [durationS, prefersReducedMotion]
  )

  return (
    <m.div
      className="pf-wizard-scale"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      data-animation-id="modal-orchestration__wizard-scale-rotate"
      style={{ animation: 'none' }}
    >
      <div className="pf-wizard-scale__steps">
        {labels.map((label, i) => (
          <m.div
            key={i}
            className={`pf-wizard-scale__step${i === activeStep ? ' pf-wizard-scale__step--active' : ''}`}
            variants={stepVariants}
            style={{ animation: 'none' }}
          >
            {label}
          </m.div>
        ))}
      </div>

      <div className="pf-wizard-scale__panels">
        {renderItems.map((child, i) => (
          <m.div
            key={i}
            className={`pf-wizard-scale__panel${i === activeStep ? ' pf-wizard-scale__panel--active' : ''}`}
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

export const ModalOrchestrationWizardScaleRotate = memo(
  ModalOrchestrationWizardScaleRotateComponent
)
