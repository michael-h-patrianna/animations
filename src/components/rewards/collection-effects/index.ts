// Framer variant CSS (loaded at group level for no-css-in-motion compliance)
import './framer/CollectionEffectsCoinBurst.css'
import './framer/CollectionEffectsCoinMagnet.css'
import './framer/CollectionEffectsCoinsFountain.css'

import type { GroupExport, GroupMetadata } from '@/types/animation'
import { lazy } from 'react'

// Framer Motion - Import metadata only
import { metadata as coinMagnetMetadata } from './framer/CollectionEffectsCoinMagnet.meta'
import { metadata as coinBurstMetadata } from './framer/CollectionEffectsCoinBurst.meta'
import { metadata as coinTrailMetadata } from './framer/CollectionEffectsCoinTrail.meta'
import { metadata as coinsFountainMetadata } from './framer/CollectionEffectsCoinsFountain.meta'

// CSS - Import metadata only
import { metadata as coinMagnetCssMetadata } from './css/CollectionEffectsCoinMagnet.meta'
import { metadata as coinBurstCssMetadata } from './css/CollectionEffectsCoinBurst.meta'
import { metadata as coinTrailCssMetadata } from './css/CollectionEffectsCoinTrail.meta'
import { metadata as coinsFountainCssMetadata } from './css/CollectionEffectsCoinsFountain.meta'

// Framer Motion - Lazy load components
const CollectionEffectsCoinMagnet = lazy(() =>
  import('./framer/CollectionEffectsCoinMagnet').then((m) => ({
    default: m.CollectionEffectsCoinMagnet,
  }))
)

const CollectionEffectsCoinBurst = lazy(() =>
  import('./framer/CollectionEffectsCoinBurst').then((m) => ({
    default: m.CollectionEffectsCoinBurst,
  }))
)

const CollectionEffectsCoinTrail = lazy(() =>
  import('./framer/CollectionEffectsCoinTrail').then((m) => ({
    default: m.CollectionEffectsCoinTrail,
  }))
)

const CollectionEffectsCoinsFountain = lazy(() =>
  import('./framer/CollectionEffectsCoinsFountain').then((m) => ({
    default: m.CollectionEffectsCoinsFountain,
  }))
)

// CSS - Lazy load components
const CssCollectionEffectsCoinMagnet = lazy(() =>
  import('./css/CollectionEffectsCoinMagnet').then((m) => ({
    default: m.CollectionEffectsCoinMagnet,
  }))
)

const CssCollectionEffectsCoinBurst = lazy(() =>
  import('./css/CollectionEffectsCoinBurst').then((m) => ({
    default: m.CollectionEffectsCoinBurst,
  }))
)

const CssCollectionEffectsCoinTrail = lazy(() =>
  import('./css/CollectionEffectsCoinTrail').then((m) => ({
    default: m.CollectionEffectsCoinTrail,
  }))
)

const CssCollectionEffectsCoinsFountain = lazy(() =>
  import('./css/CollectionEffectsCoinsFountain').then((m) => ({
    default: m.CollectionEffectsCoinsFountain,
  }))
)

export const groupMetadata: GroupMetadata = {
  id: 'collection-effects',
  title: 'Collection Effects',
  tech: 'css',
  demo: 'collectionEffects',
}

export const groupExport: GroupExport = {
  metadata: groupMetadata,
  framer: {
    'collection-effects__coin-magnet': {
      component: CollectionEffectsCoinMagnet,
      metadata: coinMagnetMetadata,
    },
    'collection-effects__coin-burst': {
      component: CollectionEffectsCoinBurst,
      metadata: coinBurstMetadata,
    },
    'collection-effects__coin-trail': {
      component: CollectionEffectsCoinTrail,
      metadata: coinTrailMetadata,
    },
    'collection-effects__coins-fountain': {
      component: CollectionEffectsCoinsFountain,
      metadata: coinsFountainMetadata,
    },
  },
  css: {
    'collection-effects__coin-magnet': {
      component: CssCollectionEffectsCoinMagnet,
      metadata: coinMagnetCssMetadata,
    },
    'collection-effects__coin-burst': {
      component: CssCollectionEffectsCoinBurst,
      metadata: coinBurstCssMetadata,
    },
    'collection-effects__coin-trail': {
      component: CssCollectionEffectsCoinTrail,
      metadata: coinTrailCssMetadata,
    },
    'collection-effects__coins-fountain': {
      component: CssCollectionEffectsCoinsFountain,
      metadata: coinsFountainCssMetadata,
    },
  },
}
