import { useEffect, useRef } from 'react';
import './reward-basic.css';

export function RewardBasicBounceEnergy() {
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
      { transform: 'translateY(0px) scale(1) rotate(-6deg)' },
      { transform: 'translateY(-18px) scale(1.15) rotate(4deg)' },
      { transform: 'translateY(0px) scale(1) rotate(0deg)' }
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
      data-animation-id="reward-basic__bounce-energy"
    >
      <div
        ref={iconRef}
        className="pf-reward-basic__icon"
        style={{
          background: 'linear-gradient(135deg, #c6ff77 0%, #47fff4 100%)',
          color: '#1d092f'
        }}
      >
        ⬤
      </div>
      <span className="pf-reward-basic__label">Energetic Bounce</span>
    </div>
  );
}
