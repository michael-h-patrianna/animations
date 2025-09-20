import { useEffect, useRef } from 'react';
import './reward-orchestrations.css';

export function RewardOrchestrationsRewardPath() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = '';
    const pathLength = 15;
    const animations: Animation[] = [];

    // Create path dots
    for (let i = 0; i < pathLength; i++) {
      const dot = document.createElement('div');
      dot.className = 'pf-reward-path__dot';
      
      const progress = i / (pathLength - 1);
      const x = 20 + progress * 200;
      const y = 55 + Math.sin(progress * Math.PI * 2) * 20;
      
      dot.style.left = `${x}px`;
      dot.style.top = `${y}px`;
      dot.style.opacity = '0';
      
      container.appendChild(dot);

      const delay = i * 120;
      
      const dotAnimation = dot.animate([
        { opacity: '0', transform: 'scale(0.2)' },
        { opacity: '1', transform: 'scale(1.5)', offset: 0.3 },
        { opacity: '1', transform: 'scale(1)' }
      ], {
        duration: 800,
        delay,
        easing: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
        fill: 'forwards'
      });

      animations.push(dotAnimation);
    }

    // Add treasure at the end
    const treasure = document.createElement('div');
    treasure.className = 'pf-reward-path__treasure';
    treasure.style.left = '240px';
    treasure.style.top = '50px';
    treasure.style.opacity = '0';
    container.appendChild(treasure);

    const treasureAnimation = treasure.animate([
      { opacity: '0', transform: 'scale(0) rotate(0deg)' },
      { opacity: '1', transform: 'scale(1.3) rotate(180deg)', offset: 0.5 },
      { opacity: '1', transform: 'scale(1) rotate(360deg)' }
    ], {
      duration: 1200,
      delay: pathLength * 120,
      easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      fill: 'forwards'
    });

    animations.push(treasureAnimation);

    return () => {
      animations.forEach(anim => anim.cancel());
    };
  }, []);

  return (
    <div className="pf-reward-orchestration pf-reward-orchestration--reward-path" ref={containerRef}>
      <div className="pf-reward-path"></div>
    </div>
  );
}
