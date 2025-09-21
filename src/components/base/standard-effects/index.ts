import type { AnimationComponentMap } from '@/types/animation';

import { StandardEffectsShake } from './StandardEffectsShake';
import { StandardEffectsBounce } from './StandardEffectsBounce';
import { StandardEffectsPulse } from './StandardEffectsPulse';
import { StandardEffectsRubberBand } from './StandardEffectsRubberBand';
import { StandardEffectsSwing } from './StandardEffectsSwing';
import { StandardEffectsJello } from './StandardEffectsJello';
import { StandardEffectsPop } from './StandardEffectsPop';
import { StandardEffectsWiggle } from './StandardEffectsWiggle';
import { StandardEffectsFlip } from './StandardEffectsFlip';
import { StandardEffectsSpin } from './StandardEffectsSpin';
import { StandardEffectsFloat } from './StandardEffectsFloat';

export { StandardEffectsShake } from './StandardEffectsShake';
export { StandardEffectsBounce } from './StandardEffectsBounce';
export { StandardEffectsPulse } from './StandardEffectsPulse';
export { StandardEffectsRubberBand } from './StandardEffectsRubberBand';
export { StandardEffectsSwing } from './StandardEffectsSwing';
export { StandardEffectsJello } from './StandardEffectsJello';
export { StandardEffectsPop } from './StandardEffectsPop';
export { StandardEffectsWiggle } from './StandardEffectsWiggle';
export { StandardEffectsFlip } from './StandardEffectsFlip';
export { StandardEffectsSpin } from './StandardEffectsSpin';
export { StandardEffectsFloat } from './StandardEffectsFloat';

export const baseStandardEffectsAnimations: AnimationComponentMap = {
  'standard-effects__shake': StandardEffectsShake,
  'standard-effects__bounce': StandardEffectsBounce,
  'standard-effects__pulse': StandardEffectsPulse,
  'standard-effects__rubber-band': StandardEffectsRubberBand,
  'standard-effects__swing': StandardEffectsSwing,
  'standard-effects__jello': StandardEffectsJello,
  'standard-effects__pop': StandardEffectsPop,
  'standard-effects__wiggle': StandardEffectsWiggle,
  'standard-effects__flip': StandardEffectsFlip,
  'standard-effects__spin': StandardEffectsSpin,
  'standard-effects__float': StandardEffectsFloat
};