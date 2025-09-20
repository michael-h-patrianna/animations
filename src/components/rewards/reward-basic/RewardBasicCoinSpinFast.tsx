import React, { useEffect, useRef } from 'react';
import './reward-basic.css';

export function RewardBasicCoinSpinFast() {
  const iconRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const icon = iconRef.current;
    if (!icon) return;

    // Cancel any existing animations
    icon.getAnimations().forEach((anim) => anim.cancel());
    icon.style.transform = 'none';

    // Start the animation - plays once on mount
    const duration = Math.max((240 / 1000) * 0.8, 0.28) * 1000; // durations.sm * 0.8, min 280ms
    const animation = icon.animate([
      { transform: 'rotateY(0deg) scale(0.92)' },
      { transform: 'rotateY(720deg) scale(1.12)', offset: 0.7 },
      { transform: 'rotateY(720deg) scale(1)' }
    ], {
      duration,
      easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)', // easingCurves.vibrant
      fill: 'forwards'
    });

    return () => {
      animation.cancel();
    };
  }, []); // Empty dependency array - only runs on mount

  return (
    <div 
      className="pf-reward-basic" 
      data-animation-id="reward-basic__coin-spin-fast"
    >
      <div
        ref={iconRef}
        className="pf-reward-basic__icon"
        style={{
          background: 'linear-gradient(135deg, #ffe066 0%, #ff9500 100%)',
          color: '#14021f'
        }}
      >
        ◎
      </div>
      <span className="pf-reward-basic__label">Quick Coin Spin</span>
    </div>
  );
}
