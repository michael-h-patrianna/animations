import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { TextEffectsComboCounter as CssComboCounter } from '@/components/base/text-effects/css/TextEffectsComboCounter'
import { TextEffectsComboCounter as FramerComboCounter } from '@/components/base/text-effects/framer/TextEffectsComboCounter'

import '@/components/base/text-effects/framer/TextEffectsComboCounter.css'

describe('TextEffectsComboCounter layout', () => {
  it('anchors the CSS variant number absolutely so it can grow left', () => {
    const { container } = render(<CssComboCounter from={7} to={1000} />)
    const numberWrapper = container.querySelector('.tfx-combo-number-wrapper')
    const numberContainer = container.querySelector('.tfx-combo-number-container')
    const digit = container.querySelector('.tfx-combo-digit')
    const hitMarker = container.querySelector('.tfx-combo-hit-marker')

    expect(numberWrapper).toBeInTheDocument()
    expect(numberContainer).toBeInTheDocument()
    expect(digit).toBeInTheDocument()
    expect(hitMarker).toBeInTheDocument()

    expect(getComputedStyle(numberWrapper as Element).position).toBe('relative')
    expect(getComputedStyle(numberContainer as Element).position).toBe('absolute')
    expect(getComputedStyle(digit as Element).textAlign).toBe('right')
    expect(getComputedStyle(digit as Element).whiteSpace).toBe('nowrap')
    expect(getComputedStyle(digit as Element).fontVariantNumeric).toContain('tabular-nums')
    expect(getComputedStyle(hitMarker as Element).marginLeft).toBe('0px')
  })

  it('anchors the Framer variant number absolutely so it can grow left', () => {
    const { container } = render(<FramerComboCounter from={7} to={1000} />)
    const numberWrapper = container.querySelector('.pf-combo__number-wrapper')
    const numberContainer = container.querySelector('.pf-combo__number-container')
    const digit = container.querySelector('.pf-combo__digit')
    const hitMarker = container.querySelector('.pf-combo__hit-marker')

    expect(numberWrapper).toBeInTheDocument()
    expect(numberContainer).toBeInTheDocument()
    expect(digit).toBeInTheDocument()
    expect(hitMarker).toBeInTheDocument()

    expect(getComputedStyle(numberWrapper as Element).position).toBe('relative')
    expect(getComputedStyle(numberContainer as Element).position).toBe('absolute')
    expect(getComputedStyle(digit as Element).textAlign).toBe('right')
    expect(getComputedStyle(digit as Element).whiteSpace).toBe('nowrap')
    expect(getComputedStyle(digit as Element).fontVariantNumeric).toContain('tabular-nums')
    expect(getComputedStyle(hitMarker as Element).marginLeft).toBe('0px')
  })
})
