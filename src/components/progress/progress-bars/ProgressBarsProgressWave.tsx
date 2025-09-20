import { useEffect, useRef } from 'react';
import './progress-bars.css';

export function ProgressBarsProgressWave() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const trackContainer = container.querySelector('.track-container') as HTMLDivElement;
    if (!trackContainer) return;

    // Animation duration
    const duration = 3000;

    // Create wave layers container
    const waveLayers = document.createElement('div');
    waveLayers.style.cssText = `
      position: absolute;
      inset: 0;
      border-radius: inherit;
      overflow: hidden;
    `;
    trackContainer.appendChild(waveLayers);

    // Create 3 wave layers with different speeds
    const waveElements: HTMLDivElement[] = [];
    for (let i = 0; i < 3; i++) {
      const waveLayer = document.createElement('div');
      waveLayer.style.cssText = `
        position: absolute;
        inset: 0;
        background: linear-gradient(90deg, 
          transparent 0%, 
          rgba(196, 122, 229, ${0.2 + i * 0.1}) 25%, 
          rgba(215, 154, 243, ${0.3 + i * 0.15}) 50%, 
          rgba(198, 255, 119, ${0.2 + i * 0.1}) 75%, 
          transparent 100%
        );
        background-size: 300% 100%;
        border-radius: inherit;
        opacity: 0;
        transform: translateX(-100%);
      `;
      waveLayers.appendChild(waveLayer);
      waveElements.push(waveLayer);
    }

    // Create shimmer highlight
    const shimmerHighlight = document.createElement('div');
    shimmerHighlight.style.cssText = `
      position: absolute;
      inset: 0;
      background: linear-gradient(90deg, 
        transparent 0%, 
        rgba(255, 255, 255, 0.3) 45%, 
        rgba(255, 255, 255, 0.6) 50%, 
        rgba(255, 255, 255, 0.3) 55%, 
        transparent 100%
      );
      background-size: 200% 100%;
      border-radius: inherit;
      opacity: 0;
      transform: translateX(-100%);
    `;
    trackContainer.appendChild(shimmerHighlight);

    // Create ripple effects container
    const ripplesContainer = document.createElement('div');
    ripplesContainer.style.cssText = `
      position: absolute;
      inset: 0;
      overflow: visible;
      pointer-events: none;
    `;
    trackContainer.appendChild(ripplesContainer);

    // Create final crest splash container
    const crestSplash = document.createElement('div');
    crestSplash.style.cssText = `
      position: absolute;
      top: 50%;
      right: 0;
      width: 60px;
      height: 60px;
      transform: translate(50%, -50%);
      pointer-events: none;
    `;
    trackContainer.appendChild(crestSplash);

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
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      fill: 'forwards'
    });
    animations.push(fillAnimation);

    // Wave layers with different speeds and delays
    waveElements.forEach((waveLayer, index) => {
      const speed = 1 - index * 0.2; // Different speeds for depth
      const delay = index * 100; // Staggered start

      const waveAnimation = waveLayer.animate([
        { opacity: 0, transform: 'translateX(-100%)', backgroundPosition: '-300% 0' },
        { opacity: 0.6, transform: 'translateX(-20%)', backgroundPosition: '-150% 0', offset: 0.2 },
        { opacity: 0.8, transform: 'translateX(20%)', backgroundPosition: '0% 0', offset: 0.6 },
        { opacity: 0.4, transform: 'translateX(100%)', backgroundPosition: '300% 0' }
      ], {
        duration: duration * speed,
        delay,
        easing: 'ease-in-out',
        fill: 'forwards'
      });
      animations.push(waveAnimation);

      // Wave background position animation for movement effect
      const wavePositionAnimation = waveLayer.animate([
        { backgroundPosition: '-300% 0' },
        { backgroundPosition: '300% 0' }
      ], {
        duration: duration * speed * 1.5,
        delay,
        easing: 'linear',
        fill: 'forwards'
      });
      animations.push(wavePositionAnimation);
    });

    // Shimmer highlight that travels with wave
    const shimmerAnimation = shimmerHighlight.animate([
      { opacity: 0, transform: 'translateX(-100%)', backgroundPosition: '-200% 0' },
      { opacity: 0.8, transform: 'translateX(0%)', backgroundPosition: '0% 0', offset: 0.5 },
      { opacity: 0.3, transform: 'translateX(100%)', backgroundPosition: '200% 0' }
    ], {
      duration: duration * 0.8,
      delay: 200,
      easing: 'ease-out',
      fill: 'forwards'
    });
    animations.push(shimmerAnimation);

    // Create ripple effects at 8 points during animation
    const ripplePoints = 8;
    for (let i = 0; i < ripplePoints; i++) {
      setTimeout(() => {
        const ripple = document.createElement('div');
        ripple.style.cssText = `
          position: absolute;
          top: 50%;
          left: ${(i / ripplePoints) * 100}%;
          width: 16px;
          height: 16px;
          border: 2px solid rgba(198, 255, 119, 0.6);
          border-radius: 50%;
          transform: translate(-50%, -50%) scale(0);
          opacity: 0;
        `;
        ripplesContainer.appendChild(ripple);

        const rippleAnimation = ripple.animate([
          { opacity: 0, transform: 'translate(-50%, -50%) scale(0)' },
          { opacity: 1, transform: 'translate(-50%, -50%) scale(0.5)', offset: 0.3 },
          { opacity: 0, transform: 'translate(-50%, -50%) scale(2)' }
        ], {
          duration: 600,
          easing: 'ease-out',
          fill: 'forwards'
        });
        animations.push(rippleAnimation);
      }, (duration / ripplePoints) * i);
    }

    // Final crest and splash particles
    setTimeout(() => {
      // Create crest wave effect
      const crestWave = document.createElement('div');
      crestWave.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        width: 40px;
        height: 20px;
        background: linear-gradient(90deg, transparent 0%, rgba(198, 255, 119, 0.8) 50%, transparent 100%);
        border-radius: 50%;
        transform: translate(-50%, -50%) scaleY(0);
      `;
      crestSplash.appendChild(crestWave);

      const crestAnimation = crestWave.animate([
        { transform: 'translate(-50%, -50%) scaleY(0) scaleX(1)' },
        { transform: 'translate(-50%, -50%) scaleY(1) scaleX(1.2)', offset: 0.3 },
        { transform: 'translate(-50%, -50%) scaleY(0.5) scaleX(2)' }
      ], {
        duration: 400,
        easing: 'ease-out',
        fill: 'forwards'
      });
      animations.push(crestAnimation);

      // Create splash particles
      for (let i = 0; i < 16; i++) {
        const splashParticle = document.createElement('div');
        splashParticle.style.cssText = `
          position: absolute;
          top: 50%;
          left: 50%;
          width: 3px;
          height: 3px;
          background: rgba(198, 255, 119, 0.9);
          border-radius: 50%;
          transform: translate(-50%, -50%);
        `;
        crestSplash.appendChild(splashParticle);

        const angle = (i / 16) * Math.PI * 2;
        const distance = 25 + Math.random() * 25;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;

        const splashAnimation = splashParticle.animate([
          { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
          { opacity: 0.7, transform: `translate(${x * 0.6 - 50}%, ${y * 0.6 - 50}%) scale(0.8)`, offset: 0.4 },
          { opacity: 0, transform: `translate(${x - 50}%, ${y - 50}%) scale(0.3)` }
        ], {
          duration: 700,
          delay: Math.random() * 200,
          easing: 'ease-out',
          fill: 'forwards'
        });
        animations.push(splashAnimation);
      }
    }, duration * 0.85);

    return () => {
      animations.forEach(animation => animation.cancel());
      // Clean up created elements
      [waveLayers, shimmerHighlight, ripplesContainer, crestSplash].forEach(el => {
        if (el.parentNode) {
          el.parentNode.removeChild(el);
        }
      });
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="pf-progress-demo pf-progress-wave"
      data-animation-id="progress-bars__progress-wave"
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
