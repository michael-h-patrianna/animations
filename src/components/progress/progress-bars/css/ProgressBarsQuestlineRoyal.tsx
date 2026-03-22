/**
 * Questline Royal Path (CSS variant)
 *
 * Files to copy: this file + ProgressBarsQuestlineRoyal.css + ../SharedTypes.ts + ../SharedDemoLoop.ts
 */
import { memo, useMemo } from 'react'
import type { ProgressBarProps, MilestoneConfig } from '../SharedTypes'
import { useDemoProgress } from '../SharedDemoLoop'
import './ProgressBarsQuestlineRoyal.css'

interface QuestMilestone extends MilestoneConfig {
  step?: string
  reward?: string
}

interface QuestlineRoyalProps extends ProgressBarProps {
  title?: string
  subtitle?: string
  milestones?: QuestMilestone[]
  milestoneIcon?: string
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
        <div
          className="questline-royal__track-fill"
          style={{ transform: `scaleX(${displayProgress})` }}
        />

        <div className="questline-royal__progress-core-anchor" style={{ ...toTrackLeft(displayProgress) }}>
          <div className="questline-royal__progress-core" />
        </div>

        {milestones.map((ms, i) => {
          const unlocked = displayProgress >= ms.position
          return (
            <div
              key={i}
              className={`questline-royal__node${unlocked ? ' is-unlocked' : ''}`}
              style={{ ...toTrackLeft(ms.position) }}
            >
              <div className="questline-royal__node-ring" />
              {milestoneIcon !== undefined ? (
                <img className="questline-royal__node-icon" src={milestoneIcon} alt="" aria-hidden="true" />
              ) : (
                <span className="questline-royal__node-icon"><ShieldFallback /></span>
              )}
              <span className="questline-royal__node-step">{ms.step ?? ROMAN[i] ?? `${i + 1}`}</span>
            </div>
          )
        })}

        <div
          className={`questline-royal__grand-reward${grandRewardUnlocked ? ' is-unlocked' : ''}`}
          style={{ ...toTrackLeft(1) }}
        >
          <div className="questline-royal__grand-ring" />
          {finalRewardIcon !== undefined ? (
            <img className="questline-royal__grand-icon" src={finalRewardIcon} alt="" aria-hidden="true" />
          ) : (
            <span className="questline-royal__grand-icon"><ChestFallback /></span>
          )}
        </div>
      </div>
    </div>
  )
}

export const ProgressBarsQuestlineRoyal = memo(ProgressBarsQuestlineRoyalComponent)
