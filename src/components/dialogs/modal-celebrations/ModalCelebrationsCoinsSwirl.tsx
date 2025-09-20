import './modal-celebrations.css';

const coinGradients = [
  'linear-gradient(135deg, #ffd966 0%, #ffb300 100%)',
  'linear-gradient(135deg, #ffe066 0%, #f59e00 100%)',
];

// Utility function to generate random number between min and max
const randBetween = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

export function ModalCelebrationsCoinsSwirl() {
  const coins = Array.from({ length: 10 }, (_, i) => {
    const startAngle = randBetween(0, 360);
    const spin = randBetween(240, 360);
    const radius = randBetween(60, 110);
    const delay = i * 70;
    const duration = 1200;
    
    return {
      id: i,
      gradient: coinGradients[i % coinGradients.length],
      startAngle,
      spin,
      radius,
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
              '--start-angle': `${coin.startAngle}deg`,
              '--spin': `${coin.spin}deg`,
              '--radius': `${coin.radius}px`,
              '--delay': `${coin.delay}ms`,
              '--duration': `${coin.duration}ms`,
              '--coin-color': coin.gradient,
              animation: `celebration-coin-swirl var(--duration) ease-out var(--delay) forwards`,
            } as React.CSSProperties}
          />
        ))}
      </div>
    </div>
  );
}