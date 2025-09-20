import { useEffect, useRef } from 'react';
import './reward-orchestrations.css';

export function RewardOrchestrationsUnlockChain() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = '';
    const chainLength = 8;
    const animations: Animation[] = [];

    // Create chain links
    for (let i = 0; i < chainLength; i++) {
      const link = document.createElement('div');
      link.className = 'pf-unlock-chain__link';
      
      const x = 30 + i * 25;
      const y = 50 + Math.sin(i * 0.5) * 10;
      link.style.left = `${x}px`;
      link.style.top = `${y}px`;
      link.style.opacity = '0.3';
      
      container.appendChild(link);

      const delay = i * 200;
      
      const linkAnimation = link.animate([
        { opacity: '0.3', transform: 'scale(1) rotate(0deg)' },
        { opacity: '1', transform: 'scale(1.2) rotate(10deg)', offset: 0.5 },
        { opacity: '1', transform: 'scale(1) rotate(0deg)' }
      ], {
        duration: 2600,
        delay,
        easing: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
        fill: 'forwards'
      });

      animations.push(linkAnimation);
    }

    // Add key at the end
    const key = document.createElement('div');
    key.className = 'pf-unlock-chain__key';
    key.style.left = `${30 + chainLength * 25}px`;
    key.style.top = '52px';
    key.style.opacity = '0';
    container.appendChild(key);

    const keyAnimation = key.animate([
      { opacity: '0', transform: 'scale(0) rotate(-45deg)' },
      { opacity: '1', transform: 'scale(1.3) rotate(-45deg)', offset: 0.3 },
      { opacity: '1', transform: 'scale(1) rotate(-45deg)' }
    ], {
      duration: 1000,
      delay: chainLength * 200,
      easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      fill: 'forwards'
    });

    animations.push(keyAnimation);

    return () => {
      animations.forEach(anim => anim.cancel());
    };
  }, []);

  return (
    <div className="pf-reward-orchestration pf-reward-orchestration--unlock-chain" ref={containerRef}>
      <div className="pf-unlock-chain"></div>
    </div>
  );
}
