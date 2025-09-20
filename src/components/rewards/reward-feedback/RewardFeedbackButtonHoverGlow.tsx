import React, { useEffect, useRef } from 'react';
import './reward-feedback.css';

export function RewardFeedbackButtonHoverGlow() {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    // Cancel any existing animations
    button.getAnimations().forEach((anim) => anim.cancel());
    button.style.boxShadow = 'none';

    // Start the animation - plays once on mount
    const duration = 1000; // 1000ms as specified
    const animation = button.animate([
      { 
        boxShadow: '0 0 0 rgba(236,195,255,0)' 
      },
      { 
        boxShadow: '0 0 22px rgba(236,195,255,0.5)' 
      },
      { 
        boxShadow: '0 0 0 rgba(236,195,255,0)' 
      }
    ], {
      duration,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)', // Exact specification
      fill: 'forwards'
    });

    return () => {
      animation.cancel();
    };
  }, []); // Empty dependency array - only runs on mount

  return (
    <div 
      className="pf-reward-feedback" 
      data-animation-id="reward-feedback__button-hover-glow"
    >
      <button
        ref={buttonRef}
        className="pf-reward-feedback__button"
        style={{
          background: 'rgba(236, 195, 255, 0.18)'
        }}
      >
        Hover Glow
      </button>
    </div>
  );
}
