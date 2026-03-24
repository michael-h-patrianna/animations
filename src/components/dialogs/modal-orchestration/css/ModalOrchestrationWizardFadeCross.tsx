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

import { memo } from 'react'
import type { ReactNode } from 'react'
import './ModalOrchestrationWizardFadeCross.css'
import { DemoCard } from '@/components/demo-blocks'

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
    <DemoCard key={`placeholder-${i}`} title={`Stage ${i + 1}`} />
  ))
}

function ModalOrchestrationWizardFadeCrossComponent({
  children,
  stagger = 260,
  duration = 260,
  distance = 16,
}: ModalOrchestrationWizardFadeCrossProps) {
  const items = children !== undefined ? (Array.isArray(children) ? children : [children]) : []
  const renderItems = items.length > 0 ? items : generatePlaceholders(DEFAULT_COUNT)

  return (
    <div className="pf-wizard-fade" data-animation-id="modal-orchestration__wizard-fade-cross">
      <div className="pf-wizard-fade__panels">
        {renderItems.map((child, i) => (
          <div
            key={i}
            className="pf-wizard-fade__panel pf-wizard-fade__panel--visible"
            style={
              {
                animationDelay: `${(i * stagger) / 1000}s`,
                animationDuration: `${duration / 1000}s`,
                '--pf-fade-distance': `${distance}px`,
              } as React.CSSProperties
            }
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  )
}

export const ModalOrchestrationWizardFadeCross = memo(ModalOrchestrationWizardFadeCrossComponent)
