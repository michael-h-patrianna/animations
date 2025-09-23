import './MiscSequentialPulse.css'

export function MiscSequentialPulse() {
  const count = 16
  return (
    <div className="misc-seq" role="img" aria-label="Sequential pulse">
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} className={`dot i-${i}`}>
          <span className="blip" />
        </span>
      ))}
      <span className="dot-center" />
    </div>
  )
}
