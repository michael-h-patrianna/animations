import React, { useEffect, useRef } from 'react';
import './reward-feedback.css';

export function RewardFeedbackTileActivate() {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    // Cancel any existing animations
    button.getAnimations().forEach((anim) => anim.cancel());
    button.style.transform = 'none';

    // Start the animation - plays once on mount
    const duration = 600; // 600ms as specified
    const animation = button.animate([
      { 
        transform: 'translateY(0px) scale(1)' 
      },
      { 
        transform: 'translateY(-6px) scale(1.02)' 
      },
      { 
        transform: 'translateY(0px) scale(1)' 
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
      data-animation-id="reward-feedback__tile-activate"
    >
      <button
        ref={buttonRef}
        className="pf-reward-feedback__button"
        style={{
          background: 'linear-gradient(135deg, #c47ae5 0%, #7a468e 100%)'
        }}
      >
        Tile Activate
      </button>
    </div>
  );
}
