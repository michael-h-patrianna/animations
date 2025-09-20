import { useEffect, useRef } from 'react';
import './reward-orchestrations.css';

export function RewardOrchestrationsCoinTrail() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clear any existing coins
    container.innerHTML = '';

    const coinCount = 8;
    const animations: Animation[] = [];

    // Create coins and animate them along a curved trail
    for (let i = 0; i < coinCount; i++) {
      const coin = document.createElement('div');
      coin.className = 'pf-coin-trail__coin';
      
      // Starting position (left side)
      coin.style.left = '10px';
      coin.style.top = '50px';
      coin.style.opacity = '0';
      
      container.appendChild(coin);

      // Animate each coin with a staggered delay
      const delay = i * 100;
      
      // Trail animation: curved path from left to right
      const trailAnimation = coin.animate([
        { 
          transform: 'translate(0px, 0px) scale(0.5) rotate(0deg)',
          opacity: '0'
        },
        { 
          transform: 'translate(50px, -20px) scale(0.8) rotate(180deg)',
          opacity: '1',
          offset: 0.3
        },
        { 
          transform: 'translate(150px, -10px) scale(1) rotate(360deg)',
          opacity: '1',
          offset: 0.7
        },
        { 
          transform: 'translate(250px, 5px) scale(0.6) rotate(540deg)',
          opacity: '0'
        }
      ], {
        duration: 2400,
        delay,
        easing: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
        fill: 'forwards'
      });

      animations.push(trailAnimation);
    }

    return () => {
      animations.forEach(anim => anim.cancel());
    };
  }, []);

  return (
    <div className="pf-reward-orchestration pf-reward-orchestration--coin-trail" ref={containerRef}>
      <div className="pf-coin-trail"></div>
    </div>
  );
}
