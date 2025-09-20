import React, { useEffect, useRef } from 'react';
import './reward-feedback.css';

export function RewardFeedbackFocusRing() {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    // Cancel any existing animations and clean up existing rings
    button.getAnimations().forEach((anim) => anim.cancel());
    const existingRings = button.querySelectorAll('.pf-reward-feedback__ring');
    existingRings.forEach(ring => ring.remove());

    // Create ring element
    const ring = document.createElement('span');
    ring.className = 'pf-reward-feedback__ring';
    button.appendChild(ring);

    // Start the animation - plays once on mount
    const duration = 800; // 800ms as specified
    const animation = ring.animate([
      { 
        opacity: '0.6',
        transform: 'translate(-50%, -50%) scale(1)'
      },
      { 
        opacity: '0',
        transform: 'translate(-50%, -50%) scale(1.6)'
      }
    ], {
      duration,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)', // gentle easing
      fill: 'forwards'
    });

    // Remove ring after animation completes
    animation.finished.then(() => {
      ring.remove();
    }).catch(() => {
      // Animation was cancelled
      ring.remove();
    });

    return () => {
      animation.cancel();
      ring.remove();
    };
  }, []); // Empty dependency array - only runs on mount

  return (
    <div 
      className="pf-reward-feedback" 
      data-animation-id="reward-feedback__focus-ring"
    >
      <button
        ref={buttonRef}
        className="pf-reward-feedback__button"
        style={{
          background: 'rgba(236, 195, 255, 0.08)'
        }}
      >
        Focus Ring
      </button>
    </div>
  );
}
