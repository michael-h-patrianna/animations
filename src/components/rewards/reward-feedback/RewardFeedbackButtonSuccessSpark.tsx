import React, { useEffect, useRef } from 'react';
import './reward-feedback.css';

export function RewardFeedbackButtonSuccessSpark() {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    // Cancel any existing animations
    button.getAnimations().forEach((anim) => anim.cancel());
    button.style.transform = 'none';
    button.style.boxShadow = 'none';

    // Start the animation - plays once on mount
    const duration = 700; // 700ms as specified
    const animation = button.animate([
      { 
        transform: 'scale(1)', 
        boxShadow: '0 0 0 rgba(71,255,244,0)' 
      },
      { 
        transform: 'scale(1.12)', 
        boxShadow: '0 0 28px rgba(71,255,244,0.5)' 
      },
      { 
        transform: 'scale(1)', 
        boxShadow: '0 0 0 rgba(71,255,244,0)' 
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
      data-animation-id="reward-feedback__button-success-spark"
    >
      <button
        ref={buttonRef}
        className="pf-reward-feedback__button"
        style={{
          background: 'linear-gradient(135deg, #47fff4 0%, #0586ae 100%)'
        }}
      >
        Spark CTA
      </button>
    </div>
  );
}
