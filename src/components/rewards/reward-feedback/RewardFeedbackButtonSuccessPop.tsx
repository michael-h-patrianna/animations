import React, { useEffect, useRef } from 'react';
import './reward-feedback.css';

export function RewardFeedbackButtonSuccessPop() {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    // Cancel any existing animations
    button.getAnimations().forEach((anim) => anim.cancel());
    button.style.transform = 'none';
    button.style.filter = 'none';

    // Start the animation - plays once on mount
    const duration = 600; // 600ms as specified
    const animation = button.animate([
      { 
        transform: 'scale(1)', 
        filter: 'brightness(1)' 
      },
      { 
        transform: 'scale(1.08)', 
        filter: 'brightness(1.2)' 
      },
      { 
        transform: 'scale(1)', 
        filter: 'brightness(1)' 
      }
    ], {
      duration,
      easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)', // Exact specification
      fill: 'forwards'
    });

    return () => {
      animation.cancel();
    };
  }, []); // Empty dependency array - only runs on mount

  return (
    <div 
      className="pf-reward-feedback" 
      data-animation-id="reward-feedback__button-success-pop"
    >
      <button
        ref={buttonRef}
        className="pf-reward-feedback__button"
        style={{
          background: 'linear-gradient(135deg, #1bee02 0%, #00ad45 100%)'
        }}
      >
        Success CTA
      </button>
    </div>
  );
}
