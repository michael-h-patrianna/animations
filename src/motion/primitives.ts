import type { Transition } from 'motion/react'
import type { CSSProperties } from 'react'
import { motionDurations, motionEasings, overlayOpacity } from './tokens'

export const createLoopTransition = (duration: number, delay = 0): Transition => ({
  duration,
  delay,
  ease: motionEasings.standard,
  repeat: Infinity,
  repeatType: 'loop',
})

export const loopTransition = createLoopTransition(motionDurations.pulse)

/**
 * Creates a style object for overlay backgrounds with tokenized opacity.
 * Use this instead of inline opacity values for consistency across the design system.
 *
 * @param opacity - Opacity value from overlayOpacity tokens
 * @returns Style object with CSS variable for overlay opacity
 *
 * @example
 * ```tsx
 * <motion.div style={createOverlayStyle(overlayOpacity.standard)}>
 *   Overlay content
 * </motion.div>
 * ```
 */
export const createOverlayStyle = (opacity: number): CSSProperties => ({
  ['--overlay-opacity' as keyof CSSProperties]: opacity.toString(),
})

/**
 * Pre-configured overlay styles for common use cases
 */
export const overlayStyles = {
  subtle: createOverlayStyle(overlayOpacity.subtle),
  standard: createOverlayStyle(overlayOpacity.standard),
  strong: createOverlayStyle(overlayOpacity.strong),
} as const
