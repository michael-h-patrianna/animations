import React, { useEffect, useRef } from 'react';
import './reward-basic.css';

export function RewardBasicBadgeGlint() {
  const iconRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const icon = iconRef.current;
    if (!icon) return;

    // Cancel any existing animations
    icon.getAnimations().forEach((anim) => anim.cancel());
    icon.style.transform = 'none';
    icon.style.opacity = '1';

    // Start the animation - plays once on mount
    const duration = 420; // durations.lg from showcase.html
    const animation = icon.animate([
      { 
        transform: 'scale(0.94)', 
        opacity: '0.85' 
      },
      { 
        transform: 'scale(1.06)', 
        opacity: '1' 
      },
      { 
        transform: 'scale(1)', 
        opacity: '1' 
      }
    ], {
      duration,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)', // easingCurves.gentle
      fill: 'forwards'
    });

    return () => {
      animation.cancel();
    };
  }, []); // Empty dependency array - only runs on mount

  return (
    <div 
      className="pf-reward-basic" 
      data-animation-id="reward-basic__badge-glint"
    >
      <div
        ref={iconRef}
        className="pf-reward-basic__icon"
        style={{
          background: 'linear-gradient(135deg, #ff5981 0%, #ffce1a 100%)',
          color: '#1d092f'
        }}
      >
        ★
      </div>
      <span className="pf-reward-basic__label">Badge Glint</span>
    </div>
  );
}
