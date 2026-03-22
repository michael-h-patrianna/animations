/**
 * Questline Royal Path
 *
 * Premium mission-track progress bar with milestone reward nodes and
 * a grand final vault reward. Milestones are configurable — pass custom
 * positions, titles, rewards, and icons.
 *
 * @example
 * ```tsx
 * <ProgressBarsQuestlineRoyal
 *   progress={0.45}
 *   title="Celestial Expedition"
 *   subtitle="Legacy Mission Path"
 *   milestones={[
 *     { position: 0.25, label: 'Scout', icon: '/reward.png' },
 *     { position: 0.75, label: 'Boss' },
 *   ]}
 * />
 * ```
 *
 * Styleable CSS custom properties:
 * - `--quest-bg`            — container background
 * - `--quest-track-color`   — track base color
 * - `--quest-fill-color`    — fill color
 * - `--quest-text-color`    — text color
 * - `--quest-accent`        — accent/glow color
 *
 * Files to copy: this file + ProgressBarsQuestlineRoyal.css + ../SharedTypes.ts + ../SharedDemoLoop.ts
 */
import * as m from 'motion/react-m'
import { memo, useMemo } from 'react'
import type { ProgressBarProps, MilestoneConfig } from '../SharedTypes'
import { useDemoProgress } from '../SharedDemoLoop'

interface QuestMilestone extends MilestoneConfig {
  /** Step numeral (e.g. "I", "II"). Auto-generated if omitted. */
  step?: string
  /** Reward text shown in status line. */
  reward?: string
}

interface QuestlineRoyalProps extends ProgressBarProps {
  /** Main quest title. Default: "Celestial Expedition". */
  title?: string
  /** Subtitle / eyebrow text. Default: "Legacy Mission Path". */
  subtitle?: string
  /** Milestone nodes along the track. */
  milestones?: QuestMilestone[]
  /** Image URL for milestone emblem icons. Fallback: SVG shield. */
  milestoneIcon?: string
  /** Image URL for grand reward chest. Fallback: SVG chest. */
  finalRewardIcon?: string
}

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII']
const DEFAULT_MILESTONES: QuestMilestone[] = [
  { position: 0.14, step: 'I', label: 'Scout Intel', reward: '+1 Relic Key' },
  { position: 0.34, step: 'II', label: 'Secure Relic', reward: '+150 XP' },
  { position: 0.57, step: 'III', label: 'Defeat Warden', reward: '+Epic Rune' },
  { position: 0.79, step: 'IV', label: 'Clear Vault Gate', reward: '+2 Tickets' },
]

const TRACK_LEFT_INSET = 6
const TRACK_RIGHT_INSET = 44

function toTrackLeft(p: number) {
  const clamped = Math.max(0, Math.min(1, p))
  const offset = TRACK_LEFT_INSET - (TRACK_LEFT_INSET + TRACK_RIGHT_INSET) * clamped
  return { left: `${100 * clamped}%`, marginLeft: offset }
}

function ShieldFallback() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" opacity="0.85">
      <path d="M12 2L4 5v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V5z" />
    </svg>
  )
}

