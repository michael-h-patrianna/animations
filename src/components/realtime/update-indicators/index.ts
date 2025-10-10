import type { GroupMetadata, GroupExport } from '@/types/animation'

import { UpdateIndicatorsBadgePop, metadata as badgePopMetadata } from './framer/UpdateIndicatorsBadgePop'
import { UpdateIndicatorsBadgePulse, metadata as badgePulseMetadata } from './framer/UpdateIndicatorsBadgePulse'
import { UpdateIndicatorsHomeIconDotBounce, metadata as dotBounceMetadata } from './framer/UpdateIndicatorsHomeIconDotBounce'
import { UpdateIndicatorsHomeIconDotPulse, metadata as dotPulseMetadata } from './framer/UpdateIndicatorsHomeIconDotPulse'
import { UpdateIndicatorsHomeIconDotRadar, metadata as dotRadarMetadata } from './framer/UpdateIndicatorsHomeIconDotRadar'
import { UpdateIndicatorsHomeIconDotSweep, metadata as dotSweepMetadata } from './framer/UpdateIndicatorsHomeIconDotSweep'
import { UpdateIndicatorsLivePing, metadata as livePingMetadata } from './framer/UpdateIndicatorsLivePing'

export const groupMetadata: GroupMetadata = {
  id: 'update-indicators',
  title: 'Update indicators',
  tech: 'css',
  demo: 'updateIndicators',
}

export const groupExport: GroupExport = {
  metadata: groupMetadata,
  animations: {
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
  }
}

