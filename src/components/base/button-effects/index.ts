import type { AnimationComponentMap } from '@/types/animation';
import { ButtonEffectsRipple } from './ButtonEffectsRipple';
import { ButtonEffectsJitter } from './ButtonEffectsJitter';
import { ButtonEffectsLiquidMorph } from './ButtonEffectsLiquidMorph';
import { ButtonEffectsShockwave } from './ButtonEffectsShockwave';
import { ButtonEffectsSplitReveal } from './ButtonEffectsSplitReveal';

export { ButtonEffectsRipple } from './ButtonEffectsRipple';
export { ButtonEffectsJitter } from './ButtonEffectsJitter';
export { ButtonEffectsLiquidMorph } from './ButtonEffectsLiquidMorph';
export { ButtonEffectsShockwave } from './ButtonEffectsShockwave';
export { ButtonEffectsSplitReveal } from './ButtonEffectsSplitReveal';

export const baseButtonEffectsAnimations: AnimationComponentMap = {
  'button-effects__ripple': ButtonEffectsRipple,
  'button-effects__jitter': ButtonEffectsJitter,
  'button-effects__liquid-morph': ButtonEffectsLiquidMorph,
  'button-effects__shockwave': ButtonEffectsShockwave,
  'button-effects__split-reveal': ButtonEffectsSplitReveal,
};
