import type { AnimationComponentMap } from '@/types/animation';

import { StandardEffectsErrorShake } from './StandardEffectsErrorShake';
import { StandardEffectsSuccessBounce } from './StandardEffectsSuccessBounce';

export { StandardEffectsErrorShake } from './StandardEffectsErrorShake';
export { StandardEffectsSuccessBounce } from './StandardEffectsSuccessBounce';

export const baseStandardEffectsAnimations: AnimationComponentMap = {
  'standard-effects__error-shake': StandardEffectsErrorShake,
  'standard-effects__success-bounce': StandardEffectsSuccessBounce
};