import './modal-celebrations.css';

const confettiWarmColors = ['#ff5981', '#ffce1a', '#ffcaca', '#ffd966'];

// Utility function to generate random number between min and max
const randBetween = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

export function ModalCelebrationsConfettiFan() {
  const particles = Array.from({ length: 28 }, (_, i) => {
    const tx = randBetween(-160, 160);
    const ty = randBetween(120, 180);
    const rot = randBetween(-140, 140);
    const delay = i * 14;
    const duration = 820;
    
    return {
      id: i,
      color: confettiWarmColors[i % confettiWarmColors.length],
      tx,
      ty,
      rot,
      delay,
      duration,
    };
  });

  return (
    <div className="pf-celebration">
      <div className="pf-celebration__layer">
        {particles.map((particle) => (
          <span
            key={particle.id}
            className="pf-celebration__confetti"
            style={{
              left: '50%',
              top: '55%',
              '--tx': `${particle.tx}px`,
              '--ty': `${particle.ty}px`,
              '--rot': `${particle.rot}deg`,
              '--delay': `${particle.delay}ms`,
              '--duration': `${particle.duration}ms`,
              background: particle.color,
              animation: `celebration-confetti-fan var(--duration) ease-out var(--delay) forwards`,
            } as React.CSSProperties}
          />
        ))}
      </div>
    </div>
  );
}
