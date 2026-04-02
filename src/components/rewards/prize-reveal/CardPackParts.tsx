/**
 * Re-export barrel for backward compatibility.
 *
 * Actual implementations are split across:
 * - SharedCardPackTypes.ts — types and constants
 * - CardPackArrivalParts.tsx — arrival/anticipation effects
 * - CardPackBurstParts.tsx — burst/reveal/celebration effects
 */

// Types & constants
export type {
  PackPhase,
  CardRarity,
  CardData,
  FanPosition,
  ConfettiData,
} from './SharedCardPackTypes'
export { RARITY_COLORS } from './SharedCardPackTypes'

// Arrival & anticipation phase
export { PackBody, SeamLight, ArrivalDust, EdgeSparks, SeamCracks } from './CardPackArrivalParts'

// Burst, reveal & celebration phase
export {
  PackTearOpen,
  TearLineFlash,
  LightSpill,
  GoldenConfetti,
  RarityBurst,
  ScreenFlash,
  CollectBurst,
} from './CardPackBurstParts'
