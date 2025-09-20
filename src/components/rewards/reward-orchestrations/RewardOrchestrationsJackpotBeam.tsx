import { useEffect, useRef } from 'react';
import './reward-orchestrations.css';

export function RewardOrchestrationsJackpotBeam() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = '';
    const rayCount = 12;
    const animations: Animation[] = [];

    // Create core
    const core = document.createElement('div');
    core.className = 'pf-jackpot-beam__core';
    core.style.left = '130px';
    core.style.top = '40px';
    core.style.opacity = '0';
    container.appendChild(core);

    // Core animation
    const coreAnimation = core.animate([
      { opacity: '0', transform: 'scale(0)' },
      { opacity: '1', transform: 'scale(1.2)', offset: 0.3 },
      { opacity: '1', transform: 'scale(1)' }
    ], {
      duration: 1000,
      delay: 200,
      easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      fill: 'forwards'
    });

    animations.push(coreAnimation);

    // Create rays
    for (let i = 0; i < rayCount; i++) {
      const ray = document.createElement('div');
      ray.className = 'pf-jackpot-beam__ray';
      
      const angle = (i / rayCount) * 360;
      ray.style.left = '148px';
      ray.style.top = '40px';
      ray.style.transformOrigin = 'bottom center';
      ray.style.transform = `rotate(${angle}deg)`;
      ray.style.opacity = '0';
      
      container.appendChild(ray);

      const delay = 500 + i * 80;
      
      const rayAnimation = ray.animate([
        { opacity: '0', transform: `rotate(${angle}deg) scaleY(0)` },
        { opacity: '1', transform: `rotate(${angle}deg) scaleY(1.5)`, offset: 0.4 },
        { opacity: '1', transform: `rotate(${angle}deg) scaleY(1)`, offset: 0.8 },
        { opacity: '0.3', transform: `rotate(${angle}deg) scaleY(0.5)` }
      ], {
        duration: 2800,
        delay,
        easing: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
        fill: 'forwards'
      });

      animations.push(rayAnimation);
    }

    return () => {
      animations.forEach(anim => anim.cancel());
    };
  }, []);

  return (
    <div className="pf-reward-orchestration pf-reward-orchestration--jackpot-beam" ref={containerRef}>
      <div className="pf-jackpot-beam"></div>
    </div>
  );
}
