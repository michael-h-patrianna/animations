import React, { useEffect, useRef } from 'react';
import './reward-basic.css';

export function RewardBasicStarRadiate() {
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
        transform: 'rotate(0deg)', 
        boxShadow: '0 0 0 rgba(71,255,244,0)' 
      },
      { 
        transform: 'rotate(36deg)', 
        boxShadow: '0 0 22px rgba(71,255,244,0.6)', 
        offset: 0.4 
      },
      { 
        transform: 'rotate(-18deg)', 
        boxShadow: '0 0 22px rgba(71,255,244,0.6)', 
        offset: 0.7 
      },
      { 
        transform: 'rotate(0deg)', 
        boxShadow: '0 0 0 rgba(71,255,244,0)' 
      }
    ], {
      duration,
      easing: 'cubic-bezier(0.12, 0.75, 0.4, 1)', // easingCurves.entrance
      fill: 'forwards'
    });

    return () => {
      animation.cancel();
    };
  }, []); // Empty dependency array - only runs on mount

  return (
    <div 
      className="pf-reward-basic" 
      data-animation-id="reward-basic__star-radiate"
    >
      <div
        ref={iconRef}
        className="pf-reward-basic__icon"
        style={{
          background: 'linear-gradient(135deg, #47fff4 0%, #0586ae 100%)',
          color: '#0b1b23'
        }}
      >
        ✹
      </div>
      <span className="pf-reward-basic__label">Star Radiate</span>
    </div>
  );
}
