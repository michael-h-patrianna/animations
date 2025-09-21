import React from 'react';
import './standard-effects.css';
import shakeIcon from '@/assets/shake_icon.png';

export function StandardEffectsShake() {
  return (
    <div className="standard-demo-container">
      <img 
        src={shakeIcon} 
        alt="Shake animation" 
        className="shake-element"
        style={{ width: '120px', height: 'auto' }}
      />
    </div>
  );
}