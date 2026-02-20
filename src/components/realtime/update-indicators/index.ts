// Framer variant CSS (loaded at group level for no-css-in-motion compliance)
import './shared.css'
import './framer/UpdateIndicatorsBadgePop.css'
import './framer/UpdateIndicatorsBadgePulse.css'
import './framer/UpdateIndicatorsHomeIconDotBounce.css'
import './framer/UpdateIndicatorsHomeIconDotPulse.css'
import './framer/UpdateIndicatorsHomeIconDotRadar.css'
import './framer/UpdateIndicatorsHomeIconDotSweep.css'
import './framer/UpdateIndicatorsLivePing.css'

import type { GroupExport, GroupMetadata } from '@/types/animation'
import { lazy } from 'react'

// Framer Motion - Import metadata only
import { metadata as badgePopMetadata } from './framer/UpdateIndicatorsBadgePop.meta'
import { metadata as badgePulseMetadata } from './framer/UpdateIndicatorsBadgePulse.meta'
import { metadata as dotBounceMetadata } from './framer/UpdateIndicatorsHomeIconDotBounce.meta'
import { metadata as dotPulseMetadata } from './framer/UpdateIndicatorsHomeIconDotPulse.meta'
import { metadata as dotRadarMetadata } from './framer/UpdateIndicatorsHomeIconDotRadar.meta'
import { metadata as dotSweepMetadata } from './framer/UpdateIndicatorsHomeIconDotSweep.meta'
import { metadata as livePingMetadata } from './framer/UpdateIndicatorsLivePing.meta'

// CSS - Import metadata only
import { metadata as badgePopCssMetadata } from './css/UpdateIndicatorsBadgePop.meta'
import { metadata as badgePulseCssMetadata } from './css/UpdateIndicatorsBadgePulse.meta'
import { metadata as dotBounceCssMetadata } from './css/UpdateIndicatorsHomeIconDotBounce.meta'
import { metadata as dotPulseCssMetadata } from './css/UpdateIndicatorsHomeIconDotPulse.meta'
import { metadata as dotRadarCssMetadata } from './css/UpdateIndicatorsHomeIconDotRadar.meta'
import { metadata as dotSweepCssMetadata } from './css/UpdateIndicatorsHomeIconDotSweep.meta'
import { metadata as livePingCssMetadata } from './css/UpdateIndicatorsLivePing.meta'

// Framer Motion - Lazy load components
const UpdateIndicatorsBadgePop = lazy(() =>
  import('./framer/UpdateIndicatorsBadgePop').then((m) => ({ default: m.UpdateIndicatorsBadgePop }))
)
const UpdateIndicatorsBadgePulse = lazy(() =>
  import('./framer/UpdateIndicatorsBadgePulse').then((m) => ({
    default: m.UpdateIndicatorsBadgePulse,
  }))
)
const UpdateIndicatorsHomeIconDotBounce = lazy(() =>
  import('./framer/UpdateIndicatorsHomeIconDotBounce').then((m) => ({
    default: m.UpdateIndicatorsHomeIconDotBounce,
  }))
)
const UpdateIndicatorsHomeIconDotPulse = lazy(() =>
  import('./framer/UpdateIndicatorsHomeIconDotPulse').then((m) => ({
    default: m.UpdateIndicatorsHomeIconDotPulse,
  }))
)
const UpdateIndicatorsHomeIconDotRadar = lazy(() =>
  import('./framer/UpdateIndicatorsHomeIconDotRadar').then((m) => ({
    default: m.UpdateIndicatorsHomeIconDotRadar,
  }))
)
const UpdateIndicatorsHomeIconDotSweep = lazy(() =>
  import('./framer/UpdateIndicatorsHomeIconDotSweep').then((m) => ({
    default: m.UpdateIndicatorsHomeIconDotSweep,
  }))
)
const UpdateIndicatorsLivePing = lazy(() =>
  import('./framer/UpdateIndicatorsLivePing').then((m) => ({ default: m.UpdateIndicatorsLivePing }))
)

