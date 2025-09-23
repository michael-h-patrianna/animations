import * as animationCard from '../components/ui/animation-card'

describe('ui/animation-card re-export', () => {
  it('re-exports AnimationCard symbol', () => {
    expect(animationCard).toBeDefined()
    expect(typeof animationCard.AnimationCard).toBe('function')
  })
})
