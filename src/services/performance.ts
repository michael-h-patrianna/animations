/**
 * Performance observability for the animation catalog.
 *
 * Provides two layers of monitoring:
 * 1. **Web Vitals**: Reports Core Web Vitals (FCP, LCP, CLS, INP, TTFB) via the
 *    `web-vitals` library. These are the metrics that matter for real-user experience.
 * 2. **Animation frame timing**: A React hook that monitors `requestAnimationFrame`
 *    timing to detect dropped frames during animations.
 *
 * Both layers integrate with the centralized logger — the host application can
 * configure a custom sink to forward metrics to its telemetry pipeline.
 */

import { logger } from '@/services/logger'

// ============================================================================
// Web Vitals
// ============================================================================

/**
 * Reports Core Web Vitals to the logger.
 * Call once at app startup (e.g., in main.tsx).
 *
 * Metrics reported: FCP, LCP, CLS, INP, TTFB.
 * In production, the host app's logger sink receives these for aggregation.
 *
 * @example
 * ```typescript
 * // In main.tsx
 * import { reportWebVitals } from '@/services/performance'
 * reportWebVitals()
 * ```
 */
export async function reportWebVitals(): Promise<void> {
  // Dynamic import keeps web-vitals out of the critical path.
  // Tree-shaken in production if reportWebVitals is never called.
  const { onCLS, onFCP, onINP, onLCP, onTTFB } = await import('web-vitals')

  const report = (metric: { name: string; value: number; rating: string }) => {
    logger.info(`[WebVital] ${metric.name}: ${metric.value.toFixed(2)} (${metric.rating})`)
  }

  onCLS(report)
  onFCP(report)
  onINP(report)
  onLCP(report)
  onTTFB(report)
}

// ============================================================================
// Animation Performance Marks
// ============================================================================

/**
 * Marks the start of an animation for performance measurement.
 * Pair with `markAnimationEnd` to measure duration.
 *
 * Uses the Performance API's User Timing Level 2 marks, which appear
 * in browser DevTools Performance panel for visual debugging.
 */
export function markAnimationStart(animationId: string): void {
  performance.mark(`animation-start:${animationId}`)
}

/**
 * Marks the end of an animation and measures the duration since `markAnimationStart`.
 * Returns the duration in milliseconds, or `undefined` if the start mark was missing.
 *
 * The measurement appears in DevTools Performance panel as a named entry.
 */
export function markAnimationEnd(animationId: string): number | undefined {
  const startMark = `animation-start:${animationId}`
  const endMark = `animation-end:${animationId}`
  const measureName = `animation:${animationId}`

  try {
    performance.mark(endMark)
    const measure = performance.measure(measureName, startMark, endMark)
    // Clean up marks to avoid accumulation in long-running sessions
    performance.clearMarks(startMark)
    performance.clearMarks(endMark)
    performance.clearMeasures(measureName)
    return measure.duration
  } catch {
    // Start mark missing — animation was interrupted or markStart was never called
    return undefined
  }
}
