import type { AnimationComponentMap } from '@/types/animation'

import { UpdateIndicatorsBadgePop } from './UpdateIndicatorsBadgePop'
import { UpdateIndicatorsBadgePulse } from './UpdateIndicatorsBadgePulse'
import { UpdateIndicatorsHomeIconDotBounce } from './UpdateIndicatorsHomeIconDotBounce'
import { UpdateIndicatorsHomeIconDotPulse } from './UpdateIndicatorsHomeIconDotPulse'
import { UpdateIndicatorsHomeIconDotRadar } from './UpdateIndicatorsHomeIconDotRadar'
import { UpdateIndicatorsHomeIconDotSweep } from './UpdateIndicatorsHomeIconDotSweep'
import { UpdateIndicatorsLivePing } from './UpdateIndicatorsLivePing'

export { UpdateIndicatorsBadgePop } from './UpdateIndicatorsBadgePop'
export { UpdateIndicatorsBadgePulse } from './UpdateIndicatorsBadgePulse'
export { UpdateIndicatorsHomeIconDotBounce } from './UpdateIndicatorsHomeIconDotBounce'
export { UpdateIndicatorsHomeIconDotPulse } from './UpdateIndicatorsHomeIconDotPulse'
export { UpdateIndicatorsHomeIconDotRadar } from './UpdateIndicatorsHomeIconDotRadar'
export { UpdateIndicatorsHomeIconDotSweep } from './UpdateIndicatorsHomeIconDotSweep'
export { UpdateIndicatorsLivePing } from './UpdateIndicatorsLivePing'

export const realtimeUpdateIndicatorsAnimations: AnimationComponentMap = {
  'update-indicators__badge-pop': UpdateIndicatorsBadgePop,
  'update-indicators__badge-pulse': UpdateIndicatorsBadgePulse,
  'update-indicators__live-ping': UpdateIndicatorsLivePing,
  'update-indicators__home-icon-dot-pulse': UpdateIndicatorsHomeIconDotPulse,
  'update-indicators__home-icon-dot-bounce': UpdateIndicatorsHomeIconDotBounce,
  'update-indicators__home-icon-dot-radar': UpdateIndicatorsHomeIconDotRadar,
  'update-indicators__home-icon-dot-sweep': UpdateIndicatorsHomeIconDotSweep,
}
