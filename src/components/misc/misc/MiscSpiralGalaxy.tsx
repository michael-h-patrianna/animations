import './MiscSpiralGalaxy.css'

export function MiscSpiralGalaxy() {
  const count = 60
  return (
    <div className="misc-spiral" role="img" aria-label="Spiral galaxy">
      <div className="wheel">
        {Array.from({ length: count }).map((_, i) => (
          <span key={i} className={`dot i-${i}`} />
        ))}
      </div>
      <span className="dot-center" />
    </div>
  )
}
