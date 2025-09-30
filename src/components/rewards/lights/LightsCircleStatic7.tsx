import React, { useMemo } from 'react';
import './LightsCircleStatic7.css';
import { calculateBulbColors } from '@/utils/colors';

interface LightsCircleStatic7Props {
  numBulbs?: number;
  onColor?: string;
}

const LightsCircleStatic7: React.FC<LightsCircleStatic7Props> = ({
  numBulbs = 16,
  onColor = '#ffd700'
}) => {
  const colors = useMemo(() => calculateBulbColors(onColor), [onColor]);
  const radius = 80;
  const animationDuration = 3; // seconds
  const delayPerBulb = animationDuration / numBulbs;

  const bulbs = Array.from({ length: numBulbs }, (_, i) => {
    const angle = (i * 360) / numBulbs - 90;
    const angleRad = (angle * Math.PI) / 180;
    const x = radius * Math.cos(angleRad);
    const y = radius * Math.sin(angleRad);

    return (
      <div
        key={i}
        className="lights-circle-static-7__bulb-wrapper"
        style={{
          transform: `translate(${x}px, ${y}px)`,
          '--bulb-index': i,
          '--delay-per-bulb': `${delayPerBulb}s`,
        } as React.CSSProperties}
      >
        <div className="lights-circle-static-7__glow" />
        <div className="lights-circle-static-7__bulb" />
      </div>
    );
  });

  return (
    <div
      className="lights-circle-static-7"
      style={{
        '--bulb-on': colors.on,
        '--bulb-off': colors.off,
        '--bulb-blend90': colors.blend90,
        '--bulb-blend80': colors.blend80,
        '--bulb-blend70': colors.blend70,
        '--bulb-blend60': colors.blend60,
        '--bulb-blend40': colors.blend40,
        '--bulb-blend30': colors.blend30,
        '--bulb-blend20': colors.blend20,
        '--bulb-blend10': colors.blend10,
        '--bulb-off-tint30': colors.offTint30,
        '--bulb-off-tint20': colors.offTint20,
        '--bulb-on-glow80': colors.onGlow80,
        '--bulb-on-glow70': colors.onGlow70,
        '--bulb-on-glow60': colors.onGlow60,
        '--bulb-on-glow50': colors.onGlow50,
        '--bulb-on-glow45': colors.onGlow45,
        '--bulb-on-glow35': colors.onGlow35,
        '--bulb-on-glow30': colors.onGlow30,
        '--bulb-off-glow35': colors.offGlow35,
        '--bulb-off-glow30': colors.offGlow30,
      } as React.CSSProperties}
    >
      <div className="lights-circle-static-7__container">{bulbs}</div>
    </div>
  );
};

export default LightsCircleStatic7;
