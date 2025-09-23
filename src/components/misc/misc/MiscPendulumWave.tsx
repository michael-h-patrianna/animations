import './MiscPendulumWave.css'

export function MiscPendulumWave() {
  return (
    <div className="misc-pendulum" role="img" aria-label="Pendulum wave">
      <div className="bar">
        {Array.from({ length: 13 }).map((_, i) => (
          <div key={i} className={`pendulum d-${i}`}>
            <span className="bob" />
          </div>
        ))}
      </div>
    </div>
  )
}
