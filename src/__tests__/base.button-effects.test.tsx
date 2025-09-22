import { ButtonEffectsRipple } from '@/components/base/button-effects/ButtonEffectsRipple'
import { advanceRaf, queryStage, withAnimationCard } from '@/test/utils/animationTestUtils'
import { act, fireEvent, render, screen } from '@testing-library/react'

describe('Base • Button effects', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })
  afterEach(() => {
    jest.useRealTimers()
  })

  test('Ripple creates ripple at click and cleans up after animation', async () => {
    render(withAnimationCard(<ButtonEffectsRipple />, { id: 'base__button__ripple' }))

    const stage = queryStage()
    expect(stage).toBeTruthy()
    const btn = stage!.querySelector('button.pf-btn--ripple') as HTMLButtonElement
    expect(btn).toBeTruthy()

    // Mock getBoundingClientRect for stable dimensions
    const rect = { left: 100, top: 50, width: 200, height: 60, right: 300, bottom: 110, x: 100, y: 50, toJSON: () => {} }
    jest.spyOn(btn, 'getBoundingClientRect').mockReturnValue(rect as unknown as DOMRect)

    // Click roughly center; ripple should be appended into .pf-btn__ripples
    fireEvent.click(btn, { clientX: 200, clientY: 80 })

    const ripplesHost = stage!.querySelector('.pf-btn__ripples')!
    expect(ripplesHost).toBeTruthy()
    const ripple = ripplesHost.querySelector('.pf-btn__ripple') as HTMLElement
    expect(ripple).toBeTruthy()

    // Styles computed from click position and diameter
    expect(ripple.style.width).not.toBe('')
    expect(ripple.style.height).not.toBe('')
    expect(ripple.style.left).not.toBe('')
    expect(ripple.style.top).not.toBe('')

    // Advance time to let cleanup run (520ms)
    await advanceRaf(600)
    expect(ripplesHost.querySelector('.pf-btn__ripple')).toBeNull()

    // Replay resets/remounts stage
    const prevStage = stage!
    act(() => {
      screen.getByRole('button', { name: /replay/i }).click()
    })
    const newStage = queryStage()
    expect(newStage).toBeTruthy()
    expect(newStage).not.toBe(prevStage)
  })
})
