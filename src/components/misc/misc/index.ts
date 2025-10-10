import type { GroupExport, GroupMetadata } from '@/types/animation'

import { MiscConcentricRings, metadata as concentricRingsMeta } from './MiscConcentricRings'
import { MiscOrbitalPulse, metadata as orbitalPulseMeta } from './MiscOrbitalPulse'
import { MiscOscillatingDots, metadata as oscillatingDotsMeta } from './MiscOscillatingDots'
import { MiscPendulumWave, metadata as pendulumWaveMeta } from './MiscPendulumWave'
// moved to standard-effects: MiscPulseWave
import { MiscPulsingGrid, metadata as pulsingGridMeta } from './MiscPulsingGrid'
// moved to standard-effects: MiscRadialPulse
import { MiscSequentialPulse, metadata as sequentialPulseMeta } from './MiscSequentialPulse'
import { MiscSpiralGalaxy, metadata as spiralGalaxyMeta } from './MiscSpiralGalaxy'

export const groupMetadata: GroupMetadata = {
  id: 'misc',
  title: 'Misc',
  tech: 'css',
  demo: 'misc'
}

export const groupExport: GroupExport = {
  metadata: groupMetadata,
  animations: {
    'misc__orbital-pulse': {
      component: MiscOrbitalPulse,
      metadata: orbitalPulseMeta
    },
    'misc__pendulum-wave': {
      component: MiscPendulumWave,
      metadata: pendulumWaveMeta
    },
    'misc__concentric-rings': {
      component: MiscConcentricRings,
      metadata: concentricRingsMeta
    },
    'misc__sequential-pulse': {
      component: MiscSequentialPulse,
      metadata: sequentialPulseMeta
    },
    'misc__oscillating-dots': {
      component: MiscOscillatingDots,
      metadata: oscillatingDotsMeta
    },
    'misc__pulsing-grid': {
      component: MiscPulsingGrid,
      metadata: pulsingGridMeta
    },
    'misc__spiral-galaxy': {
      component: MiscSpiralGalaxy,
      metadata: spiralGalaxyMeta
    }
  }
}
