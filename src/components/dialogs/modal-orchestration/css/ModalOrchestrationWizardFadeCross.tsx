/**
 * Sequential fade-up stagger entrance for a list of panels — CSS variant.
 *
 * Copy-paste files: this file + ModalOrchestrationWizardFadeCross.css
 * Runtime deps: react
 *
 * @example
 * <ModalOrchestrationWizardFadeCross stagger={260}>
 *   <StepPanel>...</StepPanel>
 *   <StepPanel>...</StepPanel>
 * </ModalOrchestrationWizardFadeCross>
 */

import { memo, useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import './ModalOrchestrationWizardFadeCross.css'

const DEFAULT_COUNT = 3

interface ModalOrchestrationWizardFadeCrossProps {
  /** Panels to stagger in. When omitted, renders placeholder panels. */
  children?: ReactNode
  /** Delay between each panel's entrance in ms. Default 260. */
  stagger?: number
  /** Duration of each panel's entrance animation in ms. Default 260. */
  duration?: number
  /** Vertical travel distance in px. Default 16. */
  distance?: number
}

function generatePlaceholders(count: number): ReactNode[] {
  return Array.from({ length: count }, (_, i) => (
    <div key={`placeholder-${i}`}>
      <h5>Stage {i + 1}</h5>
      <p>Panel content {i + 1}</p>
    </div>
  ))
}

function ModalOrchestrationWizardFadeCrossComponent({
  children,
  stagger = 260,
  duration = 260,
  distance = 16,
}: ModalOrchestrationWizardFadeCrossProps) {
  const panelsRef = useRef<(HTMLDivElement | null)[]>([])

  const items = children !== undefined ? (Array.isArray(children) ? children : [children]) : []
  const renderItems = items.length > 0 ? items : generatePlaceholders(DEFAULT_COUNT)

  useEffect(() => {
    panelsRef.current.filter(Boolean).forEach((el, index) => {
      if (el !== null) {
        el.style.animationDelay = `${(index * stagger) / 1000}s`
        el.style.animationDuration = `${duration / 1000}s`
        el.style.setProperty('--pf-fade-distance', `${distance}px`)
        el.classList.add('pf-wizard-fade__panel--visible')
      }
    })
  }, [stagger, duration, distance])

  return (
    <div
      className="pf-wizard-fade"
      data-animation-id="modal-orchestration__wizard-fade-cross"
    >
      <div className="pf-wizard-fade__panels">
        {renderItems.map((child, i) => (
          <div
            key={i}
            ref={(el) => {
              panelsRef.current[i] = el
            }}
            className="pf-wizard-fade__panel"
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  )
}

export const ModalOrchestrationWizardFadeCross = memo(ModalOrchestrationWizardFadeCrossComponent)
