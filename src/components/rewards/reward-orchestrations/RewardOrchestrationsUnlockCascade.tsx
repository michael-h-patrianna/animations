import { useEffect, useRef } from 'react';
import './reward-orchestrations.css';

export function RewardOrchestrationsUnlockCascade() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = '';
    const lockCount = 10;
    const animations: Animation[] = [];

    // Create falling locks
    for (let i = 0; i < lockCount; i++) {
      const lock = document.createElement('div');
      lock.className = 'pf-unlock-cascade__lock';
      
      const startX = Math.random() * 200 + 50;
      lock.style.left = `${startX}px`;
      lock.style.top = '-30px';
      lock.style.opacity = '0';
      
      container.appendChild(lock);

      const delay = i * 180 + Math.random() * 150;
      
      const lockAnimation = lock.animate([
        { 
          transform: 'translate(0px, 0px) scale(0.3) rotate(0deg)',
          opacity: '0'
        },
        { 
          transform: `translate(${(Math.random() - 0.5) * 20}px, 50px) scale(1) rotate(180deg)`,
          opacity: '1',
          offset: 0.3
        },
        { 
          transform: `translate(${(Math.random() - 0.5) * 40}px, 100px) scale(1) rotate(360deg)`,
          opacity: '1',
          offset: 0.7
        },
        { 
          transform: `translate(${(Math.random() - 0.5) * 50}px, 150px) scale(0.2) rotate(540deg)`,
          opacity: '0'
        }
      ], {
        duration: 2600,
        delay,
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        fill: 'forwards'
      });

      animations.push(lockAnimation);
    }

    return () => {
      animations.forEach(anim => anim.cancel());
    };
  }, []);

  return (
    <div className="pf-reward-orchestration pf-reward-orchestration--unlock-cascade" ref={containerRef}>
      <div className="pf-unlock-cascade"></div>
    </div>
  );
}
