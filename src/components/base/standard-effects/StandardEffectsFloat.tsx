import React from 'react';
import './standard-effects.css';
import balloonImage from '@/assets/present_box_balloon.png';

export function StandardEffectsFloat() {
  return (
    <div className="standard-demo-container">
      <img 
        src={balloonImage} 
        alt="Floating balloon" 
        className="float-element"
        style={{ width: '120px', height: 'auto' }}
      />
    </div>
  );
}