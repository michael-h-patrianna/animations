import React from 'react';
import './standard-effects.css';
import giftBoxImage from '@/assets/present_box.png';

export function StandardEffectsBounce() {
  return (
    <div className="standard-demo-container">
      <img 
        src={giftBoxImage} 
        alt="Bouncing gift box" 
        className="bounce-element"
        style={{ width: '120px', height: 'auto' }}
      />
    </div>
  );
}