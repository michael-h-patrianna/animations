import React, { useEffect, useRef } from 'react';
import './reward-feedback.css';

export function RewardFeedbackClickRippleStrong() {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    // Cancel any existing animations and clean up existing ripples
    button.getAnimations().forEach((anim) => anim.cancel());
    const existingRipples = button.querySelectorAll('.pf-reward-feedback__ripple');
    existingRipples.forEach(ripple => ripple.remove());

    // Create ripple element
    const ripple = document.createElement('span');
    ripple.className = 'pf-reward-feedback__ripple';
    button.appendChild(ripple);

    // Start the animation - plays once on mount
    const duration = 600; // 600ms as specified
    const animation = ripple.animate([
      { 
        opacity: '0.6',
        transform: 'translate(-50%, -50%) scale(0.3)'
      },
      { 
        opacity: '0',
        transform: 'translate(-50%, -50%) scale(1.6)'
      }
    ], {
      duration,
      easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)', // Exact specification
      fill: 'forwards'
    });

    // Remove ripple after animation completes
    animation.finished.then(() => {
      ripple.remove();
    }).catch(() => {
      // Animation was cancelled
      ripple.remove();
    });

    return () => {
      animation.cancel();
      ripple.remove();
    };
  }, []); // Empty dependency array - only runs on mount

  return (
    <div 
      className="pf-reward-feedback" 
      data-animation-id="reward-feedback__click-ripple-strong"
    >
      <button
        ref={buttonRef}
        className="pf-reward-feedback__button"
        style={{
          background: 'rgba(236, 195, 255, 0.12)'
        }}
      >
        Strong Ripple
      </button>
    </div>
  );
}
