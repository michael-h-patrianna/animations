import type { AnimationComponentMap } from '@/types/animation';

import { TimerEffectsTimerColorShift } from './TimerEffectsTimerColorShift';
import { TimerEffectsTimerFlash } from './TimerEffectsTimerFlash';
import { TimerEffectsTimerFlashSoft } from './TimerEffectsTimerFlashSoft';
import { TimerEffectsTimerFlip } from './TimerEffectsTimerFlip';
import { TimerEffectsTimerPulse } from './TimerEffectsTimerPulse';

export { TimerEffectsTimerColorShift } from './TimerEffectsTimerColorShift';
export { TimerEffectsTimerFlash } from './TimerEffectsTimerFlash';
export { TimerEffectsTimerFlashSoft } from './TimerEffectsTimerFlashSoft';
export { TimerEffectsTimerFlip } from './TimerEffectsTimerFlip';
export { TimerEffectsTimerPulse } from './TimerEffectsTimerPulse';

export const realtimeTimerEffectsAnimations: AnimationComponentMap = {
  'timer-effects__timer-color-shift': TimerEffectsTimerColorShift,
  'timer-effects__timer-flash': TimerEffectsTimerFlash,
  'timer-effects__timer-flash-soft': TimerEffectsTimerFlashSoft,
  'timer-effects__timer-flip': TimerEffectsTimerFlip,
  'timer-effects__timer-pulse': TimerEffectsTimerPulse,
};
