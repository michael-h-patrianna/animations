import { useEffect, useRef } from 'react';
import './progress-bars.css';

export function ProgressBarsProgressStriped() {
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
    fill.style.position = 'relative';
    fill.style.overflow = 'hidden';

    // Create high-quality animated stripes
    const stripesContainer = document.createElement('div');
    stripesContainer.className = 'animation-element';
    stripesContainer.style.position = 'absolute';
    stripesContainer.style.inset = '0';
    stripesContainer.style.background = `repeating-linear-gradient(
      -45deg,
      transparent,
      transparent 8px,
      rgba(255,255,255,0.08) 8px,
      rgba(255,255,255,0.08) 16px
    )`;
    stripesContainer.style.backgroundSize = '32px 32px';
    stripesContainer.style.willChange = 'background-position';
    fill.appendChild(stripesContainer);

    // Add shimmer overlay for extra polish
    const shimmer = document.createElement('div');
    shimmer.className = 'animation-element';
    shimmer.style.position = 'absolute';
    shimmer.style.inset = '0';
    shimmer.style.background = 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)';
    shimmer.style.backgroundSize = '200% 100%';
    shimmer.style.opacity = '0';
    shimmer.style.pointerEvents = 'none';
    fill.appendChild(shimmer);

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

    // Animate stripes with acceleration
    let stripeSpeed = 0;
    const animateStripes = () => {
      if (fillAnim.playState === 'finished') {
        stripeSpeed = Math.max(0, stripeSpeed - 0.5);
      } else {
        stripeSpeed = Math.min(20, stripeSpeed + 0.3);
      }
      if (stripeSpeed > 0) {
        const currentPos = parseFloat(stripesContainer.style.backgroundPositionX || '0');
        stripesContainer.style.backgroundPosition = `${currentPos + stripeSpeed}px 0`;
        requestAnimationFrame(animateStripes);
      }
    };
    animateStripes();

    // Shimmer effect during fill
    shimmer.animate([
      { backgroundPosition: '-100% 0', opacity: '0' },
      { backgroundPosition: '-100% 0', opacity: '0', offset: 0.3 },
      { backgroundPosition: '0% 0', opacity: '0.4', offset: 0.5 },
      { backgroundPosition: '100% 0', opacity: '0.4', offset: 0.7 },
      { backgroundPosition: '200% 0', opacity: '0' }
    ], {
      duration,
      fill: 'forwards',
      easing: 'ease-in-out'
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
      className="pf-progress-demo pf-progress-striped"
      data-animation-id="progress-bars__progress-striped"
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
