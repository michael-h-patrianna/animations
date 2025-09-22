import './ModalCelebrationsFireworksRing.css'

export function ModalCelebrationsFireworksRing() {
  const rings = [
    { id: 0, scale: '3.2', delay: 0 },
    { id: 1, scale: '2.2', delay: 120 },
  ]

  return (
    <div className="pf-celebration">
      <div className="pf-celebration__layer">
        {rings.map((ring) => (
          <span
            key={ring.id}
            className="pf-celebration__ring"
            style={
              {
                '--scale': ring.scale,
                '--delay': `${ring.delay}ms`,
                animation: `celebration-firework-ring 1600ms ease-out var(--delay) forwards`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>
    </div>
  )
}
