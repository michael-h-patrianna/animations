import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ModalOrchestrationTabMorph as CssTabMorph } from '@/components/dialogs/modal-orchestration/css/ModalOrchestrationTabMorph'
import { ModalOrchestrationTabMorph as FramerTabMorph } from '@/components/dialogs/modal-orchestration/framer/ModalOrchestrationTabMorph'

describe('modal-orchestration tab-morph direction', () => {
  describe('CSS variant', () => {
    it('uses left-exit animation when moving to a higher tab index', () => {
      const { container } = render(<CssTabMorph />)

      fireEvent.click(screen.getByText('Tab 2'))

      const panel = container.querySelector('.pf-tab-morph__panel')
      expect(panel).toHaveClass('pf-tab-morph__panel--exit-left')
      expect(panel).not.toHaveClass('pf-tab-morph__panel--exit-right')
    })

    it('uses right-exit animation when moving to a lower tab index', () => {
      const { container } = render(<CssTabMorph />)

      fireEvent.click(screen.getByText('Tab 3'))
      fireEvent.click(screen.getByText('Tab 1'))

      const panel = container.querySelector('.pf-tab-morph__panel')
      expect(panel).toHaveClass('pf-tab-morph__panel--exit-right')
      expect(panel).not.toHaveClass('pf-tab-morph__panel--exit-left')
    })

    it('sets data-animation-id', () => {
      const { container } = render(<CssTabMorph />)
      expect(
        container.querySelector('[data-animation-id="modal-orchestration__tab-morph"]')
      ).toBeInTheDocument()
    })
  })

  describe('Framer variant', () => {
    it('sets data-animation-id matching CSS variant', () => {
      const { container } = render(<FramerTabMorph />)
      expect(
        container.querySelector('[data-animation-id="modal-orchestration__tab-morph"]')
      ).toBeInTheDocument()
    })

    it('renders tab buttons and responds to clicks', () => {
      render(<FramerTabMorph />)

      // Should render multiple tab buttons
      const tab1 = screen.getByText('Tab 1')
      const tab2 = screen.getByText('Tab 2')
      expect(tab1).toBeInTheDocument()
      expect(tab2).toBeInTheDocument()

      // Clicking tab 2 should not throw
      fireEvent.click(tab2)
      // Tab 2 content heading should be visible
      expect(screen.getByText('Content 2')).toHaveTextContent('Content 2')
    })
  })
})
