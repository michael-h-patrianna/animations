/**
 * Milestone Markers Progress Bar
 *
 * Progress bar with diamond-shaped milestone markers that light up with ring
 * pulse effects as progress crosses their positions. Milestones are
 * configurable — pass custom positions and labels.
 *
 * @example
 * ```tsx
 * <ProgressBarsProgressMilestones
 *   progress={0.6}
 *   milestones={[
 *     { position: 0, label: 'Start' },
 *     { position: 0.5, label: 'Half' },
 *     { position: 1, label: 'Done' },
 *   ]}
 * />
 * ```
 *
 * Styleable CSS custom properties:
 * - `--milestone-track-color`    — track background
 * - `--milestone-fill-from`      — fill gradient start
 * - `--milestone-fill-to`        — fill gradient end
 * - `--milestone-marker-color`   — inactive marker color
 * - `--milestone-active-color`   — active marker color
 * - `--milestone-label-color`    — label text color
 *
 * Files to copy: this file + ProgressBarsProgressMilestones.module.css + ../SharedTypes.ts
 */
import { easeOut, useReducedMotion } from 'motion/react'
import * as m from 'motion/react-m'
import { useMemo } from 'react'
import type {
  MilestoneProgressBarProps,
  MilestoneConfig,
} from '@/components/progress/progress-bars/SharedTypes'
import styles from './ProgressBarsProgressMilestones.module.css'

const DEFAULT_MILESTONES: MilestoneConfig[] = [
  { position: 0, label: 'Start' },
  { position: 0.25, label: '25%' },
  { position: 0.5, label: '50%' },
  { position: 0.75, label: '75%' },
  { position: 1, label: '100%' },
]

export function ProgressBarsProgressMilestones({
  progress,
  milestones = DEFAULT_MILESTONES,
  className,
  style,
}: MilestoneProgressBarProps) {
  const prefersReducedMotion = useReducedMotion()
  const displayProgress = progress ?? 0

  const activatedSet = useMemo(
    () => new Set(milestones.flatMap((ms, i) => (displayProgress >= ms.position ? [i] : []))),
    [displayProgress, milestones]
  )

  const markerVariants = prefersReducedMotion
    ? {
        inactive: {
          opacity: 0.6,
          background: 'var(--milestone-marker-color, var(--pf-anim-cyan-soft))',
        },
        active: {
          opacity: 1,
          background: 'var(--milestone-active-color, var(--pf-anim-cyan-light))',
          transition: { duration: 0.15 },
        },
      }
    : {
        inactive: {
          scale: 0.5,
          opacity: 0.6,
          background: 'var(--milestone-marker-color, var(--pf-anim-cyan-soft))',
        },
        active: {
          scale: 1,
          opacity: 1,
          background: [
            'var(--milestone-marker-color, var(--pf-anim-cyan-soft))',
            'var(--milestone-active-color, var(--pf-anim-cyan-light))',
          ],
          transition: { duration: 0.4, ease: [0.34, 1.56, 0.64, 1] as const },
        },
      }

  const ringVariants = {
    inactive: { scale: 0.8, opacity: 0 },
    active: prefersReducedMotion
      ? { opacity: 0, transition: { duration: 0.1 } }
      : {
          scale: [0.8, 1.5, 2],
          opacity: [0, 1, 0],
          transition: { duration: 0.6, times: [0, 0.3, 1], ease: easeOut },
        },
  }

  const labelVariants = {
    inactive: { opacity: 0.5, color: 'var(--milestone-label-color, var(--pf-anim-cyan-muted))' },
    active: {
      opacity: 1,
      color: 'var(--milestone-active-color, var(--pf-anim-cyan-light))',
      transition: { duration: prefersReducedMotion ? 0.15 : 0.3, ease: easeOut },
    },
  }

  return (
    <div
      className={`${styles['pf-progress-milestones-fm']}${className ? ` ${className}` : ''}`}
      style={style}
      data-animation-id="progress-bars__progress-milestones"
      data-testid="progress-milestones"
    >
      <div className="track-container" style={{ position: 'relative' }}>
        <div className={styles['pf-progress-track-fm']}>
          <div
            className={styles['pf-progress-fill-fm']}
            data-testid="progress-fill"
            style={{ transformOrigin: 'left center', transform: `scaleX(${displayProgress})` }}
          />
        </div>

        {milestones.map((ms, i) => (
          <div
            key={i}
            className="milestone-container"
            style={{
              position: 'absolute',
              left: `${ms.position * 100}%`,
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: '20px',
              height: '20px',
            }}
          >
            <m.div
              className="milestone-marker"
              variants={markerVariants}
              initial="inactive"
              animate={activatedSet.has(i) ? 'active' : 'inactive'}
              style={{
                position: 'absolute',
                inset: 0,
                border: activatedSet.has(i)
                  ? '2px solid var(--milestone-active-color, var(--pf-anim-cyan-light-80))'
                  : '2px solid var(--milestone-marker-color, var(--pf-anim-cyan-muted-50))',
                borderRadius: '50%',
                transform: 'rotate(45deg)',
              }}
            >
              <m.div
                style={{
                  position: 'absolute',
                  inset: '20%',
                  background:
                    'radial-gradient(circle, var(--milestone-active-color, var(--pf-anim-cyan-light)) 0%, transparent 100%)',
                  borderRadius: '50%',
                  opacity: activatedSet.has(i) ? 1 : 0,
                  transition: 'opacity 0.3s ease',
                }}
              />
            </m.div>

            {activatedSet.has(i) && (
              <m.div
                variants={ringVariants}
                initial="inactive"
                animate="active"
                style={{
                  position: 'absolute',
                  inset: '-10px',
                  border: '2px solid var(--milestone-active-color, var(--pf-anim-cyan-light-80))',
                  borderRadius: '50%',
                  pointerEvents: 'none',
                }}
              />
            )}
          </div>
        ))}

        <div
          className="label-container"
          style={{
            position: 'absolute',
            inset: 0,
            top: '100%',
            marginTop: '8px',
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '10px',
            pointerEvents: 'none',
          }}
        >
          {milestones.map((ms, i) => (
            <m.span
              key={i}
              variants={labelVariants}
              initial="inactive"
              animate={activatedSet.has(i) ? 'active' : 'inactive'}
              style={{
                position: 'absolute',
                left: `${ms.position * 100}%`,
                transform: 'translateX(-50%)',
              }}
            >
              {ms.label ?? `${Math.round(ms.position * 100)}%`}
            </m.span>
          ))}
        </div>
      </div>
    </div>
  )
}
