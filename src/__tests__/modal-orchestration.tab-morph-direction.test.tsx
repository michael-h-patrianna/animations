import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ModalOrchestrationTabMorph as CssTabMorph } from '@/components/dialogs/modal-orchestration/css/ModalOrchestrationTabMorph'
import cssTabMorphStyles from '@/components/dialogs/modal-orchestration/css/ModalOrchestrationTabMorph.module.css'
import { ModalOrchestrationTabMorph as FramerTabMorph } from '@/components/dialogs/modal-orchestration/framer/ModalOrchestrationTabMorph'
import fmTabMorphStyles from '@/components/dialogs/modal-orchestration/framer/ModalOrchestrationTabMorph.module.css'

describe('modal-orchestration tab-morph direction', () => {
  describe('CSS variant', () => {
    it('uses left-exit animation when moving to a higher tab index', () => {
      const { container } = render(<CssTabMorph />)

      fireEvent.click(screen.getByTestId('tab-morph-tab-1'))

      const panel = container.querySelector(`.${cssTabMorphStyles['pf-tab-morph__panel']}`)
      expect(panel).toHaveClass(cssTabMorphStyles['pf-tab-morph__panel--exit-left'])
      expect(panel).not.toHaveClass(cssTabMorphStyles['pf-tab-morph__panel--exit-right'])
    })

    it('uses right-exit animation when moving to a lower tab index', () => {
      const { container } = render(<CssTabMorph />)

      fireEvent.click(screen.getByTestId('tab-morph-tab-2'))
      fireEvent.click(screen.getByTestId('tab-morph-tab-0'))

      const panel = container.querySelector(`.${cssTabMorphStyles['pf-tab-morph__panel']}`)
      expect(panel).toHaveClass(cssTabMorphStyles['pf-tab-morph__panel--exit-right'])
      expect(panel).not.toHaveClass(cssTabMorphStyles['pf-tab-morph__panel--exit-left'])
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
      const tab0 = screen.getByTestId('tab-morph-tab-0')
      const tab1 = screen.getByTestId('tab-morph-tab-1')
      expect(tab0).toHaveTextContent('Tab 1')
      expect(tab1).toHaveTextContent('Tab 2')

      // Clicking tab 2 should not throw
      fireEvent.click(tab1)
      // Tab 2 should now be active
      expect(screen.getByTestId('tab-morph-tab-1')).toHaveClass(
        fmTabMorphStyles['pf-tab-morph-fm__tab--active']
      )
    })
  })
})
