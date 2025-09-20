import React, { useEffect, useRef } from 'react';
import './reward-feedback.css';

export function RewardFeedbackClickRippleSoft() {
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
    const duration = 700; // 700ms as specified
    const animation = ripple.animate([
      { 
        opacity: '0.45',
        transform: 'translate(-50%, -50%) scale(0.4)'
      },
      { 
        opacity: '0',
        transform: 'translate(-50%, -50%) scale(1.4)'
      }
    ], {
      duration,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)', // gentle easing
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
      data-animation-id="reward-feedback__click-ripple-soft"
    >
      <button
        ref={buttonRef}
        className="pf-reward-feedback__button"
        style={{
          background: 'rgba(236, 195, 255, 0.08)'
        }}
      >
        Soft Ripple
      </button>
    </div>
  );
}
