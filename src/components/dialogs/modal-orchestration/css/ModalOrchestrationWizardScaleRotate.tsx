/**
 * Two-layer stagger entrance: pop-scale step indicators + rotate-morph content panels — CSS variant.
 *
 * Copy-paste files: this file + ModalOrchestrationWizardScaleRotate.css
 * Runtime deps: react
 *
 * @example
 * <ModalOrchestrationWizardScaleRotate stepLabels={['Setup', 'Configure', 'Launch']} activeStep={0}>
 *   <SetupPanel />
 *   <ConfigPanel />
 *   <LaunchPanel />
 * </ModalOrchestrationWizardScaleRotate>
 */

import { memo, useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import './ModalOrchestrationWizardScaleRotate.css'

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
    <div key={`placeholder-${i}`}>
      <h5>Stage {i + 1}</h5>
      <p>Panel content {i + 1}</p>
    </div>
  ))
}

function ModalOrchestrationWizardScaleRotateComponent({
  children,
  stepLabels,
  activeStep = 0,
  stagger = 260,
  duration = 312,
}: ModalOrchestrationWizardScaleRotateProps) {
  const stepsRef = useRef<(HTMLDivElement | null)[]>([])
  const panelsRef = useRef<(HTMLDivElement | null)[]>([])

  const items = children !== undefined ? (Array.isArray(children) ? children : [children]) : []
  const renderItems = items.length > 0 ? items : generatePlaceholders(DEFAULT_COUNT)
  const count = renderItems.length
  const labels =
    stepLabels !== undefined && stepLabels.length > 0
      ? stepLabels
      : Array.from({ length: count }, (_, i) => `Step ${i + 1}`)

  useEffect(() => {
    stepsRef.current.filter(Boolean).forEach((el, index) => {
      if (el !== null) {
        el.style.animationDelay = `${(index * stagger) / 1000}s`
        el.classList.add('pf-wizard-scale__step--visible')
      }
    })

    panelsRef.current.filter(Boolean).forEach((el, index) => {
      if (el !== null) {
        el.style.animationDelay = `${(index * stagger) / 1000}s`
        el.style.animationDuration = `${duration / 1000}s`
        el.classList.add('pf-wizard-scale__panel--visible')
      }
    })
  }, [stagger, duration])

  return (
    <div className="pf-wizard-scale" data-animation-id="modal-orchestration__wizard-scale-rotate">
      <div className="pf-wizard-scale__steps">
        {labels.map((label, i) => (
          <div
            key={i}
            ref={(el) => {
              stepsRef.current[i] = el
            }}
            className={`pf-wizard-scale__step${i === activeStep ? ' pf-wizard-scale__step--active' : ''}`}
          >
            {label}
          </div>
        ))}
      </div>

      <div className="pf-wizard-scale__panels">
        {renderItems.map((child, i) => (
          <div
            key={i}
            ref={(el) => {
              panelsRef.current[i] = el
            }}
            className={`pf-wizard-scale__panel${i === activeStep ? ' pf-wizard-scale__panel--active' : ''}`}
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  )
}

export const ModalOrchestrationWizardScaleRotate = memo(
  ModalOrchestrationWizardScaleRotateComponent
)
