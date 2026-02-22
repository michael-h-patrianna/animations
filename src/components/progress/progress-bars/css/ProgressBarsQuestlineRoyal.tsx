import { memo, useEffect, useMemo, useState } from 'react'
import { questlineRoyalFinalChest, questlineRoyalMilestoneEmblem } from '@/assets'
import './ProgressBarsQuestlineRoyal.css'

type QuestMilestone = {
  id: string
  step: string
  title: string
  reward: string
  at: number
}

const MILESTONES: QuestMilestone[] = [
  { id: 'intel', step: 'I', title: 'Scout Intel', reward: '+1 Relic Key', at: 0.14 },
  { id: 'relic', step: 'II', title: 'Secure Relic', reward: '+150 XP', at: 0.34 },
  { id: 'warden', step: 'III', title: 'Defeat Warden', reward: '+Epic Rune', at: 0.57 },
  { id: 'gate', step: 'IV', title: 'Clear Vault Gate', reward: '+2 Tickets', at: 0.79 },
]

const QUEST_LOOP_MS = 7200
const TRACK_LEFT_INSET_PX = 6
const TRACK_RIGHT_INSET_PX = 44

function toTrackLeft(progress: number) {
  const clampedProgress = Math.max(0, Math.min(1, progress))
  return `calc(${TRACK_LEFT_INSET_PX}px + (100% - ${TRACK_LEFT_INSET_PX + TRACK_RIGHT_INSET_PX}px) * ${clampedProgress})`
}

// eslint-disable-next-line max-lines-per-function
function ProgressBarsQuestlineRoyalComponent() {
  const [progress, setProgress] = useState(0)
  const [completionPulseKey, setCompletionPulseKey] = useState(0)

  useEffect(() => {
    let rafId = 0
    let previousTime = performance.now()
    let progressValue = 0

    const frame = (now: number) => {
      const elapsed = now - previousTime
      previousTime = now

      const nextProgress = progressValue + elapsed / QUEST_LOOP_MS
      const completedLoops = Math.floor(nextProgress)
      progressValue = nextProgress % 1

      if (completedLoops > 0) {
        setCompletionPulseKey((value) => value + completedLoops)
      }

      setProgress(progressValue)
      rafId = window.requestAnimationFrame(frame)
    }

    rafId = window.requestAnimationFrame(frame)

    return () => {
      window.cancelAnimationFrame(rafId)
    }
  }, [])

  const unlockedCount = useMemo(
    () => MILESTONES.filter((milestone) => progress >= milestone.at).length,
    [progress]
  )
  const nextMilestone = useMemo(
    () => MILESTONES.find((milestone) => progress < milestone.at) ?? null,
    [progress]
  )
  const progressPercent = Math.round(progress * 100)
  const grandRewardUnlocked = unlockedCount === MILESTONES.length
  const distanceToNext = nextMilestone
    ? Math.max(1, Math.ceil((nextMilestone.at - progress) * 100))
    : 0

  return (
    <div
      className="pf-progress-demo pf-progress-questline-royal pf-progress-questline-royal--css"
      data-animation-id="progress-bars__questline-royal"
    >
      <div className="questline-royal__header">
        <div className="questline-royal__heading">
          <p className="questline-royal__eyebrow">Legacy Mission Path</p>
          <h3 className="questline-royal__title">Celestial Expedition</h3>
        </div>

        <div className="questline-royal__status-panel">
          <span className="questline-royal__status-percent">{progressPercent}%</span>
          <span className="questline-royal__status-copy">
            {nextMilestone
              ? `Next reward: ${nextMilestone.reward} in ${distanceToNext}%`
              : 'Grand vault reward unlocked'}
          </span>
        </div>
      </div>

      <div className="questline-royal__track-shell">
        <div className="questline-royal__track-base" />
        <div
          className="questline-royal__track-fill"
          style={{
            transformOrigin: 'left center',
            transform: `scaleX(${progress})`,
          }}
        />

        <div className="questline-royal__progress-core" style={{ left: toTrackLeft(progress) }} />

        {completionPulseKey > 0 && (
          <div
            key={completionPulseKey}
            className="questline-royal__completion-sweep questline-royal__completion-sweep--css"
          />
        )}

        {MILESTONES.map((milestone) => {
          const unlocked = progress >= milestone.at
          const isNext = !unlocked && nextMilestone?.id === milestone.id

          return (
            <div
              key={milestone.id}
              className={`questline-royal__node${unlocked ? ' is-unlocked' : ''}${isNext ? ' is-next' : ''}`}
              style={{ left: toTrackLeft(milestone.at) }}
            >
              <div className={`questline-royal__node-ring${isNext ? ' is-active' : ''}`} />

              <img
                className="questline-royal__node-icon"
                src={questlineRoyalMilestoneEmblem}
                alt=""
                aria-hidden="true"
              />

              <span className="questline-royal__node-step">{milestone.step}</span>
            </div>
          )
        })}

        <div
          className={`questline-royal__grand-reward${grandRewardUnlocked ? ' is-unlocked' : ''}`}
          style={{ left: toTrackLeft(1) }}
        >
          <div className="questline-royal__grand-ring" />

          <img
            className="questline-royal__grand-icon"
            src={questlineRoyalFinalChest}
            alt=""
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  )
}

export const ProgressBarsQuestlineRoyal = memo(ProgressBarsQuestlineRoyalComponent)
