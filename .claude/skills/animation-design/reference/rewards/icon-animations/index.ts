import type { GroupExport, GroupMetadata } from '@/types/animation'
import { lazy } from 'react'

// Framer Motion - Import metadata only
import { metadata as badgePopRotateMetadata } from './framer/IconAnimationsBadgePopRotate.meta'
import { metadata as bounceMetadata } from './framer/IconAnimationsBounce.meta'
import { metadata as floatMetadata } from './framer/IconAnimationsFloat.meta'
import { metadata as pulseMetadata } from './framer/IconAnimationsPulse.meta'
import { metadata as shakeMetadata } from './framer/IconAnimationsShake.meta'

// CSS - Import metadata only
import { metadata as badgePopRotateCssMetadata } from './css/IconAnimationsBadgePopRotate.meta'
import { metadata as bounceCssMetadata } from './css/IconAnimationsBounce.meta'
import { metadata as floatCssMetadata } from './css/IconAnimationsFloat.meta'
import { metadata as pulseCssMetadata } from './css/IconAnimationsPulse.meta'
import { metadata as shakeCssMetadata } from './css/IconAnimationsShake.meta'

// Framer Motion - Lazy load components
const IconAnimationsBadgePopRotate = lazy(() =>
  import('./framer/IconAnimationsBadgePopRotate').then((m) => ({
    default: m.IconAnimationsBadgePopRotate,
  }))
)
const IconAnimationsShake = lazy(() =>
  import('./framer/IconAnimationsShake').then((m) => ({ default: m.IconAnimationsShake }))
)
const IconAnimationsBounce = lazy(() =>
  import('./framer/IconAnimationsBounce').then((m) => ({ default: m.IconAnimationsBounce }))
)
const IconAnimationsFloat = lazy(() =>
  import('./framer/IconAnimationsFloat').then((m) => ({ default: m.IconAnimationsFloat }))
)
const IconAnimationsPulse = lazy(() =>
  import('./framer/IconAnimationsPulse').then((m) => ({ default: m.IconAnimationsPulse }))
)

// CSS - Lazy load components
const CssIconAnimationsBadgePopRotate = lazy(() =>
  import('./css/IconAnimationsBadgePopRotate').then((m) => ({
    default: m.IconAnimationsBadgePopRotate,
  }))
)
const CssIconAnimationsBounce = lazy(() =>
  import('./css/IconAnimationsBounce').then((m) => ({ default: m.IconAnimationsBounce }))
)
const CssIconAnimationsFloat = lazy(() =>
  import('./css/IconAnimationsFloat').then((m) => ({ default: m.IconAnimationsFloat }))
)
const CssIconAnimationsPulse = lazy(() =>
  import('./css/IconAnimationsPulse').then((m) => ({ default: m.IconAnimationsPulse }))
)
const CssIconAnimationsShake = lazy(() =>
  import('./css/IconAnimationsShake').then((m) => ({ default: m.IconAnimationsShake }))
)

export const groupMetadata: GroupMetadata = {
  id: 'icon-animations',
  title: 'Icon animations',
  tech: 'css',
  demo: 'iconAnimations',
}

export const groupExport: GroupExport = {
  metadata: groupMetadata,
  framer: {
    'icon-animations__badge-pop-rotate': {
      component: IconAnimationsBadgePopRotate,
      metadata: badgePopRotateMetadata,
    },
    'icon-animations__shake': { component: IconAnimationsShake, metadata: shakeMetadata },
    'icon-animations__bounce': { component: IconAnimationsBounce, metadata: bounceMetadata },
    'icon-animations__float': { component: IconAnimationsFloat, metadata: floatMetadata },
    'icon-animations__pulse': { component: IconAnimationsPulse, metadata: pulseMetadata },
  },
  css: {
    'icon-animations__badge-pop-rotate': {
      component: CssIconAnimationsBadgePopRotate,
      metadata: badgePopRotateCssMetadata,
    },
    'icon-animations__shake': { component: CssIconAnimationsShake, metadata: shakeCssMetadata },
    'icon-animations__bounce': { component: CssIconAnimationsBounce, metadata: bounceCssMetadata },
    'icon-animations__float': { component: CssIconAnimationsFloat, metadata: floatCssMetadata },
    'icon-animations__pulse': { component: CssIconAnimationsPulse, metadata: pulseCssMetadata },
  },
}
