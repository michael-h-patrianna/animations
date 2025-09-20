import { useEffect, useRef } from 'react';
import './progress-bars.css';

export function ProgressBarsProgressThick() {
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

    // Reset and style thick track
    track.style.height = '24px';
    track.style.background = 'linear-gradient(180deg, rgba(78,24,124,0.6) 0%, rgba(78,24,124,0.4) 100%)';
    track.style.boxShadow = 'inset 0 2px 6px rgba(0,0,0,0.4), inset 0 -2px 4px rgba(0,0,0,0.3)';
    track.style.borderRadius = '12px';
    track.style.border = '1px solid rgba(196,122,229,0.2)';

    // Create thick fill with gradient
    fill.style.transform = 'scaleX(0)';
    fill.style.transformOrigin = 'left center';
    fill.style.height = '100%';
    fill.style.background = 'linear-gradient(90deg, #c47ae5 0%, #d79af3 50%, #c6ff77 100%)';
    fill.style.borderRadius = 'inherit';
    fill.style.position = 'relative';
    fill.style.overflow = 'visible';

    // Inner glow layer
    const innerGlow = document.createElement('div');
    innerGlow.className = 'animation-element';
    innerGlow.style.position = 'absolute';
    innerGlow.style.inset = '2px';
    innerGlow.style.background = 'linear-gradient(180deg, rgba(255,255,255,0.3) 0%, transparent 50%, rgba(0,0,0,0.2) 100%)';
    innerGlow.style.borderRadius = 'inherit';
    innerGlow.style.pointerEvents = 'none';
    fill.appendChild(innerGlow);

    // Pulse overlay
    const pulseOverlay = document.createElement('div');
    pulseOverlay.className = 'animation-element';
    pulseOverlay.style.position = 'absolute';
    pulseOverlay.style.inset = '-4px';
    pulseOverlay.style.background = 'radial-gradient(ellipse at center, rgba(198,255,119,0) 0%, rgba(198,255,119,0.4) 60%, rgba(198,255,119,0) 100%)';
    pulseOverlay.style.opacity = '0';
    pulseOverlay.style.pointerEvents = 'none';
    pulseOverlay.style.borderRadius = 'inherit';
    trackContainer.appendChild(pulseOverlay);

    const duration = 1400;

    // Main fill animation
    const fillAnim = fill.animate([
      { transform: 'scaleX(0)' },
      { transform: 'scaleX(1)' }
    ], {
      duration,
      fill: 'forwards',
      easing: 'cubic-bezier(0.4, 0, 0.6, 1)'
    });

    // Pulse overlay animation
    pulseOverlay.animate([
      { opacity: '0', transform: 'scale(0.95)' },
      { opacity: '0', transform: 'scale(0.95)', offset: 0.5 },
      { opacity: '1', transform: 'scale(1)', offset: 0.7 },
      { opacity: '1', transform: 'scale(1.05)', offset: 0.85 },
      { opacity: '0', transform: 'scale(1.1)' }
    ], {
      duration,
      fill: 'forwards',
      easing: 'ease-out'
    });

    // Gentle pulse loop after completion
    fillAnim.finished.then(() => {
      pulseOverlay.animate([
        { opacity: '0', transform: 'scale(1)' },
        { opacity: '0.3', transform: 'scale(1.05)', offset: 0.5 },
        { opacity: '0', transform: 'scale(1.1)' }
      ], {
        duration: 3000,
        iterations: Infinity,
        easing: 'ease-in-out'
      });
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
      className="pf-progress-demo pf-progress-thick"
      data-animation-id="progress-bars__progress-thick"
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
