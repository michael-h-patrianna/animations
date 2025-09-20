import { useEffect, useRef } from 'react';
import './progress-bars.css';

export function ProgressBarsProgressSoftFill() {
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

    // Create glow layer for bloom effect
    const softGlow = document.createElement('div');
    softGlow.className = 'animation-element';
    softGlow.style.position = 'absolute';
    softGlow.style.inset = '-20px';
    softGlow.style.background = 'radial-gradient(ellipse at right center, rgba(236,195,255,0) 0%, rgba(236,195,255,0) 60%, rgba(236,195,255,0.4) 80%, rgba(236,195,255,0) 100%)';
    softGlow.style.opacity = '0';
    softGlow.style.pointerEvents = 'none';
    softGlow.style.transform = 'scaleX(0)';
    softGlow.style.transformOrigin = 'left center';
    softGlow.style.filter = 'blur(8px)';
    trackContainer.insertBefore(softGlow, track);

    // Create inner highlight for polish
    const innerHighlight = document.createElement('div');
    innerHighlight.className = 'animation-element';
    innerHighlight.style.position = 'absolute';
    innerHighlight.style.inset = '0';
    innerHighlight.style.background = 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)';
    innerHighlight.style.opacity = '0';
    innerHighlight.style.pointerEvents = 'none';
    fill.appendChild(innerHighlight);

    const duration = 1200;

    // Main fill animation with perfect easing
    const fillAnimation = fill.animate([
      { transform: 'scaleX(0)', opacity: '0.8' },
      { transform: 'scaleX(0.7)', opacity: '0.9', offset: 0.7 },
      { transform: 'scaleX(1)', opacity: '1' }
    ], {
      duration,
      fill: 'forwards',
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
    });

    // Glow animation synchronized
    softGlow.animate([
      { transform: 'scaleX(0)', opacity: '0' },
      { transform: 'scaleX(0.7)', opacity: '0', offset: 0.7 },
      { transform: 'scaleX(0.9)', opacity: '0.3', offset: 0.85 },
      { transform: 'scaleX(1)', opacity: '0.6', offset: 0.95 },
      { transform: 'scaleX(1)', opacity: '0' }
    ], {
      duration,
      fill: 'forwards',
      easing: 'ease-out'
    });

    // Inner highlight for extra polish
    innerHighlight.animate([
      { opacity: '0' },
      { opacity: '0', offset: 0.5 },
      { opacity: '0.5', offset: 0.8 },
      { opacity: '0' }
    ], {
      duration,
      fill: 'forwards',
      easing: 'ease-out'
    });

    // Bloom effect at completion
    fillAnimation.finished.then(() => {
      const bloom = document.createElement('div');
      bloom.className = 'animation-element';
      bloom.style.position = 'absolute';
      bloom.style.right = '-10px';
      bloom.style.top = '50%';
      bloom.style.transform = 'translateY(-50%)';
      bloom.style.width = '60px';
      bloom.style.height = '60px';
      bloom.style.background = 'radial-gradient(circle, rgba(236,195,255,0.6) 0%, rgba(236,195,255,0.3) 30%, transparent 70%)';
      bloom.style.pointerEvents = 'none';
      bloom.style.filter = 'blur(2px)';
      trackContainer.appendChild(bloom);

      const bloomAnim = bloom.animate([
        { transform: 'translateY(-50%) scale(0)', opacity: '0' },
        { transform: 'translateY(-50%) scale(1.5)', opacity: '1', offset: 0.3 },
        { transform: 'translateY(-50%) scale(2)', opacity: '0' }
      ], { duration: 600, easing: 'cubic-bezier(0.4, 0, 0.6, 1)' });

      // Remove bloom element after animation completes
      bloomAnim.finished.then(() => {
        bloom.remove();
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
      className="pf-progress-demo pf-progress-soft"
      data-animation-id="progress-bars__progress-soft-fill"
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
