/**
 * Badge showing render timing for the selected animation.
 *
 * Color-coded by frame budget:
 * - Green: <4ms (well within 16.67ms frame budget)
 * - Yellow: 4-16ms (approaching frame budget)
 * - Red: >16ms (exceeds frame budget, will cause dropped frames)
 *
 * Displays inline next to the tier badge in the card footer.
 * Visible when the profiler toggle is enabled in the inspector panel.
 */

import { Tooltip } from '@/demo-ui/components/ui/Tooltip'
import type { RenderProfile } from '@/hooks/useRenderProfile'

interface RenderTimeBadgeProps {
  profile: RenderProfile | null
}

/** Render time badge with tooltip — hidden when profiler is off (profile is null). */
export function RenderTimeBadge({ profile }: RenderTimeBadgeProps) {
  if (!profile) return null

  const { actualDuration, baseDuration } = profile
  const color =
    actualDuration < 4
      ? 'var(--text-success, #22c55e)'
      : actualDuration < 16
        ? 'var(--text-warning, #eab308)'
        : 'var(--text-danger, #ef4444)'

  const tooltipContent =
    `Render: ${actualDuration.toFixed(1)}ms actual, ${baseDuration.toFixed(1)}ms base. ` +
    (actualDuration < 4
      ? 'Well within the 16.67ms frame budget.'
      : actualDuration < 16
        ? 'Approaching the 16.67ms frame budget.'
        : 'Exceeds the 16.67ms frame budget \u2014 may cause dropped frames.')

  return (
    <Tooltip content={tooltipContent} position="top">
      <span
        className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-mono tabular-nums"
        style={{ color, border: `1px solid ${color}`, opacity: 0.8 }}
        data-testid="render-time-badge"
      >
        {actualDuration.toFixed(1)}ms
      </span>
    </Tooltip>
  )
}
