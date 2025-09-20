import React, { useEffect, useRef } from 'react';
import './reward-basic.css';

export function RewardBasicGlowOrbit() {
  const iconRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const icon = iconRef.current;
    if (!icon) return;

    // Cancel any existing animations
    icon.getAnimations().forEach((anim) => anim.cancel());
    icon.style.transform = 'none';
    icon.style.boxShadow = 'none';

    // Start the animation - plays once on mount
    const duration = 520; // durations.xl from showcase.html
    const animation = icon.animate([
      { 
        transform: 'rotate(0deg)', 
        boxShadow: '0 0 0 rgba(198,255,119,0)' 
      },
      { 
        transform: 'rotate(180deg)', 
        boxShadow: '0 0 20px rgba(198,255,119,0.45)',
        offset: 0.5 
      },
      { 
        transform: 'rotate(360deg)', 
        boxShadow: '0 0 0 rgba(198,255,119,0)' 
      }
    ], {
      duration,
      easing: 'linear', // linear easing for orbit
      fill: 'forwards'
    });

    return () => {
      animation.cancel();
    };
  }, []); // Empty dependency array - only runs on mount

  return (
    <div 
      className="pf-reward-basic" 
      data-animation-id="reward-basic__glow-orbit"
    >
      <div
        ref={iconRef}
        className="pf-reward-basic__icon"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(198,255,119,0.85) 0%, rgba(29,9,47,0.4) 70%)',
          color: '#1d092f'
        }}
      >
        ◎
      </div>
      <span className="pf-reward-basic__label">Glow Orbit</span>
    </div>
  );
}
