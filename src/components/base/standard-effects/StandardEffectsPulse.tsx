import React from 'react';
import './standard-effects.css';
import pulseScroll from '@/assets/pulse_scroll.png';

export function StandardEffectsPulse() {
  return (
    <div className="standard-demo-container">
      <img 
        src={pulseScroll} 
        alt="Pulsing scroll" 
        className="pulse-element"
        style={{ width: '140px', height: 'auto' }}
      />
    </div>
  );
}