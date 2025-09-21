import { IconAnimationsShake } from './IconAnimationsShake';
import { IconAnimationsBounce } from './IconAnimationsBounce';
import { IconAnimationsFloat } from './IconAnimationsFloat';
import { IconAnimationsPulse } from './IconAnimationsPulse';
import type { AnimationComponentMap } from '@/types/animation';

export {
  IconAnimationsShake,
  IconAnimationsBounce,
  IconAnimationsFloat,
  IconAnimationsPulse
};

export const iconAnimationsComponents: AnimationComponentMap = {
  'icon-animations__shake': IconAnimationsShake,
  'icon-animations__bounce': IconAnimationsBounce,
  'icon-animations__float': IconAnimationsFloat,
  'icon-animations__pulse': IconAnimationsPulse
};