import type { Transition } from 'framer-motion'
import { motionDurations, motionEasings } from './tokens'

export const createLoopTransition = (duration: number, delay = 0): Transition => ({
  duration,
  delay,
  ease: motionEasings.standard,
  repeat: Infinity,
  repeatType: 'loop',
})

export const loopTransition = createLoopTransition(motionDurations.pulse)
