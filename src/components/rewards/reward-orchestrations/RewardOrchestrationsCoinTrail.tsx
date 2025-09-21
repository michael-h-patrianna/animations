import { useEffect, useState } from 'react';
import './reward-orchestrations.css';

interface Coin {
  id: number;
  delay: number;
}

// Separate Coin component for better React Native translation
const AnimatedCoin = ({ delay }: { delay: number }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Small delay to trigger animation after mount
    const timer = setTimeout(() => setIsAnimating(true), 10);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="pf-coin-trail__coin"
      style={{
        position: 'absolute',
        left: '10px',
        top: '50px',
        animation: isAnimating 
          ? `coin-trail-motion 2.4s ${delay}ms cubic-bezier(0.4, 0.0, 0.2, 1) forwards`
          : 'none',
        opacity: 0
      }}
    >
      {/* Dollar sign replaced as actual element instead of ::before */}
      <span 
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          fontSize: '10px',
          fontWeight: 'bold',
          color: '#b8860b'
        }}
      >
        $
      </span>
    </div>
  );
};

export function RewardOrchestrationsCoinTrail() {
  const [coins, setCoins] = useState<Coin[]>([]);

  useEffect(() => {
    // Create coins with staggered delays
    const coinCount = 8;
    const newCoins = Array.from({ length: coinCount }, (_, i) => ({
      id: i,
      delay: i * 100
    }));
    
    setCoins(newCoins);

    // Clean up after animation completes
    const cleanupTimeout = setTimeout(() => {
      // Animation complete - could reset here if needed
    }, 2400 + (coinCount * 100));

    return () => {
      clearTimeout(cleanupTimeout);
    };
  }, []);

  return (
    <div className="pf-reward-orchestration pf-reward-orchestration--coin-trail">
      <div className="pf-coin-trail" style={{ position: 'relative', width: '100%', height: '100%' }}>
        {coins.map(coin => (
          <AnimatedCoin key={coin.id} delay={coin.delay} />
        ))}
      </div>
      
      <style>{`
        @keyframes coin-trail-motion {
          0% {
            transform: translate(0px, 0px) scale(0.5) rotate(0deg);
            opacity: 0;
          }
          30% {
            transform: translate(50px, -20px) scale(0.8) rotate(180deg);
            opacity: 1;
          }
          70% {
            transform: translate(150px, -10px) scale(1) rotate(360deg);
            opacity: 1;
          }
          100% {
            transform: translate(250px, 5px) scale(0.6) rotate(540deg);
            opacity: 0;
          }
        }
        
        /* Override the pseudo-element since we're using a real element */
        .pf-coin-trail__coin::before {
          content: none;
        }
      `}</style>
    </div>
  );
}