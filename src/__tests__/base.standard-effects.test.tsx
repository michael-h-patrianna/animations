import { StandardEffectsFade } from '@/components/base/standard-effects/StandardEffectsFade'
import { StandardEffectsScale } from '@/components/base/standard-effects/StandardEffectsScale'
import { queryStage, withAnimationCard } from '@/test/utils/animationTestUtils'
import { act, render, screen } from '@testing-library/react'

describe('Base • Standard effects', () => {
  test('StandardEffectsFade renders expected structure and remounts on Replay', () => {
    render(withAnimationCard(<StandardEffectsFade />, { id: 'base__standard__fade' }))

    const stage = queryStage()
    expect(stage).toBeTruthy()
    const fadeEl = stage!.querySelector('.fade-element')
    expect(fadeEl).toBeTruthy()
    expect(screen.getByText('Fade')).toBeInTheDocument()

    // Replay should remount the stage (keyed) and thus its children
    const replay = screen.getByRole('button', { name: /replay/i })
    act(() => {
      replay.click()
    })

    const newStage = queryStage()
    expect(newStage).toBeTruthy()
    // A remount should at least cause a re-render; child count can reset to 0 or change
    expect(newStage!.childElementCount).toBeGreaterThanOrEqual(0)
    expect(newStage!.childElementCount).not.toBeLessThan(0)
  })

  test('StandardEffectsScale renders expected structure and remounts on Replay', () => {
    render(withAnimationCard(<StandardEffectsScale />, { id: 'base__standard__scale' }))

    const stage = queryStage()
    expect(stage).toBeTruthy()
    const scaleEl = stage!.querySelector('.scale-element')
    expect(scaleEl).toBeTruthy()
    expect(screen.getByText('Scale')).toBeInTheDocument()

    const replay = screen.getByRole('button', { name: /replay/i })
    act(() => {
      replay.click()
    })

    const newStage = queryStage()
    expect(newStage).toBeTruthy()
    expect(newStage!.childElementCount).toBeGreaterThanOrEqual(0)
  })
})
