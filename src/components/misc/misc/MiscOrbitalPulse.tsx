import './MiscOrbitalPulse.css'

export function MiscOrbitalPulse() {
  return (
    <div className="misc-orbital-pulse" role="img" aria-label="Orbital pulse">
      {[...Array(5)].map((_, r) => (
        <div key={r} className={`orbit orbit-${r + 1}`}>
          {[...Array(12 + r * 4)].map((_, i) => (
            <span key={i} className="dot" />
          ))}
        </div>
      ))}
      <span className="dot-center" />
    </div>
  )
}