// CSS - Lazy load components
const CssUpdateIndicatorsBadgePop = lazy(() =>
  import('./css/UpdateIndicatorsBadgePop').then((m) => ({ default: m.UpdateIndicatorsBadgePop }))
)
const CssUpdateIndicatorsBadgePulse = lazy(() =>
  import('./css/UpdateIndicatorsBadgePulse').then((m) => ({
    default: m.UpdateIndicatorsBadgePulse,
  }))
)
const CssUpdateIndicatorsHomeIconDotBounce = lazy(() =>
  import('./css/UpdateIndicatorsHomeIconDotBounce').then((m) => ({
    default: m.UpdateIndicatorsHomeIconDotBounce,
  }))
)
const CssUpdateIndicatorsHomeIconDotPulse = lazy(() =>
  import('./css/UpdateIndicatorsHomeIconDotPulse').then((m) => ({
    default: m.UpdateIndicatorsHomeIconDotPulse,
  }))
)
const CssUpdateIndicatorsHomeIconDotRadar = lazy(() =>
  import('./css/UpdateIndicatorsHomeIconDotRadar').then((m) => ({
    default: m.UpdateIndicatorsHomeIconDotRadar,
  }))
)
const CssUpdateIndicatorsHomeIconDotSweep = lazy(() =>
  import('./css/UpdateIndicatorsHomeIconDotSweep').then((m) => ({
    default: m.UpdateIndicatorsHomeIconDotSweep,
  }))
)
const CssUpdateIndicatorsLivePing = lazy(() =>
  import('./css/UpdateIndicatorsLivePing').then((m) => ({ default: m.UpdateIndicatorsLivePing }))
)

export const groupMetadata: GroupMetadata = {
  id: 'update-indicators',
  title: 'Update indicators',
  tech: 'css',
  demo: 'updateIndicators',
}

export const groupExport: GroupExport = {
  metadata: groupMetadata,
  framer: {
    'update-indicators__badge-pop': {
      component: UpdateIndicatorsBadgePop,
      metadata: badgePopMetadata,
    },
    'update-indicators__badge-pulse': {
      component: UpdateIndicatorsBadgePulse,
      metadata: badgePulseMetadata,
    },
    'update-indicators__live-ping': {
      component: UpdateIndicatorsLivePing,
      metadata: livePingMetadata,
    },
    'update-indicators__home-icon-dot-pulse': {
      component: UpdateIndicatorsHomeIconDotPulse,
      metadata: dotPulseMetadata,
    },
    'update-indicators__home-icon-dot-bounce': {
      component: UpdateIndicatorsHomeIconDotBounce,
      metadata: dotBounceMetadata,
    },
    'update-indicators__home-icon-dot-radar': {
      component: UpdateIndicatorsHomeIconDotRadar,
      metadata: dotRadarMetadata,
    },
    'update-indicators__home-icon-dot-sweep': {
      component: UpdateIndicatorsHomeIconDotSweep,
      metadata: dotSweepMetadata,
    },
  },
  css: {
    'update-indicators__badge-pop': {
      component: CssUpdateIndicatorsBadgePop,
      metadata: badgePopCssMetadata,
    },
    'update-indicators__badge-pulse': {
      component: CssUpdateIndicatorsBadgePulse,
      metadata: badgePulseCssMetadata,
    },
    'update-indicators__live-ping': {
      component: CssUpdateIndicatorsLivePing,
      metadata: livePingCssMetadata,
    },
    'update-indicators__home-icon-dot-pulse': {
      component: CssUpdateIndicatorsHomeIconDotPulse,
      metadata: dotPulseCssMetadata,
    },
    'update-indicators__home-icon-dot-bounce': {
      component: CssUpdateIndicatorsHomeIconDotBounce,
      metadata: dotBounceCssMetadata,
    },
    'update-indicators__home-icon-dot-radar': {
      component: CssUpdateIndicatorsHomeIconDotRadar,
      metadata: dotRadarCssMetadata,
    },
    'update-indicators__home-icon-dot-sweep': {
      component: CssUpdateIndicatorsHomeIconDotSweep,
      metadata: dotSweepCssMetadata,
    },
  },
}
