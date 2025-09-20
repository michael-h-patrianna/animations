import './modal-celebrations.css';

const confettiColors = ['#ff5981', '#c6ff77', '#47fff4', '#ffce1a', '#ecc3ff'];

// Utility function to generate random number between min and max
const randBetween = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

export function ModalCelebrationsConfettiBurst() {
  const particles = Array.from({ length: 32 }, (_, i) => {
    const tx = randBetween(-160, 160);
    const ty = randBetween(-210, -80);
    const rot = randBetween(-260, 260);
    const delay = i * 12;
    const duration = randBetween(600, 900);
    
    return {
      id: i,
      color: confettiColors[i % confettiColors.length],
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
              top: '60%',
              '--tx': `${particle.tx}px`,
              '--ty': `${particle.ty}px`,
              '--rot': `${particle.rot}deg`,
              '--delay': `${particle.delay}ms`,
              '--duration': `${particle.duration}ms`,
              background: particle.color,
              animation: `celebration-confetti-burst var(--duration) ease-out var(--delay) forwards`,
            } as React.CSSProperties}
          />
        ))}
      </div>
    </div>
  );
}
