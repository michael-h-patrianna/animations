import type { AnimationComponentMap } from '@/types/animation';
import { lazy } from 'react';

// Lazy-loaded variants to enable code-splitting per animation component
const TimerEffectsTimerColorShift = lazy(() => import('./TimerEffectsTimerColorShift').then(m => ({ default: m.TimerEffectsTimerColorShift })));
const TimerEffectsTimerFlash = lazy(() => import('./TimerEffectsTimerFlash').then(m => ({ default: m.TimerEffectsTimerFlash })));
const TimerEffectsTimerFlashSoft = lazy(() => import('./TimerEffectsTimerFlashSoft').then(m => ({ default: m.TimerEffectsTimerFlashSoft })));
const TimerEffectsTimerFlip = lazy(() => import('./TimerEffectsTimerFlip').then(m => ({ default: m.TimerEffectsTimerFlip })));
const TimerEffectsTimerPulse = lazy(() => import('./TimerEffectsTimerPulse').then(m => ({ default: m.TimerEffectsTimerPulse })));

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
