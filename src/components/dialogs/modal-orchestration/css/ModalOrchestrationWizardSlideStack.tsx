/**
 * Sequential slide-from-right stagger entrance for a list of panels — CSS variant.
 *
 * Copy-paste files: this file + ModalOrchestrationWizardSlideStack.css
 * Runtime deps: react
 *
 * @example
 * <ModalOrchestrationWizardSlideStack stagger={260}>
 *   <StepPanel>...</StepPanel>
 *   <StepPanel>...</StepPanel>
 * </ModalOrchestrationWizardSlideStack>
 */

import { Children, memo, useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import './ModalOrchestrationWizardSlideStack.css'

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
    <div key={`placeholder-${i}`}>
      <h5>Stage {i + 1}</h5>
      <p>Panel content {i + 1}</p>
    </div>
  ))
}

function ModalOrchestrationWizardSlideStackComponent({
  children,
  stagger = 260,
  duration = 312,
  distance = 48,
}: ModalOrchestrationWizardSlideStackProps) {
  const panelsRef = useRef<(HTMLDivElement | null)[]>([])

  const items = Children.toArray(children)
  const renderItems = items.length > 0 ? items : generatePlaceholders(DEFAULT_COUNT)

  useEffect(() => {
    panelsRef.current.filter(Boolean).forEach((el, index) => {
      if (el !== null) {
        el.style.animationDelay = `${(index * stagger) / 1000}s`
        el.style.animationDuration = `${duration / 1000}s`
        el.style.setProperty('--pf-slide-distance', `${distance}px`)
        el.classList.add('pf-wizard-slide__panel--visible')
      }
    })
  }, [stagger, duration, distance])

  return (
    <div
      className="pf-wizard-slide"
      data-animation-id="modal-orchestration__wizard-slide-stack"
    >
      <div className="pf-wizard-slide__panels">
        {renderItems.map((child, i) => (
          <div
            key={i}
            ref={(el) => {
              panelsRef.current[i] = el
            }}
            className="pf-wizard-slide__panel"
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  )
}

export const ModalOrchestrationWizardSlideStack = memo(ModalOrchestrationWizardSlideStackComponent)
