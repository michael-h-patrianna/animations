import React, { useEffect, useRef } from 'react';
import './reward-basic.css';

export function RewardBasicBadgeSweep() {
  const iconRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const icon = iconRef.current;
    if (!icon) return;

    // Cancel any existing animations
    icon.getAnimations().forEach((anim) => anim.cancel());
    icon.style.transform = 'none';
    icon.style.boxShadow = 'none';

    // Start the animation - plays once on mount
    const duration = 420; // durations.lg from showcase.html
    const animation = icon.animate([
      { 
        transform: 'translateX(-6px)', 
        boxShadow: '0 0 0 rgba(236,195,255,0)' 
      },
      { 
        transform: 'translateX(6px)', 
        boxShadow: '0 0 20px rgba(236,195,255,0.35)' 
      },
      { 
        transform: 'translateX(0px)', 
        boxShadow: '0 0 0 rgba(236,195,255,0)' 
      }
    ], {
      duration,
      easing: 'cubic-bezier(0.22, 0.61, 0.36, 1)', // easingCurves.standard
      fill: 'forwards'
    });

    return () => {
      animation.cancel();
    };
  }, []); // Empty dependency array - only runs on mount

  return (
    <div 
      className="pf-reward-basic" 
      data-animation-id="reward-basic__badge-sweep"
    >
      <div
        ref={iconRef}
        className="pf-reward-basic__icon"
        style={{
          background: 'linear-gradient(135deg, #4e187c 0%, #c47ae5 100%)',
          color: '#ffffff'
        }}
      >
        ★
      </div>
      <span className="pf-reward-basic__label">Badge Sweep</span>
    </div>
  );
}
