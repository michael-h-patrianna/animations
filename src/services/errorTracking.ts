/**
 * Structured error tracking with typed error events.
 *
 * Errors are categorized by type using a discriminated union, so consumers
 * (loggers, telemetry sinks, dashboards) can filter and aggregate by category
 * rather than parsing error messages.
 *
 * The host application can attach a custom reporter via the
 * `__PF_ANIM_RUNTIME_ERROR_REPORTER__` window global. In production, all
 * errors are forwarded to this reporter if present.
 */

import type { ErrorInfo } from 'react'
import { assertNever } from '@/utils/assertNever'
import { logger } from '@/services/logger'

// ============================================================================
// Error Event Types
// ============================================================================

/** An animation group failed to load (network error, chunk parse failure). */
interface GroupLoadFailure {
  type: 'GROUP_LOAD_FAILURE'
  groupId: string
  cause: Error
  timestamp: number
}

/** A React component crashed during render (caught by ErrorBoundary). */
interface AnimationRenderCrash {
  type: 'ANIMATION_RENDER_CRASH'
  animationId: string
  cause: Error
  componentStack?: string
  timestamp: number
}

/** Source code for the code viewer failed to load. */
interface SourceLoadFailure {
  type: 'SOURCE_LOAD_FAILURE'
  animationId: string
  cause: Error
  timestamp: number
}

/** Animation metadata failed runtime validation (dev-mode only). */
interface MetadataValidationError {
  type: 'METADATA_VALIDATION_ERROR'
  filePath: string
  violations: string[]
  timestamp: number
}

/**
 * Discriminated union of all application error events.
 * Each error type carries structured context for debugging and aggregation.
 *
 * @example
 * ```typescript
 * reportAppError({
 *   type: 'GROUP_LOAD_FAILURE',
 *   groupId: 'modal-base-framer',
 *   cause: new Error('Failed to fetch'),
 *   timestamp: Date.now(),
 * })
 * ```
 */
export type AppError =
  | GroupLoadFailure
  | AnimationRenderCrash
  | SourceLoadFailure
  | MetadataValidationError

// ============================================================================
// Host Reporter Bridge
// ============================================================================

type RuntimeErrorReporter = (error: Error, errorInfo: ErrorInfo) => void

type WindowWithRuntimeReporter = Window & {
  __PF_ANIM_RUNTIME_ERROR_REPORTER__?: RuntimeErrorReporter
}

const getRuntimeErrorReporter = (): RuntimeErrorReporter | null => {
  if (typeof window === 'undefined') return null

  const reporter = (window as WindowWithRuntimeReporter).__PF_ANIM_RUNTIME_ERROR_REPORTER__
  return typeof reporter === 'function' ? reporter : null
}

function forwardToHostReporter(cause: Error, componentStack: string | null): void {
  if (!import.meta.env.PROD) return

  const reporter = getRuntimeErrorReporter()
  if (!reporter) return

  try {
    reporter(cause, { componentStack })
  } catch (reportError) {
    logger.error('Runtime error reporter failed:', reportError)
  }
}

// ============================================================================
// Structured Error Reporting
// ============================================================================

/** Formats a structured error event into a human-readable log message. */
function formatErrorMessage(error: AppError): string {
  switch (error.type) {
    case 'GROUP_LOAD_FAILURE':
      return `[${error.type}] Group "${error.groupId}" failed to load: ${error.cause.message}`
    case 'ANIMATION_RENDER_CRASH':
      return `[${error.type}] Animation "${error.animationId}" crashed: ${error.cause.message}`
    case 'SOURCE_LOAD_FAILURE':
      return `[${error.type}] Source for "${error.animationId}" failed to load: ${error.cause.message}`
    case 'METADATA_VALIDATION_ERROR':
      return `[${error.type}] Invalid metadata in "${error.filePath}": ${error.violations.join('; ')}`
    default:
      return assertNever(error)
  }
}

/**
 * Reports a structured error event.
 *
 * In development: logs the formatted message and structured data via the logger.
 * In production: logs via the logger sink (which the host app can configure)
 * and forwards render crashes to the host reporter attached at
 * `window.__PF_ANIM_RUNTIME_ERROR_REPORTER__`.
 *
 * The host reporter forwarding is the *only* integration point into the host
 * application's telemetry — there is no separate public API. Callers must use
 * this function, not call the host reporter directly, so every forward is
 * accompanied by a logger entry.
 */
export function reportAppError(error: AppError): void {
  logger.error(formatErrorMessage(error), { event: error })

  if (error.type === 'ANIMATION_RENDER_CRASH') {
    forwardToHostReporter(error.cause, error.componentStack ?? null)
  }
}
