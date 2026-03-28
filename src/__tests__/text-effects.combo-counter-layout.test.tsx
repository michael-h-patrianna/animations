import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { TextEffectsComboCounter as CssComboCounter } from '@/components/base/text-effects/css/TextEffectsComboCounter'
import cssComboStyles from '@/components/base/text-effects/css/TextEffectsComboCounter.module.css'
import { TextEffectsComboCounter as FramerComboCounter } from '@/components/base/text-effects/framer/TextEffectsComboCounter'
import fmComboStyles from '@/components/base/text-effects/framer/TextEffectsComboCounter.module.css'

const cs = (cls: string) => `.${cssComboStyles[cls]}`
const fs = (cls: string) => `.${fmComboStyles[cls]}`

describe('TextEffectsComboCounter layout', () => {
  it('anchors the CSS variant number absolutely so it can grow left', () => {
    const { container } = render(<CssComboCounter from={7} to={1000} />)
    const numberWrapper = container.querySelector(cs('tfx-combo-number-wrapper'))
    const numberContainer = container.querySelector(cs('tfx-combo-number-container'))
    const digit = container.querySelector(cs('tfx-combo-digit'))
    const hitMarker = container.querySelector(cs('tfx-combo-hit-marker'))

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
    const numberWrapper = container.querySelector(fs('pf-combo-fm__number-wrapper'))
    const numberContainer = container.querySelector(fs('pf-combo-fm__number-container'))
    const digit = container.querySelector(fs('pf-combo-fm__digit'))
    const hitMarker = container.querySelector(fs('pf-combo-fm__hit-marker'))

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
