import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { TileAnimationsTabMorph as CssTabMorph } from '@/components/dialogs/tile-animations/css/TileAnimationsTabMorph'
import cssTabMorphStyles from '@/components/dialogs/tile-animations/css/TileAnimationsTabMorph.module.css'
import { TileAnimationsTabMorph as FramerTabMorph } from '@/components/dialogs/tile-animations/framer/TileAnimationsTabMorph'
import fmTabMorphStyles from '@/components/dialogs/tile-animations/framer/TileAnimationsTabMorph.module.css'

describe('tile-animations tab-morph direction', () => {
  describe('CSS variant', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('uses left-exit animation when moving to a higher tab index', () => {
      const { container } = render(<CssTabMorph />)

      fireEvent.click(screen.getByTestId('tab-morph-tab-1'))

      const panel = container.querySelector(`.${cssTabMorphStyles['pf-tab-morph__panel']}`)
      expect(panel).toHaveClass(cssTabMorphStyles['pf-tab-morph__panel--exit-left'])
      expect(panel).not.toHaveClass(cssTabMorphStyles['pf-tab-morph__panel--exit-right'])
    })

    it('uses right-exit animation when moving to a lower tab index', () => {
      const { container } = render(<CssTabMorph />)

      // Move to tab 2 and wait for the exit + enter transition to complete
      fireEvent.click(screen.getByTestId('tab-morph-tab-2'))
      act(() => {
        vi.advanceTimersByTime(250)
      })

      // Now move back to tab 0 — should show right-exit
      fireEvent.click(screen.getByTestId('tab-morph-tab-0'))

      const panel = container.querySelector(`.${cssTabMorphStyles['pf-tab-morph__panel']}`)
      expect(panel).toHaveClass(cssTabMorphStyles['pf-tab-morph__panel--exit-right'])
      expect(panel).not.toHaveClass(cssTabMorphStyles['pf-tab-morph__panel--exit-left'])
    })

    it('shows old content during exit, new content after enter', () => {
      const { container } = render(<CssTabMorph />)

      const panel = container.querySelector(`.${cssTabMorphStyles['pf-tab-morph__panel']}`)

      // Initial content is "Content 1" (first placeholder)
      expect(panel).toHaveTextContent('Content 1')

      // Click tab 2 — during exit, old content (Content 1) should still be visible
      fireEvent.click(screen.getByTestId('tab-morph-tab-1'))
      expect(panel).toHaveTextContent('Content 1')

      // After exit completes, new content (Content 2) should render
      act(() => {
        vi.advanceTimersByTime(250)
      })
      expect(panel).toHaveTextContent('Content 2')
    })

    it('sets data-animation-id', () => {
      const { container } = render(<CssTabMorph />)
      expect(
        container.querySelector('[data-animation-id="tile-animations__tab-morph"]')
      ).toBeInTheDocument()
    })
  })

  describe('Framer variant', () => {
    it('sets data-animation-id matching CSS variant', () => {
      const { container } = render(<FramerTabMorph />)
      expect(
        container.querySelector('[data-animation-id="tile-animations__tab-morph"]')
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
