import type { GroupExport, GroupMetadata } from '@/types/animation'
import { lazy } from 'react'

// Framer Motion - Import metadata only
import { metadata as coinMagnetMetadata } from './framer/CollectionEffectsCoinMagnet.meta'
import { metadata as coinBurstMetadata } from './framer/CollectionEffectsCoinBurst.meta'
import { metadata as coinCollectPathMetadata } from './framer/CollectionEffectsCoinCollectPath.meta'

// CSS - Import metadata only
import { metadata as coinMagnetCssMetadata } from './css/CollectionEffectsCoinMagnet.meta'
import { metadata as coinBurstCssMetadata } from './css/CollectionEffectsCoinBurst.meta'
import { metadata as coinCollectPathCssMetadata } from './css/CollectionEffectsCoinCollectPath.meta'

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

const CollectionEffectsCoinCollectPath = lazy(() =>
  import('./framer/CollectionEffectsCoinCollectPath').then((m) => ({
    default: m.CollectionEffectsCoinCollectPath,
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

const CssCollectionEffectsCoinCollectPath = lazy(() =>
  import('./css/CollectionEffectsCoinCollectPath').then((m) => ({
    default: m.CollectionEffectsCoinCollectPath,
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
    'collection-effects__coin-collect-path': {
      component: CollectionEffectsCoinCollectPath,
      metadata: coinCollectPathMetadata,
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
    'collection-effects__coin-collect-path': {
      component: CssCollectionEffectsCoinCollectPath,
      metadata: coinCollectPathCssMetadata,
    },
  },
}
