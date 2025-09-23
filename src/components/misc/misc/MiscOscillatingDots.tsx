import './MiscOscillatingDots.css'

export function MiscOscillatingDots() {
  return (
    <div className="misc-osc" role="img" aria-label="Oscillating dots">
      {Array.from({ length: 5 }).map((_, row) => (
        <div key={row} className={`row r-${row}`}>
          {Array.from({ length: 18 }).map((_, i) => (
            <span key={i} className={`dot i-${i}`} />
          ))}
        </div>
      ))}
    </div>
  )
}
