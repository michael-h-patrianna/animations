import { useEffect, useRef } from 'react';
import './reward-basic.css';

export function RewardBasicBounceSoft() {
  const iconRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const icon = iconRef.current;
    if (!icon) return;

    // Cancel any existing animations
    icon.getAnimations().forEach((anim) => anim.cancel());
    icon.style.transform = 'none';

    // Start the animation - plays once on mount
    const duration = 320; // durations.md from showcase.html
    const animation = icon.animate([
      { transform: 'translateY(0px) scale(1)' },
      { transform: 'translateY(-10px) scale(1.08)' },
      { transform: 'translateY(0px) scale(1)' }
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
      data-animation-id="reward-basic__bounce-soft"
    >
      <div
        ref={iconRef}
        className="pf-reward-basic__icon"
        style={{
          background: 'linear-gradient(135deg, #ffb3c6 0%, #c83558 100%)',
          color: '#ffffff'
        }}
      >
        ⬤
      </div>
      <span className="pf-reward-basic__label">Soft Bounce</span>
    </div>
  );
}
