import './MiscPulsingGrid.css'

export function MiscPulsingGrid() {
  const size = 5
  return (
    <div className="misc-grid" role="img" aria-label="Pulsing grid">
      {Array.from({ length: size }).map((_, r) => (
        <div key={r} className={`row r-${r}`}>
          {Array.from({ length: size }).map((_, c) => (
            <span key={c} className={`dot c-${c}`} />
          ))}
        </div>
      ))}
    </div>
  )
}
