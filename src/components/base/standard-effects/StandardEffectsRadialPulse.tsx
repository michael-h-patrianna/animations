import './shared.css'
import './StandardEffectsRadialPulse.css'

export function StandardEffectsRadialPulse() {
  return (

        <div className="standard-radial-pulse" role="img" aria-label="Radial pulse">
          {[0, 1, 2].map((i) => (
            <span key={i} className={`ring ring-${i + 1}`} />
          ))}
          <span className="dot-center" />
        </div>

  )
}
