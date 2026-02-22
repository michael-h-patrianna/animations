import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { CollectionEffectsCoinBurst as CssCollectionEffectsCoinBurst } from '@/components/rewards/collection-effects/css/CollectionEffectsCoinBurst'
import { CollectionEffectsCoinMagnet as CssCollectionEffectsCoinMagnet } from '@/components/rewards/collection-effects/css/CollectionEffectsCoinMagnet'
import { CollectionEffectsCoinTrail as CssCollectionEffectsCoinTrail } from '@/components/rewards/collection-effects/css/CollectionEffectsCoinTrail'
import { CollectionEffectsCoinsFountain as CssCollectionEffectsCoinsFountain } from '@/components/rewards/collection-effects/css/CollectionEffectsCoinsFountain'
import { CollectionEffectsCoinBurst as FramerCollectionEffectsCoinBurst } from '@/components/rewards/collection-effects/framer/CollectionEffectsCoinBurst'
import { CollectionEffectsCoinMagnet as FramerCollectionEffectsCoinMagnet } from '@/components/rewards/collection-effects/framer/CollectionEffectsCoinMagnet'
import { CollectionEffectsCoinTrail as FramerCollectionEffectsCoinTrail } from '@/components/rewards/collection-effects/framer/CollectionEffectsCoinTrail'
import { CollectionEffectsCoinsFountain as FramerCollectionEffectsCoinsFountain } from '@/components/rewards/collection-effects/framer/CollectionEffectsCoinsFountain'

function expectAnimationIdPresent(Component: () => JSX.Element, animationId: string) {
  const { container } = render(<Component />)
  expect(container.querySelector(`[data-animation-id="${animationId}"]`)).toBeInTheDocument()
}

describe('collection-effects components expose data-animation-id', () => {
  const suites: Array<{ name: string; component: () => JSX.Element; id: string }> = [
    { name: 'CSS coin-magnet', component: CssCollectionEffectsCoinMagnet, id: 'collection-effects__coin-magnet' },
    { name: 'CSS coin-burst', component: CssCollectionEffectsCoinBurst, id: 'collection-effects__coin-burst' },
    { name: 'CSS coin-trail', component: CssCollectionEffectsCoinTrail, id: 'collection-effects__coin-trail' },
    { name: 'CSS coins-fountain', component: CssCollectionEffectsCoinsFountain, id: 'collection-effects__coins-fountain' },
    { name: 'Framer coin-magnet', component: FramerCollectionEffectsCoinMagnet, id: 'collection-effects__coin-magnet' },
    { name: 'Framer coin-burst', component: FramerCollectionEffectsCoinBurst, id: 'collection-effects__coin-burst' },
    { name: 'Framer coin-trail', component: FramerCollectionEffectsCoinTrail, id: 'collection-effects__coin-trail' },
    { name: 'Framer coins-fountain', component: FramerCollectionEffectsCoinsFountain, id: 'collection-effects__coins-fountain' },
  ]

  for (const suite of suites) {
    it(`for ${suite.name}`, () => {
      expectAnimationIdPresent(suite.component, suite.id)
    })
  }
})
