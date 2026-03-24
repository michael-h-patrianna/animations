/**
 * Shared types for all timer-effect animations.
 *
 * Copy-paste files: this file
 * Runtime deps: (none — types only)
 */

// ============================================================================
// Timer Mode & Behavior
// ============================================================================

/**
 * Timing mode for countdown accuracy.
 * - `'visual'`: Uses accumulated interval ticks. Smooth but may drift over minutes.
 * - `'exact'`: Uses `Date.now()` each tick. Precise but may show sub-second jumps after tab backgrounding.
 */
export type TimerMode = 'visual' | 'exact'

/**
 * Behavior when the timer reaches zero.
 * - `'stay'`: Timer remains visible showing 00:00.
 * - `'hide'`: Timer fades out after reaching zero.
 */
export type TimerEndBehavior = 'hide' | 'stay'

// ============================================================================
// Urgency Phases
// ============================================================================

/** Urgency phase — drives color transitions and animation intensity. */
export type TimerPhase = 'normal' | 'warning' | 'critical'

/** Color configuration for urgency phases. */
export interface TimerPhaseColors {
  /** Color when plenty of time remains. */
  normal?: string
  /** Color when time is getting tight. */
  warning?: string
  /** Color in the final seconds. */
  critical?: string
}

/** Seconds-remaining thresholds that trigger phase transitions. */
export interface TimerPhaseThresholds {
  /** Seconds remaining to enter warning phase. */
  warning?: number
  /** Seconds remaining to enter critical phase. */
  critical?: number
}

// ============================================================================
// Shared Props
// ============================================================================

/** Shared props accepted by all timer-effect animations. All optional. */
export interface TimerEffectProps {
  /** Starting countdown value in seconds. Default varies by variant. */
  startSeconds?: number

  /**
   * `'visual'` uses accumulated interval ticks (smooth, may drift).
   * `'exact'` uses Date.now() (precise, survives tab backgrounding).
   * Default: `'visual'`.
   */
  mode?: TimerMode

  /** Colors for each urgency phase. Overrides variant defaults. Takes precedence over flat color props. */
  colors?: TimerPhaseColors

  /** Seconds-remaining thresholds for phase transitions. Overrides variant defaults. Takes precedence over flat threshold props. */
  thresholds?: TimerPhaseThresholds

  /** Background color for the normal (plenty of time) phase. Ignored when `colors` is provided. */
  normalColor?: string

  /** Background color for the warning (time getting low) phase. Ignored when `colors` is provided. */
  warningColor?: string

  /** Background color for the critical (final seconds) phase. Ignored when `colors` is provided. */
  criticalColor?: string

  /** Seconds remaining to enter warning phase. Default varies by variant. Ignored when `thresholds` is provided. */
  warningThreshold?: number

  /** Seconds remaining to enter critical phase. Default varies by variant. Ignored when `thresholds` is provided. */
  criticalThreshold?: number

  /** Called once when the timer reaches zero. */
  onEnd?: () => void

  /** Whether to fade out (`'hide'`) or remain visible (`'stay'`) at zero. Default: `'stay'`. */
  onEndBehavior?: TimerEndBehavior

  /** Override text color for the time display. */
  textColor?: string

  /** Override font size (px) for the time display. */
  fontSize?: number
}

/**
 * Resolves flat color props and flat threshold props into TimerPhaseColors and TimerPhaseThresholds objects.
 * The `colors`/`thresholds` object props take precedence over flat props for backward compatibility.
 */
export function resolveTimerProps(
  props: Pick<TimerEffectProps, 'colors' | 'thresholds' | 'normalColor' | 'warningColor' | 'criticalColor' | 'warningThreshold' | 'criticalThreshold'>,
  defaultWarning: number,
  defaultCritical: number
): { colors: TimerPhaseColors | undefined; warningThreshold: number; criticalThreshold: number } {
  const hasFlat = props.normalColor !== undefined || props.warningColor !== undefined || props.criticalColor !== undefined
  const colors = props.colors ?? (hasFlat ? {
    normal: props.normalColor,
    warning: props.warningColor,
    critical: props.criticalColor,
  } : undefined)

  return {
    colors,
    warningThreshold: props.thresholds?.warning ?? props.warningThreshold ?? defaultWarning,
    criticalThreshold: props.thresholds?.critical ?? props.criticalThreshold ?? defaultCritical,
  }
}

// ============================================================================
// Hook Return Type
// ============================================================================

/** Return value of the `useCountdown` hook. */
export interface CountdownState {
  /** Current seconds remaining (integer, >= 0). */
  seconds: number

  /** Current urgency phase based on configured thresholds. */
  phase: TimerPhase

  /** Normalized progress from 0 (full) to 1 (expired). */
  progress: number

  /** True once the timer has reached zero. */
  isExpired: boolean

  /** True when expired AND `onEndBehavior === 'hide'` AND fade-out delay has elapsed. */
  isHidden: boolean
}
