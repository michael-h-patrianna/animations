import { useEffect, useRef } from 'react';
import './progress-bars.css';

export function ProgressBarsProgressSpark() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const trackContainer = container.querySelector('.track-container') as HTMLDivElement;
    if (!trackContainer) return;

    // Animation duration
    const duration = 2500;

    // Create trailing gradient element
    const trailGradient = document.createElement('div');
    trailGradient.style.cssText = `
      position: absolute;
      inset: 0;
      background: linear-gradient(90deg, 
        transparent 0%, 
        rgba(196, 122, 229, 0.2) 20%, 
        rgba(215, 154, 243, 0.4) 40%, 
        rgba(198, 255, 119, 0.6) 60%, 
        rgba(198, 255, 119, 0.8) 80%, 
        transparent 100%
      );
      border-radius: inherit;
      opacity: 0;
      transform: translateX(-100%);
    `;
    trackContainer.appendChild(trailGradient);

    // Create spark leader container
    const sparkLeader = document.createElement('div');
    sparkLeader.style.cssText = `
      position: absolute;
      top: 50%;
      left: 0;
      width: 16px;
      height: 16px;
      transform: translate(-50%, -50%);
      z-index: 10;
    `;
    trackContainer.appendChild(sparkLeader);

    // Create spark core (bright white center)
    const sparkCore = document.createElement('div');
    sparkCore.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      width: 8px;
      height: 8px;
      background: #ffffff;
      border-radius: 50%;
      transform: translate(-50%, -50%);
      box-shadow: 0 0 4px #ffffff, 0 0 8px #c6ff77;
    `;
    sparkLeader.appendChild(sparkCore);

    // Create spark halo (larger glow)
    const sparkHalo = document.createElement('div');
    sparkHalo.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      width: 16px;
      height: 16px;
      background: radial-gradient(circle, rgba(198, 255, 119, 0.6) 0%, transparent 70%);
      border-radius: 50%;
      transform: translate(-50%, -50%);
      filter: blur(2px);
    `;
    sparkLeader.appendChild(sparkHalo);

    // Create trailing particles container
    const trailingParticles = document.createElement('div');
    trailingParticles.style.cssText = `
      position: absolute;
      inset: 0;
      overflow: visible;
      pointer-events: none;
    `;
    trackContainer.appendChild(trailingParticles);

    // Create final burst container
    const finalBurst = document.createElement('div');
    finalBurst.style.cssText = `
      position: absolute;
      top: 50%;
      right: 0;
      width: 40px;
      height: 40px;
      transform: translate(50%, -50%);
      pointer-events: none;
    `;
    trackContainer.appendChild(finalBurst);

    // Get main fill element
    const fill = trackContainer.querySelector('.pf-progress-fill') as HTMLDivElement;
    if (!fill) return;

    const animations: Animation[] = [];

    // Main fill animation
    const fillAnimation = fill.animate([
      { transform: 'scaleX(0)' },
      { transform: 'scaleX(1)' }
    ], {
      duration,
      easing: 'cubic-bezier(0.34, 1.25, 0.64, 1)',
      fill: 'forwards'
    });
    animations.push(fillAnimation);

    // Trail gradient animation that follows the fill
    const trailAnimation = trailGradient.animate([
      { opacity: 0, transform: 'translateX(-100%)' },
      { opacity: 0.8, transform: 'translateX(-20%)', offset: 0.3 },
      { opacity: 1, transform: 'translateX(20%)', offset: 0.7 },
      { opacity: 0.6, transform: 'translateX(100%)' }
    ], {
      duration,
      easing: 'ease-out',
      fill: 'forwards'
    });
    animations.push(trailAnimation);

    // Spark leader movement
    const sparkLeaderAnimation = sparkLeader.animate([
      { left: '0%' },
      { left: '100%' }
    ], {
      duration: duration * 0.9,
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      fill: 'forwards'
    });
    animations.push(sparkLeaderAnimation);

    // Spark core pulsing
    const sparkCoreAnimation = sparkCore.animate([
      { transform: 'translate(-50%, -50%) scale(1)', boxShadow: '0 0 4px #ffffff, 0 0 8px #c6ff77' },
      { transform: 'translate(-50%, -50%) scale(1.3)', boxShadow: '0 0 8px #ffffff, 0 0 16px #c6ff77', offset: 0.5 },
      { transform: 'translate(-50%, -50%) scale(1)', boxShadow: '0 0 4px #ffffff, 0 0 8px #c6ff77' }
    ], {
      duration: 200,
      iterations: Math.floor(duration / 200),
      easing: 'ease-in-out'
    });
    animations.push(sparkCoreAnimation);

    // Spark halo pulsing
    const sparkHaloAnimation = sparkHalo.animate([
      { transform: 'translate(-50%, -50%) scale(1)', opacity: 0.6 },
      { transform: 'translate(-50%, -50%) scale(1.5)', opacity: 0.3, offset: 0.5 },
      { transform: 'translate(-50%, -50%) scale(1)', opacity: 0.6 }
    ], {
      duration: 300,
      iterations: Math.floor(duration / 300),
      easing: 'ease-in-out'
    });
    animations.push(sparkHaloAnimation);

    // Create trailing particles every 50ms
    let particleInterval: number;
    let particleCount = 0;

    const createTrailingParticle = () => {
      if (particleCount > duration / 50) return;

      const particle = document.createElement('div');
      particle.style.cssText = `
        position: absolute;
        top: 50%;
        left: ${(particleCount / (duration / 50)) * 100}%;
        width: 3px;
        height: 3px;
        background: rgba(198, 255, 119, 0.8);
        border-radius: 50%;
        transform: translate(-50%, -50%);
        z-index: 5;
      `;
      trailingParticles.appendChild(particle);

      const particleAnimation = particle.animate([
        { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
        { opacity: 0.5, transform: 'translate(-50%, -50%) scale(0.8)', offset: 0.6 },
        { opacity: 0, transform: 'translate(-50%, -50%) scale(0.3)' }
      ], {
        duration: 800,
        easing: 'ease-out',
        fill: 'forwards'
      });
      animations.push(particleAnimation);

      particleCount++;
    };

    particleInterval = window.setInterval(createTrailingParticle, 50);

    setTimeout(() => {
      if (particleInterval) {
        clearInterval(particleInterval);
      }
    }, duration * 0.9);

    // Final burst when spark reaches the end
    setTimeout(() => {
      for (let i = 0; i < 12; i++) {
        const burstParticle = document.createElement('div');
        burstParticle.style.cssText = `
          position: absolute;
          top: 50%;
          left: 50%;
          width: 4px;
          height: 4px;
          background: #c6ff77;
          border-radius: 50%;
          transform: translate(-50%, -50%);
        `;
        finalBurst.appendChild(burstParticle);

        const angle = (i / 12) * Math.PI * 2;
        const distance = 30 + Math.random() * 20;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;

        const burstAnimation = burstParticle.animate([
          { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
          { opacity: 0.7, transform: `translate(${x * 0.5 - 50}%, ${y * 0.5 - 50}%) scale(0.8)`, offset: 0.5 },
          { opacity: 0, transform: `translate(${x - 50}%, ${y - 50}%) scale(0.3)` }
        ], {
          duration: 600,
          easing: 'ease-out',
          fill: 'forwards'
        });
        animations.push(burstAnimation);
      }
    }, duration * 0.85);

    return () => {
      if (particleInterval) {
        clearInterval(particleInterval);
      }
      animations.forEach(animation => animation.cancel());
      // Clean up created elements
      [trailGradient, sparkLeader, trailingParticles, finalBurst].forEach(el => {
        if (el.parentNode) {
          el.parentNode.removeChild(el);
        }
      });
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="pf-progress-demo pf-progress-spark"
      data-animation-id="progress-bars__progress-spark"
    >
      <div className="pf-progress-demo__label">Level progress</div>
      <div className="track-container" style={{ position: 'relative' }}>
        <div className="pf-progress-track">
          <div className="pf-progress-fill"></div>
        </div>
      </div>
    </div>
  );
}
