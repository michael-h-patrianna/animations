import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ModalOrchestrationTabMorph } from '@/components/dialogs/modal-orchestration/css/ModalOrchestrationTabMorph'

describe('modal-orchestration tab-morph direction', () => {
  it('uses left-exit animation when moving to a higher tab index', () => {
    const { container } = render(<ModalOrchestrationTabMorph />)

    fireEvent.click(screen.getByText('Tab 2'))

    const panel = container.querySelector('.pf-tabs__panel')
    expect(panel).toHaveClass('pf-tabs__panel--exit-left')
    expect(panel).not.toHaveClass('pf-tabs__panel--exit-right')
  })
})
