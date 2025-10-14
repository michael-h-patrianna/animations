import * as animationCard from '../components/ui/animation-card'

describe('ui/animation-card re-export', () => {
  it('re-exports AnimationCard symbol', () => {
    expect(animationCard).toBeDefined()
    // AnimationCard is a memoized component (memo returns an object with $$typeof)
    expect(animationCard.AnimationCard).toBeDefined()
    expect(typeof animationCard.AnimationCard).toBe('object')
  })
})
