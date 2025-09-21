import { useEffect, useRef } from 'react';
import starIcon from '@/assets/achievement/star-gold.png';
import './progress-bars.css';

export function ProgressBarsMissionCheckpoints() {
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

  // Reset fill for mission route
    fill.style.transform = 'scaleX(0)';
    fill.style.transformOrigin = 'left center';
  // Use catalog theme colors
  fill.style.background = 'linear-gradient(90deg, var(--pf-progress-primary) 0%, var(--pf-progress-secondary) 100%)';
    fill.style.height = '4px';
    fill.style.borderRadius = '2px';

    // Create checkpoint positions and data (small, crisp labels)
    const checkpoints = [
      { position: 0, label: 'ALPHA', code: 'α', secured: false },
      { position: 0.25, label: 'BRAVO', code: 'β', secured: false },
      { position: 0.5, label: 'CHARLIE', code: 'χ', secured: false },
      { position: 0.75, label: 'DELTA', code: 'δ', secured: false },
      { position: 1, label: 'ECHO', code: 'ε', secured: false }
    ];

    const checkpointMarkers: Array<{
      container: HTMLElement,
      marker: HTMLElement,
      signalBars: HTMLElement[],
      label: HTMLElement,
      position: number,
      isSecured: boolean
    }> = [];

    // Create checkpoint markers (compact sizing)
    checkpoints.forEach((checkpoint, index) => {
      const markerContainer = document.createElement('div');
      markerContainer.className = 'animation-element pf-mission-checkpoint-container';
      markerContainer.style.position = 'absolute';
      markerContainer.style.left = `${checkpoint.position * 100}%`;
      markerContainer.style.top = '50%';
      markerContainer.style.transform = 'translate(-50%, -50%)';
  markerContainer.style.width = '18px';
  markerContainer.style.height = '18px';
      markerContainer.style.pointerEvents = 'none';
      markerContainer.style.zIndex = '3';
  // data attributes for testing and state
  markerContainer.dataset.index = String(index);
  markerContainer.dataset.secured = 'false';
      trackContainer.appendChild(markerContainer);

    // Checkpoint marker (diamond)
      const marker = document.createElement('div');
      marker.className = 'pf-mission-checkpoint';
      marker.style.position = 'absolute';
      marker.style.inset = '0';
  marker.style.background = 'rgba(28, 24, 36, 0.9)';
  marker.style.border = '1px solid rgba(196, 122, 229, 0.35)';
  marker.style.borderRadius = '3px';
  marker.style.transform = 'rotate(45deg) scale(0.92)';
      marker.style.transition = 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
      marker.style.display = 'flex';
      marker.style.alignItems = 'center';
      marker.style.justifyContent = 'center';
  marker.style.fontSize = '8px';
    marker.style.fontWeight = '700';
  marker.style.color = 'rgba(255, 255, 255, 0.85)';
      markerContainer.appendChild(marker);

    // Milestone icon (replaces code symbol)
    const icon = document.createElement('img');
    icon.src = starIcon;
    icon.alt = `${checkpoint.label} milestone`;
    icon.style.transform = 'rotate(-45deg)';
    icon.style.width = '10px';
    icon.style.height = '10px';
    icon.style.objectFit = 'contain';
    icon.style.filter = 'drop-shadow(0 0 2px rgba(255, 238, 170, 0.55))';
    marker.appendChild(icon);

      // (Removed milestone icons above the bar)
      const signalBars: HTMLElement[] = [];

      // Checkpoint label
      const label = document.createElement('div');
      label.className = 'pf-mission-checkpoint-label';
      label.style.position = 'absolute';
  label.style.top = '28px';
      label.style.left = '50%';
      label.style.transform = 'translateX(-50%)';
  label.style.fontSize = '7px';
      label.style.fontWeight = '700';
  label.style.color = 'rgba(235, 231, 239, 0.6)';
      label.style.textAlign = 'center';
      label.style.whiteSpace = 'nowrap';
      label.style.fontFamily = 'monospace';
      label.style.letterSpacing = '0.5px';
      label.textContent = checkpoint.label;
      markerContainer.appendChild(label);

      checkpointMarkers.push({
        container: markerContainer,
        marker,
        signalBars,
        label,
        position: checkpoint.position,
        isSecured: false
      });
    });

  // (Removed status message)

    // Radio static overlay (for effect between checkpoints)
    const staticOverlay = document.createElement('div');
  staticOverlay.className = 'animation-element pf-mission-static';
    staticOverlay.style.position = 'absolute';
    staticOverlay.style.inset = '0';
  staticOverlay.style.background = 'repeating-linear-gradient(90deg, transparent 0px, rgba(215, 154, 243, 0.03) 1px, transparent 2px)';
    staticOverlay.style.opacity = '0';
    staticOverlay.style.pointerEvents = 'none';
    staticOverlay.style.borderRadius = '2px';
    track.appendChild(staticOverlay);

    // Main mission progress animation
  const duration = 2000; // 2 seconds total

    // Deterministic activation schedule
    const activationTimeouts: number[] = [];
    const activatedCheckpoints = new Set<number>();
    const missionStart = performance.now();

    // Animate progress fill
    fill.animate([
      { transform: 'scaleX(0)' },
      { transform: 'scaleX(1)' }
    ], {
      duration,
      fill: 'forwards',
      easing: 'linear'
    });

    // Static effect animation
    staticOverlay.animate([
      { opacity: '0' },
      { opacity: '0.6', offset: 0.1 },
      { opacity: '0.3', offset: 0.9 },
      { opacity: '0' }
    ], {
      duration: duration + 500,
      fill: 'forwards'
    });

    // Activation logic at precise times to ensure crisp sync
    const activateCheckpoint = (index: number) => {
      if (activatedCheckpoints.has(index)) return;
      activatedCheckpoints.add(index);

      const { marker, signalBars, label, container } = checkpointMarkers[index];

      // Mark secured + record activation time (relative to start)
  container.dataset.secured = 'true';
  container.dataset.activationTime = String(Math.round(performance.now() - missionStart));

      // Secure checkpoint with spring animation
  marker.style.transform = 'rotate(45deg) scale(1.04)';
  marker.style.background = 'linear-gradient(135deg, rgba(196, 122, 229, 0.25) 0%, rgba(215, 154, 243, 0.4) 100%)';
  marker.style.borderColor = 'rgba(215, 154, 243, 0.7)';
  marker.style.boxShadow = '0 0 8px rgba(215, 154, 243, 0.45), inset 0 0 4px rgba(215, 154, 243, 0.2)';
  marker.style.color = '#0b0013';

      // Activate signal bars sequentially (secondary animation)
      signalBars.forEach((bar, barIndex) => {
        setTimeout(() => {
          bar.style.background = '#d79af3';
          bar.style.boxShadow = '0 0 6px rgba(215, 154, 243, 0.6)';
        }, barIndex * 90);
      });

      // Highlight checkpoint label
  label.style.color = 'rgba(235, 231, 239, 0.9)';
      label.style.fontWeight = '800';
  label.style.textShadow = '0 0 6px rgba(215, 154, 243, 0.35)';

      // (Removed status message updates)

      // Pulse ring effect around marker
      const pulseRing = document.createElement('div');
      pulseRing.style.position = 'absolute';
  pulseRing.style.inset = '-5px';
  pulseRing.style.border = '2px solid rgba(215, 154, 243, 0.7)';
      pulseRing.style.borderRadius = '6px';
      pulseRing.style.transform = 'rotate(45deg)';
      pulseRing.style.pointerEvents = 'none';
      container.appendChild(pulseRing);

      pulseRing
        .animate(
          [
            { transform: 'rotate(45deg) scale(0.85)', opacity: '0' },
            { transform: 'rotate(45deg) scale(1.2)', opacity: '1', offset: 0.35 },
            { transform: 'rotate(45deg) scale(1.5)', opacity: '0' }
          ],
          { duration: 520, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }
        )
        .addEventListener('finish', () => {
          pulseRing.remove();
        });

      // (Removed status fade logic)
    };

    // Schedule activations exactly at each position crossing
    checkpointMarkers.forEach(({ position }, index) => {
      const t = Math.max(0, Math.min(duration, Math.round(position * duration)));
      const timeoutId = window.setTimeout(() => activateCheckpoint(index), t);
      activationTimeouts.push(timeoutId);
    });

    // Cleanup function
    return () => {
      const elements = container.querySelectorAll('.animation-element');
      elements.forEach(el => el.remove());
      activatedCheckpoints.clear();
      activationTimeouts.forEach(id => clearTimeout(id));
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="pf-progress-demo pf-mission-checkpoints"
      data-animation-id="progress-bars__mission-checkpoints"
    >
      <div className="track-container">
        <div className="pf-progress-track">
          <div className="pf-progress-fill"></div>
        </div>
      </div>
    </div>
  );
}
