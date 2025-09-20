import React, { useEffect, useRef } from 'react';
import './reward-feedback.css';

export function RewardFeedbackButtonHoverTilt() {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    // Cancel any existing animations
    button.getAnimations().forEach((anim) => anim.cancel());
    button.style.transform = 'none';

    // Start the animation - plays once on mount
    const duration = 800; // 800ms as specified
    const animation = button.animate([
      { 
        transform: 'rotate(0deg) translateY(0px)' 
      },
      { 
        transform: 'rotate(-4deg) translateY(-2px)' 
      },
      { 
        transform: 'rotate(4deg) translateY(-1px)' 
      },
      { 
        transform: 'rotate(0deg) translateY(0px)' 
      }
    ], {
      duration,
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)', // Exact specification
      fill: 'forwards'
    });

    return () => {
      animation.cancel();
    };
  }, []); // Empty dependency array - only runs on mount

  return (
    <div 
      className="pf-reward-feedback" 
      data-animation-id="reward-feedback__button-hover-tilt"
    >
      <button
        ref={buttonRef}
        className="pf-reward-feedback__button"
        style={{
          background: 'rgba(236, 195, 255, 0.12)'
        }}
      >
        Hover Tilt
      </button>
    </div>
  );
}
