import { MiscConcentricRings } from './MiscConcentricRings'
import { MiscOrbitalPulse } from './MiscOrbitalPulse'
import { MiscOscillatingDots } from './MiscOscillatingDots'
import { MiscPendulumWave } from './MiscPendulumWave'
// moved to standard-effects: MiscPulseWave
import { MiscPulsingGrid } from './MiscPulsingGrid'
// moved to standard-effects: MiscRadialPulse
import { MiscSequentialPulse } from './MiscSequentialPulse'
import { MiscSpiralGalaxy } from './MiscSpiralGalaxy'

export const miscMiscAnimations = {
  // moved to standard-effects: 'misc__radial-pulse'
  'misc__orbital-pulse': MiscOrbitalPulse,
  'misc__pendulum-wave': MiscPendulumWave,
  // moved to standard-effects: 'misc__pulse-wave'
  'misc__concentric-rings': MiscConcentricRings,
  'misc__sequential-pulse': MiscSequentialPulse,
  'misc__oscillating-dots': MiscOscillatingDots,
  'misc__pulsing-grid': MiscPulsingGrid,
  'misc__spiral-galaxy': MiscSpiralGalaxy,
}
