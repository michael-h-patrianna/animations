import { useEffect, useRef } from 'react';
import './progress-bars.css';

export function ProgressBarsProgressPulse() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const trackContainer = container.querySelector('.track-container') as HTMLElement;
    const track = container.querySelector('.pf-progress-track') as HTMLElement;
    const fill = container.querySelector('.pf-progress-fill') as HTMLElement;
    if (!trackContainer || !track || !fill) return;

    // Clean up any existing animations
    const existingElements = container.querySelectorAll('.animation-element');
    existingElements.forEach(el => el.remove());

    // Reset fill
    fill.style.transform = 'scaleX(0)';
    fill.style.transformOrigin = 'left center';
    fill.style.background = 'linear-gradient(90deg, #c47ae5 0%, #d79af3 100%)';

    // Create pulse wave elements
    const pulseWaves: Array<{element: HTMLElement, time: number}> = [];
    const pulseTimes = [0.25, 0.5, 0.75];
    
    pulseTimes.forEach((time, index) => {
      const wave = document.createElement('div');
      wave.className = 'animation-element';
      wave.style.position = 'absolute';
      wave.style.left = `${time * 100}%`;
      wave.style.top = '50%';
      wave.style.transform = 'translate(-50%, -50%)';
      wave.style.width = '4px';
      wave.style.height = '200%';
      wave.style.background = 'radial-gradient(ellipse, rgba(198,255,119,0.8) 0%, transparent 70%)';
      wave.style.opacity = '0';
      wave.style.pointerEvents = 'none';
      wave.style.filter = 'blur(2px)';
      trackContainer.appendChild(wave);
      pulseWaves.push({ element: wave, time });
    });

    // Create energy trail
    const energyTrail = document.createElement('div');
    energyTrail.className = 'animation-element';
    energyTrail.style.position = 'absolute';
    energyTrail.style.inset = '0';
    energyTrail.style.background = 'linear-gradient(90deg, transparent 0%, rgba(198,255,119,0.2) 100%)';
    energyTrail.style.opacity = '0';
    energyTrail.style.pointerEvents = 'none';
    energyTrail.style.transform = 'scaleX(0)';
    energyTrail.style.transformOrigin = 'left center';
    fill.appendChild(energyTrail);

    // Main fill with smooth pulses
    const fillDuration = 1600;
    const fillAnim = fill.animate([
      { transform: 'scaleX(0)' },
      { transform: 'scaleX(0.25)', offset: 0.25 },
      { transform: 'scaleX(0.5)', offset: 0.5 },
      { transform: 'scaleX(0.75)', offset: 0.75 },
      { transform: 'scaleX(1)' }
    ], {
      duration: fillDuration,
      fill: 'forwards',
      easing: 'linear'
    });

    // Pulse effects at milestones
    pulseWaves.forEach(({ element, time }) => {
      setTimeout(() => {
        // Vertical pulse wave
        element.animate([
          { transform: 'translate(-50%, -50%) scaleY(0) scaleX(1)', opacity: '0' },
          { transform: 'translate(-50%, -50%) scaleY(1.2) scaleX(3)', opacity: '1', offset: 0.2 },
          { transform: 'translate(-50%, -50%) scaleY(1) scaleX(6)', opacity: '0' }
        ], { duration: 400, easing: 'cubic-bezier(0.4, 0, 0.6, 1)' });

        // Track pulse effect
        track.animate([
          { transform: 'scaleY(1)' },
          { transform: 'scaleY(1.15)', offset: 0.3 },
          { transform: 'scaleY(1)' }
        ], { duration: 300, easing: 'cubic-bezier(0.4, 0, 0.6, 1)' });
      }, fillDuration * time);
    });

    // Energy trail animation
    energyTrail.animate([
      { transform: 'scaleX(0)', opacity: '0' },
      { transform: 'scaleX(0.3)', opacity: '0.5', offset: 0.25 },
      { transform: 'scaleX(0.6)', opacity: '0.5', offset: 0.5 },
      { transform: 'scaleX(0.9)', opacity: '0.5', offset: 0.75 },
      { transform: 'scaleX(1)', opacity: '0.3' }
    ], {
      duration: fillDuration,
      fill: 'forwards',
      easing: 'ease-out'
    });

    // Final celebration pulse
    fillAnim.finished.then(() => {
      fill.animate([
        { transform: 'scaleX(1) scaleY(1)' },
        { transform: 'scaleX(1) scaleY(1.2)', offset: 0.3 },
        { transform: 'scaleX(1) scaleY(1)' }
      ], { duration: 400, easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)' });
    });

    // Cleanup function
    return () => {
      const elements = container.querySelectorAll('.animation-element');
      elements.forEach(el => el.remove());
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="pf-progress-demo pf-progress-pulse"
      data-animation-id="progress-bars__progress-pulse"
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
