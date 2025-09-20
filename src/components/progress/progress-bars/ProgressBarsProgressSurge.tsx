import { useEffect, useRef } from 'react';
import './progress-bars.css';

export function ProgressBarsProgressSurge() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const trackContainer = container.querySelector('.track-container') as HTMLDivElement;
    if (!trackContainer) return;

    // Animation duration
    const duration = 2000;

    // Create gradient background element
    const gradientBg = document.createElement('div');
    gradientBg.style.cssText = `
      position: absolute;
      inset: 0;
      background: linear-gradient(90deg, 
        transparent 0%, 
        rgba(196, 122, 229, 0.3) 30%, 
        rgba(215, 154, 243, 0.5) 50%, 
        rgba(198, 255, 119, 0.3) 70%, 
        transparent 100%
      );
      background-size: 200% 100%;
      border-radius: inherit;
      opacity: 0;
    `;
    trackContainer.appendChild(gradientBg);

    // Create power gauge indicator
    const powerGauge = document.createElement('div');
    powerGauge.style.cssText = `
      position: absolute;
      top: -8px;
      left: 0;
      width: 4px;
      height: calc(100% + 16px);
      background: linear-gradient(180deg, transparent 0%, #c6ff77 50%, transparent 100%);
      border-radius: 2px;
      opacity: 0;
      transform: scaleY(0);
    `;
    trackContainer.appendChild(powerGauge);

    // Create speed lines container
    const speedLinesContainer = document.createElement('div');
    speedLinesContainer.style.cssText = `
      position: absolute;
      inset: 0;
      overflow: hidden;
      border-radius: inherit;
    `;
    trackContainer.appendChild(speedLinesContainer);

    // Create speed lines
    for (let i = 0; i < 5; i++) {
      const speedLine = document.createElement('div');
      speedLine.style.cssText = `
        position: absolute;
        top: ${20 + i * 15}%;
        left: -100%;
        width: 20px;
        height: 1px;
        background: rgba(198, 255, 119, 0.6);
        opacity: 0;
      `;
      speedLinesContainer.appendChild(speedLine);
    }

    // Create shockwave ring
    const shockwave = document.createElement('div');
    shockwave.style.cssText = `
      position: absolute;
      top: 50%;
      right: -10px;
      width: 20px;
      height: 20px;
      border: 2px solid rgba(198, 255, 119, 0.8);
      border-radius: 50%;
      transform: translate(50%, -50%) scale(0);
      opacity: 0;
    `;
    trackContainer.appendChild(shockwave);

    // Create energy particles
    const particlesContainer = document.createElement('div');
    particlesContainer.style.cssText = `
      position: absolute;
      inset: 0;
      overflow: visible;
      pointer-events: none;
    `;
    trackContainer.appendChild(particlesContainer);

    // Get main fill element
    const fill = trackContainer.querySelector('.pf-progress-fill') as HTMLDivElement;
    const track = trackContainer.querySelector('.pf-progress-track') as HTMLDivElement;

    if (!fill || !track) return;

    const animations: Animation[] = [];

    // Main fill animation with complex timeline
    const fillAnimation = fill.animate([
      { transform: 'scaleX(0)', offset: 0 },
      { transform: 'scaleX(0.3)', offset: 0.3 },
      { transform: 'scaleX(0.5)', offset: 0.5 },
      { transform: 'scaleX(0.7)', offset: 0.65 },
      { transform: 'scaleX(1.08)', offset: 0.82 },
      { transform: 'scaleX(0.96)', offset: 0.88 },
      { transform: 'scaleX(1.02)', offset: 0.94 },
      { transform: 'scaleX(1)', offset: 1 }
    ], {
      duration,
      easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      fill: 'forwards'
    });
    animations.push(fillAnimation);

    // Gradient background position animation
    const gradientAnimation = gradientBg.animate([
      { opacity: 0, backgroundPosition: '-200% 0' },
      { opacity: 0.6, backgroundPosition: '-100% 0', offset: 0.3 },
      { opacity: 0.8, backgroundPosition: '0% 0', offset: 0.6 },
      { opacity: 1, backgroundPosition: '100% 0', offset: 0.82 },
      { opacity: 0.3, backgroundPosition: '200% 0' }
    ], {
      duration,
      easing: 'ease-out',
      fill: 'forwards'
    });
    animations.push(gradientAnimation);

    // Power gauge buildup
    const powerGaugeAnimation = powerGauge.animate([
      { opacity: 0, transform: 'scaleY(0)' },
      { opacity: 0.4, transform: 'scaleY(0.3)', offset: 0.2 },
      { opacity: 0.8, transform: 'scaleY(0.7)', offset: 0.6 },
      { opacity: 1, transform: 'scaleY(1)', offset: 0.82 },
      { opacity: 0, transform: 'scaleY(1.2)' }
    ], {
      duration,
      easing: 'ease-out',
      fill: 'forwards'
    });
    animations.push(powerGaugeAnimation);

    // Speed lines animation
    const speedLines = speedLinesContainer.querySelectorAll('div');
    speedLines.forEach((line, index) => {
      const lineAnimation = line.animate([
        { opacity: 0, left: '-100%' },
        { opacity: 0, left: '-50%', offset: 0.7 + index * 0.02 },
        { opacity: 0.8, left: '20%', offset: 0.8 + index * 0.02 },
        { opacity: 0, left: '120%' }
      ], {
        duration: duration * 0.4,
        delay: duration * 0.6 + index * 50,
        easing: 'ease-out',
        fill: 'forwards'
      });
      animations.push(lineAnimation);
    });

    // Shockwave ring explosion at 82%
    const shockwaveAnimation = shockwave.animate([
      { opacity: 0, transform: 'translate(50%, -50%) scale(0)' },
      { opacity: 1, transform: 'translate(50%, -50%) scale(0.5)', offset: 0.3 },
      { opacity: 0.3, transform: 'translate(50%, -50%) scale(2)' }
    ], {
      duration: 300,
      delay: duration * 0.82,
      easing: 'ease-out',
      fill: 'forwards'
    });
    animations.push(shockwaveAnimation);

    // Track shake effect
    const trackShakeAnimation = track.animate([
      { transform: 'translateX(0)' },
      { transform: 'translateX(2px)', offset: 0.1 },
      { transform: 'translateX(-2px)', offset: 0.2 },
      { transform: 'translateX(1px)', offset: 0.3 },
      { transform: 'translateX(-1px)', offset: 0.4 },
      { transform: 'translateX(0)' }
    ], {
      duration: 200,
      delay: duration * 0.82,
      easing: 'ease-out',
      fill: 'forwards'
    });
    animations.push(trackShakeAnimation);

    // Energy dispersal particles
    setTimeout(() => {
      for (let i = 0; i < 8; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
          position: absolute;
          top: 50%;
          right: 0;
          width: 4px;
          height: 4px;
          background: #c6ff77;
          border-radius: 50%;
          transform: translate(0, -50%);
        `;
        particlesContainer.appendChild(particle);

        const angle = (i / 8) * Math.PI * 2;
        const distance = 40 + Math.random() * 20;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;

        const particleAnimation = particle.animate([
          { opacity: 1, transform: 'translate(0, -50%) scale(1)' },
          { opacity: 0.5, transform: `translate(${x * 0.5}px, ${y * 0.5 - 50}%) scale(0.8)`, offset: 0.5 },
          { opacity: 0, transform: `translate(${x}px, ${y - 50}%) scale(0.3)` }
        ], {
          duration: 500,
          easing: 'ease-out',
          fill: 'forwards'
        });
        animations.push(particleAnimation);
      }
    }, duration * 0.9);

    return () => {
      animations.forEach(animation => animation.cancel());
      // Clean up created elements
      [gradientBg, powerGauge, speedLinesContainer, shockwave, particlesContainer].forEach(el => {
        if (el.parentNode) {
          el.parentNode.removeChild(el);
        }
      });
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="pf-progress-demo pf-progress-surge"
      data-animation-id="progress-bars__progress-surge"
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
