import { useEffect, useRef } from 'react';
import './progress-bars.css';

export function ProgressBarsProgressMilestones() {
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

    // Create milestone positions
    const milestonePositions = [0, 0.25, 0.5, 0.75, 1];
    const milestoneMarkers: Array<{
      container: HTMLElement,
      marker: HTMLElement,
      innerGlow: HTMLElement,
      ring: HTMLElement,
      position: number,
      label?: HTMLElement
    }> = [];

    // Create milestone markers
    milestonePositions.forEach((pos, index) => {
      const markerContainer = document.createElement('div');
      markerContainer.className = 'animation-element';
      markerContainer.style.position = 'absolute';
      markerContainer.style.left = `${pos * 100}%`;
      markerContainer.style.top = '50%';
      markerContainer.style.transform = 'translate(-50%, -50%)';
      markerContainer.style.width = '20px';
      markerContainer.style.height = '20px';
      markerContainer.style.pointerEvents = 'none';
      trackContainer.appendChild(markerContainer);

      // Diamond shape marker
      const marker = document.createElement('div');
      marker.style.position = 'absolute';
      marker.style.inset = '0';
      marker.style.background = 'rgba(78,24,124,0.8)';
      marker.style.border = '2px solid rgba(255,255,255,0.2)';
      marker.style.borderRadius = '50%';
      marker.style.transform = 'rotate(45deg) scale(0.5)';
      marker.style.transition = 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
      markerContainer.appendChild(marker);

      // Inner glow
      const innerGlow = document.createElement('div');
      innerGlow.style.position = 'absolute';
      innerGlow.style.inset = '20%';
      innerGlow.style.background = 'rgba(255,255,255,0.9)';
      innerGlow.style.borderRadius = '50%';
      innerGlow.style.opacity = '0';
      // Simulate blur with radial gradient for RN compatibility
      innerGlow.style.background = 'radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.3) 50%, transparent 100%)';
      innerGlow.style.transition = 'all 0.3s ease';
      markerContainer.appendChild(innerGlow);

      // Outer ring pulse
      const ring = document.createElement('div');
      ring.style.position = 'absolute';
      ring.style.inset = '-10px';
      ring.style.border = '2px solid rgba(255,255,255,0.8)';
      ring.style.borderRadius = '50%';
      ring.style.opacity = '0';
      ring.style.pointerEvents = 'none';
      markerContainer.appendChild(ring);

      milestoneMarkers.push({
        container: markerContainer,
        marker,
        innerGlow,
        ring,
        position: pos
      });
    });

    // Add milestone labels
    const labelContainer = document.createElement('div');
    labelContainer.className = 'animation-element';
    labelContainer.style.position = 'absolute';
    labelContainer.style.inset = '0';
    labelContainer.style.top = '100%';
    labelContainer.style.marginTop = '8px';
    labelContainer.style.display = 'flex';
    labelContainer.style.justifyContent = 'space-between';
    labelContainer.style.fontSize = '10px';
    labelContainer.style.color = 'rgba(236,195,255,0.5)';
    labelContainer.style.pointerEvents = 'none';
    trackContainer.appendChild(labelContainer);

    ['Start', '25%', '50%', '75%', '100%'].forEach((label, i) => {
      const span = document.createElement('span');
      span.textContent = label;
      span.style.position = 'absolute';
      span.style.left = `${milestonePositions[i] * 100}%`;
      span.style.transform = 'translateX(-50%)';
      span.style.opacity = '0.5';
      span.style.transition = 'all 0.3s ease';
      labelContainer.appendChild(span);
      if (milestoneMarkers[i]) {
        milestoneMarkers[i].label = span;
      }
    });

    // Main fill animation
    const duration = 4000; // Fixed 4 seconds duration
    const fillAnim = fill.animate([
      { transform: 'scaleX(0)' },
      { transform: 'scaleX(1)' }
    ], {
      duration,
      fill: 'forwards',
      easing: 'linear' // Use linear for predictable milestone timing
    });

    // Track animation progress and activate milestones
    let activatedMilestones = new Set();
    const checkMilestones = () => {
      const progress = fillAnim.currentTime! / duration;
      milestoneMarkers.forEach(({ marker, innerGlow, ring, position, label }, index) => {
        if (progress >= position && !activatedMilestones.has(index)) {
          activatedMilestones.add(index);
          
          // Activate marker
          marker.style.transform = 'rotate(45deg) scale(1)';
          marker.style.background = 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(236,195,255,1))';
          marker.style.borderColor = 'rgba(255,255,255,1)';
          marker.style.boxShadow = '0 0 25px rgba(255,255,255,0.9), 0 0 50px rgba(236,195,255,0.5)';
          
          // Glow effect
          innerGlow.style.opacity = '1';
          
          // Pulse ring
          ring.animate([
            { transform: 'scale(0.8)', opacity: '0' },
            { transform: 'scale(1.5)', opacity: '1', offset: 0.3 },
            { transform: 'scale(2)', opacity: '0' }
          ], { duration: 600, easing: 'ease-out' });
          
          // Highlight label
          if (label) {
            label.style.opacity = '1';
            label.style.color = 'rgba(255,255,255,1)';
            label.style.fontWeight = '600';
          }
        }
      });
      
      if (fillAnim.playState === 'running') {
        requestAnimationFrame(checkMilestones);
      }
    };
    requestAnimationFrame(checkMilestones);

    // Cleanup function
    return () => {
      const elements = container.querySelectorAll('.animation-element');
      elements.forEach(el => el.remove());
      activatedMilestones.clear();
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="pf-progress-demo pf-progress-milestones"
      data-animation-id="progress-bars__progress-milestones"
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
