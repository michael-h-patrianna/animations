import './modal-celebrations.css';

const confettiColors = ['#ff5981', '#c6ff77', '#47fff4', '#ffce1a', '#ecc3ff'];

// Utility function to generate random number between min and max
const randBetween = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

export function ModalCelebrationsConfettiRain() {
  const particles = Array.from({ length: 28 }, (_, i) => {
    const left = randBetween(10, 90);
    const dx = 0;
    const drift = randBetween(-40, 40);
    const rot = randBetween(-90, 90);
    const delay = randBetween(0, 400);
    const duration = 1200;
    
    return {
      id: i,
      color: confettiColors[i % confettiColors.length],
      left,
      dx,
      drift,
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
              left: `${particle.left}%`,
              top: '-10%',
              '--dx': `${particle.dx}px`,
              '--drift': `${particle.drift}px`,
              '--rot': `${particle.rot}deg`,
              '--delay': `${particle.delay}ms`,
              '--duration': `${particle.duration}ms`,
              background: particle.color,
              animation: `celebration-confetti-rain var(--duration) ease-out var(--delay) forwards`,
            } as React.CSSProperties}
          />
        ))}
      </div>
    </div>
  );
}
