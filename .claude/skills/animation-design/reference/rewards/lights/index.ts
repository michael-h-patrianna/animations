import type { GroupExport, GroupMetadata } from '@/types/animation'
import { lazy } from 'react'

// Framer Motion - Import metadata only
import { metadata as metadata1 } from './framer/LightsCircleStatic1.meta'
import { metadata as metadata2 } from './framer/LightsCircleStatic2.meta'
import { metadata as metadata3 } from './framer/LightsCircleStatic3.meta'
import { metadata as metadata4 } from './framer/LightsCircleStatic4.meta'
import { metadata as metadata5 } from './framer/LightsCircleStatic5.meta'
import { metadata as metadata6 } from './framer/LightsCircleStatic6.meta'
import { metadata as metadata7 } from './framer/LightsCircleStatic7.meta'
import { metadata as metadata8 } from './framer/LightsCircleStatic8.meta'

// CSS - Import metadata only
import { metadata as cssMetadata1 } from './css/LightsCircleStatic1.meta'
import { metadata as cssMetadata2 } from './css/LightsCircleStatic2.meta'
import { metadata as cssMetadata3 } from './css/LightsCircleStatic3.meta'
import { metadata as cssMetadata4 } from './css/LightsCircleStatic4.meta'
import { metadata as cssMetadata5 } from './css/LightsCircleStatic5.meta'
import { metadata as cssMetadata6 } from './css/LightsCircleStatic6.meta'
import { metadata as cssMetadata7 } from './css/LightsCircleStatic7.meta'
import { metadata as cssMetadata8 } from './css/LightsCircleStatic8.meta'

// Framer Motion - Lazy load components
const LightsCircleStatic1 = lazy(() =>
  import('./framer/LightsCircleStatic1').then((m) => ({ default: m.default }))
)
const LightsCircleStatic2 = lazy(() =>
  import('./framer/LightsCircleStatic2').then((m) => ({ default: m.default }))
)
const LightsCircleStatic3 = lazy(() =>
  import('./framer/LightsCircleStatic3').then((m) => ({ default: m.default }))
)
const LightsCircleStatic4 = lazy(() =>
  import('./framer/LightsCircleStatic4').then((m) => ({ default: m.default }))
)
const LightsCircleStatic5 = lazy(() =>
  import('./framer/LightsCircleStatic5').then((m) => ({ default: m.default }))
)
const LightsCircleStatic6 = lazy(() =>
  import('./framer/LightsCircleStatic6').then((m) => ({ default: m.default }))
)
const LightsCircleStatic7 = lazy(() =>
  import('./framer/LightsCircleStatic7').then((m) => ({ default: m.default }))
)
const LightsCircleStatic8 = lazy(() =>
  import('./framer/LightsCircleStatic8').then((m) => ({ default: m.default }))
)

// CSS - Lazy load components
const CssLightsCircleStatic1 = lazy(() =>
  import('./css/LightsCircleStatic1').then((m) => ({ default: m.default }))
)
const CssLightsCircleStatic2 = lazy(() =>
  import('./css/LightsCircleStatic2').then((m) => ({ default: m.default }))
)
const CssLightsCircleStatic3 = lazy(() =>
  import('./css/LightsCircleStatic3').then((m) => ({ default: m.default }))
)
const CssLightsCircleStatic4 = lazy(() =>
  import('./css/LightsCircleStatic4').then((m) => ({ default: m.default }))
)
const CssLightsCircleStatic5 = lazy(() =>
  import('./css/LightsCircleStatic5').then((m) => ({ default: m.default }))
)
const CssLightsCircleStatic6 = lazy(() =>
  import('./css/LightsCircleStatic6').then((m) => ({ default: m.default }))
)
const CssLightsCircleStatic7 = lazy(() =>
  import('./css/LightsCircleStatic7').then((m) => ({ default: m.default }))
)
const CssLightsCircleStatic8 = lazy(() =>
  import('./css/LightsCircleStatic8').then((m) => ({ default: m.default }))
)

export const groupMetadata: GroupMetadata = {
  id: 'lights',
  title: 'Lights',
  tech: 'css',
  demo: 'lights',
}

export const groupExport: GroupExport = {
  metadata: groupMetadata,
  framer: {
    'lights__circle-static-1': { component: LightsCircleStatic1, metadata: metadata1 },
    'lights__circle-static-2': { component: LightsCircleStatic2, metadata: metadata2 },
    'lights__circle-static-3': { component: LightsCircleStatic3, metadata: metadata3 },
    'lights__circle-static-4': { component: LightsCircleStatic4, metadata: metadata4 },
    'lights__circle-static-5': { component: LightsCircleStatic5, metadata: metadata5 },
    'lights__circle-static-6': { component: LightsCircleStatic6, metadata: metadata6 },
    'lights__circle-static-7': { component: LightsCircleStatic7, metadata: metadata7 },
    'lights__circle-static-8': { component: LightsCircleStatic8, metadata: metadata8 },
  },
  css: {
    'lights__circle-static-1': { component: CssLightsCircleStatic1, metadata: cssMetadata1 },
    'lights__circle-static-2': { component: CssLightsCircleStatic2, metadata: cssMetadata2 },
    'lights__circle-static-3': { component: CssLightsCircleStatic3, metadata: cssMetadata3 },
    'lights__circle-static-4': { component: CssLightsCircleStatic4, metadata: cssMetadata4 },
    'lights__circle-static-5': { component: CssLightsCircleStatic5, metadata: cssMetadata5 },
    'lights__circle-static-6': { component: CssLightsCircleStatic6, metadata: cssMetadata6 },
    'lights__circle-static-7': { component: CssLightsCircleStatic7, metadata: cssMetadata7 },
    'lights__circle-static-8': { component: CssLightsCircleStatic8, metadata: cssMetadata8 },
  },
}
