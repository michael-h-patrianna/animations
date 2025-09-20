import React, { useEffect, useRef } from 'react';
import './reward-feedback.css';

export function RewardFeedbackTilePress() {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    // Cancel any existing animations
    button.getAnimations().forEach((anim) => anim.cancel());
    button.style.transform = 'none';

    // Start the animation - plays once on mount
    const duration = 400; // 400ms as specified
    const animation = button.animate([
      { 
        transform: 'scale(1)' 
      },
      { 
        transform: 'scale(0.94)' 
      },
      { 
        transform: 'scale(1)' 
      }
    ], {
      duration,
      easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)', // Exact specification
      fill: 'forwards'
    });

    return () => {
      animation.cancel();
    };
  }, []); // Empty dependency array - only runs on mount

  return (
    <div 
      className="pf-reward-feedback" 
      data-animation-id="reward-feedback__tile-press"
    >
      <button
        ref={buttonRef}
        className="pf-reward-feedback__button"
        style={{
          background: 'linear-gradient(135deg, #4e187c 0%, #3a125d 100%)'
        }}
      >
        Tile Press
      </button>
    </div>
  );
}