function ChestFallback() {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor" opacity="0.85">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M2 11h20M12 11v4" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
      <path d="M5 7V5a7 7 0 0 1 14 0v2" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

function ProgressBarsQuestlineRoyalComponent({
  progress,
  title = 'Celestial Expedition',
  subtitle = 'Legacy Mission Path',
  milestones = DEFAULT_MILESTONES,
  milestoneIcon,
  finalRewardIcon,
  className,
  style,
}: QuestlineRoyalProps) {
  const displayProgress = useDemoProgress(progress, { duration: 7200, pause: 1500 })

  const unlockedCount = useMemo(
    () => milestones.filter((ms) => displayProgress >= ms.position).length,
    [displayProgress, milestones]
  )
  const nextMilestone = useMemo(
    () => milestones.find((ms) => displayProgress < ms.position) ?? null,
    [displayProgress, milestones]
  )
  const progressPercent = Math.round(displayProgress * 100)
  const grandRewardUnlocked = unlockedCount === milestones.length
  const distanceToNext = nextMilestone
    ? Math.max(1, Math.ceil((nextMilestone.position - displayProgress) * 100))
    : 0

  return (
    <div
      className={`pf-progress-questline-royal${className ? ` ${className}` : ''}`}
      style={style}
      data-animation-id="progress-bars__questline-royal"
    >
      <div className="questline-royal__header">
        <div className="questline-royal__heading">
          <p className="questline-royal__eyebrow">{subtitle}</p>
          <h3 className="questline-royal__title">{title}</h3>
        </div>
        <div className="questline-royal__status-panel">
          <span className="questline-royal__status-percent">{progressPercent}%</span>
          <span className="questline-royal__status-copy">
            {nextMilestone !== null
              ? `Next reward: ${nextMilestone.reward ?? nextMilestone.label ?? ''} in ${distanceToNext}%`
              : 'Grand vault reward unlocked'}
          </span>
        </div>
      </div>

      <div className="questline-royal__track-shell">
        <div className="questline-royal__track-base" />
        <m.div
          className="questline-royal__track-fill"
          style={{ transformOrigin: 'left center', transform: `scaleX(${displayProgress})`, animation: 'none' }}
        />

        <div className="questline-royal__progress-core-anchor" style={{ ...toTrackLeft(displayProgress) }}>
          <m.div
            className="questline-royal__progress-core"
            animate={{ scale: [1, 1.15, 1], opacity: [0.75, 1, 0.75] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
            style={{ animation: 'none' }}
          />
        </div>

        {milestones.map((ms, i) => {
          const unlocked = displayProgress >= ms.position
          const isNext = !unlocked && nextMilestone?.position === ms.position

          return (
            <div
              key={i}
              className={`questline-royal__node${unlocked ? ' is-unlocked' : ''}${isNext ? ' is-next' : ''}`}
              style={{ ...toTrackLeft(ms.position) }}
            >
              <m.div
                className={`questline-royal__node-ring${isNext ? ' is-active' : ''}`}
                animate={
                  unlocked || isNext
                    ? { scale: [1, unlocked ? 1.18 : 1.12, 1], opacity: [unlocked ? 0.42 : 0.32, unlocked ? 0.78 : 0.7, unlocked ? 0.42 : 0.32] }
                    : { scale: 1, opacity: 0.2 }
                }
                transition={{
                  duration: 1.4,
                  repeat: unlocked || isNext ? Infinity : 0,
                  ease: 'easeInOut',
                }}
                style={{ animation: 'none' }}
              />

              {milestoneIcon !== undefined ? (
                <m.img
                  className="questline-royal__node-icon"
                  src={milestoneIcon}
                  alt=""
                  aria-hidden="true"
                  animate={
                    unlocked
                      ? { scale: [1, 1.08, 1], y: [0, -2, 0] }
                      : isNext
                        ? { scale: [1, 1.04, 1], y: [0, -1, 0] }
                        : { scale: 0.95, y: 0 }
                  }
                  transition={{ duration: unlocked ? 1 : 1.5, repeat: unlocked || isNext ? Infinity : 0, ease: 'easeInOut' }}
                  style={{ animation: 'none' }}
                />
              ) : (
                <m.span
                  className="questline-royal__node-icon questline-royal__node-icon--fallback"
                  animate={
                    unlocked
                      ? { scale: [1, 1.08, 1], y: [0, -2, 0] }
                      : isNext
                        ? { scale: [1, 1.04, 1], y: [0, -1, 0] }
                        : { scale: 0.95, y: 0 }
                  }
                  transition={{ duration: unlocked ? 1 : 1.5, repeat: unlocked || isNext ? Infinity : 0, ease: 'easeInOut' }}
                  style={{ animation: 'none' }}
                >
                  <ShieldFallback />
                </m.span>
              )}

              <span className="questline-royal__node-step">{ms.step ?? ROMAN[i] ?? `${i + 1}`}</span>
            </div>
          )
        })}

        <div
          className={`questline-royal__grand-reward${grandRewardUnlocked ? ' is-unlocked' : ''}`}
          style={{ ...toTrackLeft(1) }}
        >
          <m.div
            className="questline-royal__grand-ring"
            animate={
              grandRewardUnlocked
                ? { scale: [1, 1.22, 1], opacity: [0.5, 0.9, 0.5] }
                : { scale: [1, 1.08, 1], opacity: [0.28, 0.5, 0.28] }
            }
            transition={{ duration: grandRewardUnlocked ? 1 : 1.8, repeat: Infinity, ease: 'easeInOut' }}
            style={{ animation: 'none' }}
          />

          {finalRewardIcon !== undefined ? (
            <m.img
              className="questline-royal__grand-icon"
              src={finalRewardIcon}
              alt=""
              aria-hidden="true"
              animate={
                grandRewardUnlocked
                  ? { scale: [1, 1.12, 1], y: [0, -4, 0] }
                  : { scale: [1, 1.03, 1], y: [0, -1, 0] }
              }
              transition={{ duration: grandRewardUnlocked ? 0.9 : 2.2, repeat: Infinity, ease: 'easeInOut' }}
              style={{ animation: 'none' }}
            />
          ) : (
            <m.span
              className="questline-royal__grand-icon questline-royal__grand-icon--fallback"
              animate={
                grandRewardUnlocked
                  ? { scale: [1, 1.12, 1], y: [0, -4, 0] }
                  : { scale: [1, 1.03, 1], y: [0, -1, 0] }
              }
              transition={{ duration: grandRewardUnlocked ? 0.9 : 2.2, repeat: Infinity, ease: 'easeInOut' }}
              style={{ animation: 'none' }}
            >
              <ChestFallback />
            </m.span>
          )}
        </div>
      </div>
    </div>
  )
}

export const ProgressBarsQuestlineRoyal = memo(ProgressBarsQuestlineRoyalComponent)
