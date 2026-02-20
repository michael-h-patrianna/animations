import './ModalCelebrationsFireworksTriple.css'

const fireworkColors = ['var(--pf-anim-firework-gold)', 'var(--pf-anim-firework-pink)', 'var(--pf-anim-firework-cyan)', 'var(--pf-anim-green)']

/**
 *
 */
export function ModalCelebrationsFireworksTriple() {
  const fireworks = fireworkColors.map((color, index) => ({
    id: index,
    color,
    size: `${18 + index * 8}px`,
    scale: `${1.6 + index * 0.4}`,
    delay: index * 160,
  }))

  return (
    <div className="pf-celebration">
      <div className="pf-celebration__layer">
        {fireworks.map((firework) => (
          <span
            key={firework.id}
            className="pf-celebration__firework"
            style={
              {
                '--size': firework.size,
                '--scale': firework.scale,
                '--delay': `${firework.delay}ms`,
                '--color': firework.color,
                borderColor: firework.color,
                animation: `celebration-firework-pop 1600ms ease-out var(--delay) forwards`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>
    </div>
  )
}

