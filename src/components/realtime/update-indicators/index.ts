import type { GroupMetadata, GroupExport } from '@/types/animation'

import { UpdateIndicatorsBadgePop, metadata as badgePopMetadata } from './framer/UpdateIndicatorsBadgePop'
import { UpdateIndicatorsBadgePulse, metadata as badgePulseMetadata } from './framer/UpdateIndicatorsBadgePulse'
import { UpdateIndicatorsHomeIconDotBounce, metadata as dotBounceMetadata } from './framer/UpdateIndicatorsHomeIconDotBounce'
import { UpdateIndicatorsHomeIconDotPulse, metadata as dotPulseMetadata } from './framer/UpdateIndicatorsHomeIconDotPulse'
import { UpdateIndicatorsHomeIconDotRadar, metadata as dotRadarMetadata } from './framer/UpdateIndicatorsHomeIconDotRadar'
import { UpdateIndicatorsHomeIconDotSweep, metadata as dotSweepMetadata } from './framer/UpdateIndicatorsHomeIconDotSweep'
import { UpdateIndicatorsLivePing, metadata as livePingMetadata } from './framer/UpdateIndicatorsLivePing'

// CSS animations
import { UpdateIndicatorsBadgePop as CssUpdateIndicatorsBadgePop, metadata as badgePopCssMetadata } from './css/UpdateIndicatorsBadgePop'
import { UpdateIndicatorsBadgePulse as CssUpdateIndicatorsBadgePulse, metadata as badgePulseCssMetadata } from './css/UpdateIndicatorsBadgePulse'
import { UpdateIndicatorsHomeIconDotBounce as CssUpdateIndicatorsHomeIconDotBounce, metadata as dotBounceCssMetadata } from './css/UpdateIndicatorsHomeIconDotBounce'
import { UpdateIndicatorsHomeIconDotPulse as CssUpdateIndicatorsHomeIconDotPulse, metadata as dotPulseCssMetadata } from './css/UpdateIndicatorsHomeIconDotPulse'
import { UpdateIndicatorsHomeIconDotRadar as CssUpdateIndicatorsHomeIconDotRadar, metadata as dotRadarCssMetadata } from './css/UpdateIndicatorsHomeIconDotRadar'
import { UpdateIndicatorsHomeIconDotSweep as CssUpdateIndicatorsHomeIconDotSweep, metadata as dotSweepCssMetadata } from './css/UpdateIndicatorsHomeIconDotSweep'
import { UpdateIndicatorsLivePing as CssUpdateIndicatorsLivePing, metadata as livePingCssMetadata } from './css/UpdateIndicatorsLivePing'

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
      metadata: badgePopMetadata
    },
    'update-indicators__badge-pulse': {
      component: UpdateIndicatorsBadgePulse,
      metadata: badgePulseMetadata
    },
    'update-indicators__live-ping': {
      component: UpdateIndicatorsLivePing,
      metadata: livePingMetadata
    },
    'update-indicators__home-icon-dot-pulse': {
      component: UpdateIndicatorsHomeIconDotPulse,
      metadata: dotPulseMetadata
    },
    'update-indicators__home-icon-dot-bounce': {
      component: UpdateIndicatorsHomeIconDotBounce,
      metadata: dotBounceMetadata
    },
    'update-indicators__home-icon-dot-radar': {
      component: UpdateIndicatorsHomeIconDotRadar,
      metadata: dotRadarMetadata
    },
    'update-indicators__home-icon-dot-sweep': {
      component: UpdateIndicatorsHomeIconDotSweep,
      metadata: dotSweepMetadata
    }
  },
  css: {
    'update-indicators__badge-pop': {
      component: CssUpdateIndicatorsBadgePop,
      metadata: badgePopCssMetadata
    },
    'update-indicators__badge-pulse': {
      component: CssUpdateIndicatorsBadgePulse,
      metadata: badgePulseCssMetadata
    },
    'update-indicators__live-ping': {
      component: CssUpdateIndicatorsLivePing,
      metadata: livePingCssMetadata
    },
    'update-indicators__home-icon-dot-pulse': {
      component: CssUpdateIndicatorsHomeIconDotPulse,
      metadata: dotPulseCssMetadata
    },
    'update-indicators__home-icon-dot-bounce': {
      component: CssUpdateIndicatorsHomeIconDotBounce,
      metadata: dotBounceCssMetadata
    },
    'update-indicators__home-icon-dot-radar': {
      component: CssUpdateIndicatorsHomeIconDotRadar,
      metadata: dotRadarCssMetadata
    },
    'update-indicators__home-icon-dot-sweep': {
      component: CssUpdateIndicatorsHomeIconDotSweep,
      metadata: dotSweepCssMetadata
    }
  },
}

