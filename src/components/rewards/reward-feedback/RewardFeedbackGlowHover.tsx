import React, { useEffect, useRef } from 'react';
import './reward-feedback.css';

export function RewardFeedbackGlowHover() {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    // Cancel any existing animations
    button.getAnimations().forEach((anim) => anim.cancel());
    button.style.boxShadow = 'none';

    // Start the animation - plays once on mount
    const duration = 900; // 900ms as specified
    const animation = button.animate([
      { 
        boxShadow: '0 0 0 rgba(200,53,88,0)' 
      },
      { 
        boxShadow: '0 0 24px rgba(200,53,88,0.45)' 
      },
      { 
        boxShadow: '0 0 0 rgba(200,53,88,0)' 
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
      data-animation-id="reward-feedback__glow-hover"
    >
      <button
        ref={buttonRef}
        className="pf-reward-feedback__button"
        style={{
          background: 'linear-gradient(135deg, #c83558 0%, #7a468e 100%)'
        }}
      >
        Glow Hover
      </button>
    </div>
  );
}
