import { useEffect, useRef } from 'react';
import './progress-bars.css';

export function ProgressBarsProgressGradient() {
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
    fill.style.position = 'relative';
    fill.style.overflow = 'visible';
    fill.style.background = 'transparent';

    // Create multi-layer gradient system
    const gradientBase = document.createElement('div');
    gradientBase.className = 'animation-element';
    gradientBase.style.position = 'absolute';
    gradientBase.style.inset = '0';
    gradientBase.style.background = 'linear-gradient(90deg, #4e187c 0%, #7a468e 25%, #c47ae5 50%, #d79af3 75%, #c6ff77 100%)';
    gradientBase.style.backgroundSize = '300% 100%';
    gradientBase.style.backgroundPosition = '100% 0';
    gradientBase.style.borderRadius = 'inherit';
    fill.appendChild(gradientBase);

    // Shimmer layer
    const shimmerLayer = document.createElement('div');
    shimmerLayer.className = 'animation-element';
    shimmerLayer.style.position = 'absolute';
    shimmerLayer.style.inset = '0';
    shimmerLayer.style.background = `linear-gradient(105deg,
      transparent 40%,
      rgba(255,255,255,0.7) 50%,
      transparent 60%)`;
    shimmerLayer.style.backgroundSize = '200% 100%';
    shimmerLayer.style.backgroundPosition = '-100% 0';
    shimmerLayer.style.opacity = '0';
    shimmerLayer.style.mixBlendMode = 'overlay';
    shimmerLayer.style.pointerEvents = 'none';
    fill.appendChild(shimmerLayer);

    // Aurora effect overlay
    const aurora = document.createElement('div');
    aurora.className = 'animation-element';
    aurora.style.position = 'absolute';
    aurora.style.inset = '-10px';
    aurora.style.background = `radial-gradient(ellipse at center,
      rgba(198,255,119,0) 0%,
      rgba(198,255,119,0.2) 50%,
      rgba(198,255,119,0) 100%)`;
    aurora.style.opacity = '0';
    aurora.style.filter = 'blur(10px)';
    aurora.style.pointerEvents = 'none';
    trackContainer.appendChild(aurora);

    const duration = 1600;

    // Main fill animation
    fill.animate([
      { transform: 'scaleX(0)' },
      { transform: 'scaleX(1)' }
    ], {
      duration,
      fill: 'forwards',
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    });

    // Gradient sweep animation
    gradientBase.animate([
      { backgroundPosition: '100% 0' },
      { backgroundPosition: '0% 0' }
    ], {
      duration,
      fill: 'forwards',
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    });

    // Shimmer sweep
    shimmerLayer.animate([
      { backgroundPosition: '-100% 0', opacity: '0' },
      { backgroundPosition: '-100% 0', opacity: '0', offset: 0.3 },
      { backgroundPosition: '0% 0', opacity: '1', offset: 0.6 },
      { backgroundPosition: '100% 0', opacity: '1', offset: 0.9 },
      { backgroundPosition: '100% 0', opacity: '0' }
    ], {
      duration,
      fill: 'forwards',
      easing: 'linear'
    });

    // Aurora glow animation
    aurora.animate([
      { opacity: '0', transform: 'scale(0.8)' },
      { opacity: '0', transform: 'scale(0.8)', offset: 0.4 },
      { opacity: '1', transform: 'scale(1.1)', offset: 0.7 },
      { opacity: '0', transform: 'scale(1)' }
    ], {
      duration,
      fill: 'forwards',
      easing: 'ease-out'
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
      className="pf-progress-demo pf-progress-gradient"
      data-animation-id="progress-bars__progress-gradient"
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
