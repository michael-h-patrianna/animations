import { render } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { ModalOrchestrationStaggerInview } from '@/components/dialogs/modal-orchestration/css/ModalOrchestrationStaggerInview'

describe('modal-orchestration stagger-inview IntersectionObserver fallback', () => {
  const originalIntersectionObserver = globalThis.IntersectionObserver

  beforeEach(() => {
    Object.defineProperty(globalThis, 'IntersectionObserver', {
      configurable: true,
      value: undefined,
      writable: true,
    })
  })

  afterEach(() => {
    Object.defineProperty(globalThis, 'IntersectionObserver', {
      configurable: true,
      value: originalIntersectionObserver,
      writable: true,
    })
  })

  it('renders without crashing when IntersectionObserver is unavailable', () => {
    const { container } = render(<ModalOrchestrationStaggerInview />)

    expect(
      container.querySelector('[data-animation-id="modal-orchestration__stagger-inview"]')
    ).toBeInTheDocument()
    expect(container.querySelectorAll('.pf-stagger-tile')).toHaveLength(12)
  })
})
