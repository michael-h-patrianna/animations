import type { AnimationComponentMap } from '@/types/animation';

import { AmbientEffectsAmbientAurora } from './AmbientEffectsAmbientAurora';
import { AmbientEffectsAmbientGlow } from './AmbientEffectsAmbientGlow';
import { AmbientEffectsFloatingParticles } from './AmbientEffectsFloatingParticles';
import { AmbientEffectsGradientShift } from './AmbientEffectsGradientShift';
import { AmbientEffectsKenBurns } from './AmbientEffectsKenBurns';
import { AmbientEffectsParallaxLayers } from './AmbientEffectsParallaxLayers';

export { AmbientEffectsAmbientAurora } from './AmbientEffectsAmbientAurora';
export { AmbientEffectsAmbientGlow } from './AmbientEffectsAmbientGlow';
export { AmbientEffectsFloatingParticles } from './AmbientEffectsFloatingParticles';
export { AmbientEffectsGradientShift } from './AmbientEffectsGradientShift';
export { AmbientEffectsKenBurns } from './AmbientEffectsKenBurns';
export { AmbientEffectsParallaxLayers } from './AmbientEffectsParallaxLayers';

export const ambientAmbientEffectsAnimations: AnimationComponentMap = {
  'ambient-effects__ambient-aurora': AmbientEffectsAmbientAurora,
  'ambient-effects__ambient-glow': AmbientEffectsAmbientGlow,
  'ambient-effects__floating-particles': AmbientEffectsFloatingParticles,
  'ambient-effects__gradient-shift': AmbientEffectsGradientShift,
  'ambient-effects__ken-burns': AmbientEffectsKenBurns,
  'ambient-effects__parallax-layers': AmbientEffectsParallaxLayers
};
