import './modal-celebrations.css';

const coinGradients = [
  'linear-gradient(135deg, #ffd966 0%, #ffb300 100%)',
  'linear-gradient(135deg, #ffe066 0%, #f59e00 100%)',
];

// Utility function to generate random number between min and max
const randBetween = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

export function ModalCelebrationsCoinsFountain() {
  const coins = Array.from({ length: 12 }, (_, i) => {
    const tx = randBetween(-80, 80);
    const ty = randBetween(-200, -120);
    const delay = i * 50;
    const duration = 1100;
    
    return {
      id: i,
      gradient: coinGradients[i % coinGradients.length],
      tx,
      ty,
      delay,
      duration,
    };
  });

  return (
    <div className="pf-celebration">
      <div className="pf-celebration__layer">
        {coins.map((coin) => (
          <span
            key={coin.id}
            className="pf-celebration__coin"
            style={{
              '--tx': `${coin.tx}px`,
              '--ty': `${coin.ty}px`,
              '--delay': `${coin.delay}ms`,
              '--duration': `${coin.duration}ms`,
              '--coin-color': coin.gradient,
              animation: `celebration-coin-fountain var(--duration) ease-out var(--delay) forwards`,
            } as React.CSSProperties}
          />
        ))}
      </div>
    </div>
  );
}