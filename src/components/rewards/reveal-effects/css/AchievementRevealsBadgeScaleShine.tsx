import './AchievementRevealsBadgeScaleShine.css'

export function AchievementRevealsBadgeScaleShine() {
  return (
    <div
      className="badge-container"
      data-animation-id="achievement-reveals__badge-scale-shine"
      role="status"
      aria-live="polite"
      aria-label="Achievement unlocked: Level 10 Badge"
    >
      <div className="badge-icon">
        <div className="badge-content">🏆</div>
        <div className="badge-shine-overlay"></div>
      </div>
    </div>
  )
}
