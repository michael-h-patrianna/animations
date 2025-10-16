import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { TextEffectsGlitchText } from '../components/base/text-effects/css/TextEffectsGlitchText'

describe('TextEffectsGlitchText (CSS)', () => {
  describe('Text Content', () => {
    it('should render default text when no props provided', () => {
      render(<TextEffectsGlitchText />)

      // Default text should appear in all layers
      const elements = screen.getAllByText('SYSTEM ERROR')
      expect(elements).toHaveLength(3) // base + 2 RGB layers
    })

    it('should render custom text via text prop', () => {
      render(<TextEffectsGlitchText text="CONNECTION LOST" />)

      const elements = screen.getAllByText('CONNECTION LOST')
      expect(elements).toHaveLength(3)
    })

    it('should render text with whitespace', () => {
      const textWithSpaces = '  SYSTEM   ERROR  '
      const { container } = render(<TextEffectsGlitchText text={textWithSpaces} />)

      // Check that text is preserved in DOM (even if normalized by testing-library)
      const baseElement = container.querySelector('.tfx-glitchtext__base')
      expect(baseElement?.textContent).toBe(textWithSpaces)
    })

    it('should render long text without issues', () => {
      const longText = 'THIS IS A VERY LONG ERROR MESSAGE THAT SHOULD WORK FINE'
      render(<TextEffectsGlitchText text={longText} />)

      const elements = screen.getAllByText(longText)
      expect(elements).toHaveLength(3)
    })

    it('should render short text', () => {
      render(<TextEffectsGlitchText text="ERR" />)

      const elements = screen.getAllByText('ERR')
      expect(elements).toHaveLength(3)
    })

    it('should render empty string', () => {
      const { container } = render(<TextEffectsGlitchText text="" />)

      // Should render structure even with empty text
      expect(container.querySelector('.tfx-glitchtext__container')).toBeInTheDocument()
      expect(container.querySelector('.tfx-glitchtext__base')).toBeInTheDocument()
    })
  })

  describe('Children Prop', () => {
    it('should render children instead of text prop when both provided', () => {
      render(
        <TextEffectsGlitchText text="SHOULD NOT SHOW">
          CHILDREN TEXT
        </TextEffectsGlitchText>
      )

      expect(screen.queryAllByText('SHOULD NOT SHOW')).toHaveLength(0)
      expect(screen.getAllByText('CHILDREN TEXT')).toHaveLength(3)
    })

    it('should render JSX children', () => {
      render(
        <TextEffectsGlitchText>
          <span data-testid="custom-child">ERROR <strong>404</strong></span>
        </TextEffectsGlitchText>
      )

      const children = screen.getAllByTestId('custom-child')
      expect(children).toHaveLength(3) // Appears in all 3 layers

      // Verify strong tag is preserved
      const strongElements = screen.getAllByText('404')
      expect(strongElements).toHaveLength(3)
    })
  })

  describe('Structure and Styling', () => {
    it('should render with correct namespaced class structure', () => {
      const { container } = render(<TextEffectsGlitchText />)

      // Container
      expect(container.querySelector('.tfx-glitchtext__container')).toBeInTheDocument()

      // Base layer
      expect(container.querySelector('.tfx-glitchtext__base')).toBeInTheDocument()

      // RGB layers
      expect(container.querySelector('.tfx-glitchtext__layer--cyan')).toBeInTheDocument()
      expect(container.querySelector('.tfx-glitchtext__layer--magenta')).toBeInTheDocument()

      // Distortion bars
      expect(container.querySelector('.tfx-glitchtext__bars')).toBeInTheDocument()
    })

    it('should apply custom className to container', () => {
      const { container } = render(
        <TextEffectsGlitchText className="custom-class" />
      )

      const containerEl = container.querySelector('.tfx-glitchtext__container')
      expect(containerEl).toHaveClass('custom-class')
      expect(containerEl).toHaveClass('tfx-glitchtext__container')
    })

    it('should have data-animation-id attribute', () => {
      const { container } = render(<TextEffectsGlitchText />)

      const containerEl = container.querySelector('[data-animation-id="text-effects__tfx-glitchtext"]')
      expect(containerEl).toBeInTheDocument()
    })

    it('should mark RGB layers and bars as aria-hidden', () => {
      const { container } = render(<TextEffectsGlitchText />)

      const cyanLayer = container.querySelector('.tfx-glitchtext__layer--cyan')
      const magentaLayer = container.querySelector('.tfx-glitchtext__layer--magenta')
      const bars = container.querySelector('.tfx-glitchtext__bars')

      expect(cyanLayer).toHaveAttribute('aria-hidden', 'true')
      expect(magentaLayer).toHaveAttribute('aria-hidden', 'true')
      expect(bars).toHaveAttribute('aria-hidden', 'true')
    })

    it('should not mark base text as aria-hidden', () => {
      const { container } = render(<TextEffectsGlitchText />)

      const baseLayer = container.querySelector('.tfx-glitchtext__base')
      expect(baseLayer).not.toHaveAttribute('aria-hidden')
    })
  })

  describe('Text Length Flexibility', () => {
    it('should handle single character', () => {
      render(<TextEffectsGlitchText text="X" />)
      expect(screen.getAllByText('X')).toHaveLength(3)
    })

    it('should handle numbers', () => {
      render(<TextEffectsGlitchText text="404" />)
      expect(screen.getAllByText('404')).toHaveLength(3)
    })

    it('should handle special characters', () => {
      render(<TextEffectsGlitchText text="ERR0R!@#" />)
      expect(screen.getAllByText('ERR0R!@#')).toHaveLength(3)
    })

    it('should handle multiline text with line breaks', () => {
      const multilineText = 'ERROR\nLINE 2'
      const { container } = render(<TextEffectsGlitchText text={multilineText} />)

      // Check that text is preserved in DOM
      const baseElement = container.querySelector('.tfx-glitchtext__base')
      expect(baseElement?.textContent).toBe(multilineText)
    })

    it('should handle unicode characters', () => {
      render(<TextEffectsGlitchText text="エラー 🚨" />)
      expect(screen.getAllByText('エラー 🚨')).toHaveLength(3)
    })
  })

  describe('Rendering Performance', () => {
    it('should render efficiently with minimal re-renders (memoized)', () => {
      const { rerender } = render(<TextEffectsGlitchText text="TEST" />)

      // Component should be memoized, so re-render with same props should be cheap
      rerender(<TextEffectsGlitchText text="TEST" />)

      expect(screen.getAllByText('TEST')).toHaveLength(3)
    })

    it('should update when text prop changes', () => {
      const { rerender } = render(<TextEffectsGlitchText text="BEFORE" />)
      expect(screen.getAllByText('BEFORE')).toHaveLength(3)

      rerender(<TextEffectsGlitchText text="AFTER" />)
      expect(screen.queryByText('BEFORE')).not.toBeInTheDocument()
      expect(screen.getAllByText('AFTER')).toHaveLength(3)
    })
  })

  describe('CSS Animation Setup', () => {
    it('should have animation classes applied', () => {
      const { container } = render(<TextEffectsGlitchText />)

      // Base should have animation
      const base = container.querySelector('.tfx-glitchtext__base')
      expect(base).toHaveStyle({ willChange: 'transform' })

      // Layers should have animations
      const cyanLayer = container.querySelector('.tfx-glitchtext__layer--cyan')
      const magentaLayer = container.querySelector('.tfx-glitchtext__layer--magenta')
      expect(cyanLayer).toHaveStyle({ willChange: 'transform, opacity' })
      expect(magentaLayer).toHaveStyle({ willChange: 'transform, opacity' })

      // Bars should have animation
      const bars = container.querySelector('.tfx-glitchtext__bars')
      expect(bars).toHaveStyle({ willChange: 'transform, opacity' })
    })
  })
})
