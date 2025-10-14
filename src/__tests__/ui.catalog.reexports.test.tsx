import * as catalog from '../components/ui/catalog'

describe('ui/catalog re-exports', () => {
  it('exports the expected UI components', () => {
    expect(catalog).toBeDefined()
    // Access the re-exported symbols to count towards coverage
    // AnimationCard is memoized (memo returns object), others are functions
    expect(catalog.AnimationCard).toBeDefined()
    expect(typeof catalog.CategorySection).toBe('function')
    expect(typeof catalog.GroupSection).toBe('function')
  })
})
