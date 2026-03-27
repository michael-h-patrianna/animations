/**
 * Performance observability for the animation catalog.
 *
 * Reports Core Web Vitals (FCP, LCP, CLS, INP, TTFB) via the `web-vitals` library.
 * Integrates with the centralized logger — the host application can configure a
 * custom sink to forward metrics to its telemetry pipeline.
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

