import type { AnimationComponentMap } from '@/types/animation';

import { ComplexTimersCircularCountdown } from './ComplexTimersCircularCountdown';
import { ComplexTimersCountdownFlip } from './ComplexTimersCountdownFlip';
import { ComplexTimersGeneratorFill } from './ComplexTimersGeneratorFill';
import { ComplexTimersModeSwitch } from './ComplexTimersModeSwitch';
import { ComplexTimersTournamentTimer } from './ComplexTimersTournamentTimer';

export { ComplexTimersCircularCountdown } from './ComplexTimersCircularCountdown';
export { ComplexTimersCountdownFlip } from './ComplexTimersCountdownFlip';
export { ComplexTimersGeneratorFill } from './ComplexTimersGeneratorFill';
export { ComplexTimersModeSwitch } from './ComplexTimersModeSwitch';
export { ComplexTimersTournamentTimer } from './ComplexTimersTournamentTimer';

export const realtimeComplexTimersAnimations: AnimationComponentMap = {
  'complex-timers__circular-countdown': ComplexTimersCircularCountdown,
  'complex-timers__countdown-flip': ComplexTimersCountdownFlip,
  'complex-timers__generator-fill': ComplexTimersGeneratorFill,
  'complex-timers__mode-switch': ComplexTimersModeSwitch,
  'complex-timers__tournament-timer': ComplexTimersTournamentTimer
};
