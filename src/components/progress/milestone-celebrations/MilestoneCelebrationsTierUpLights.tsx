import React from 'react';
import './milestone-celebrations.css';
import arrowUpImg from '@/assets/milestone-celebrations/arrow-up.png';

export function MilestoneCelebrationsTierUpLights() {
  // Generate step platforms (5 platforms at different heights)
  const platforms = Array.from({ length: 5 }, (_, i) => ({
    id: i,
    x: -80 + i * 40, // Spread horizontally
    y: 60 - i * 15, // Step up
    delay: 0.3 + i * 0.15,
    color: i < 2 ? '#00ffff' : i < 4 ? '#ff1493' : '#8a2be2'
  }));

  // Generate light beams shooting up from platforms
  const beams = platforms.map((platform, i) => ({
    id: i,
    x: platform.x,
    delay: platform.delay + 0.2,
    height: 30 + i * 8
  }));

  // Generate expanding pulse rings (3 rings)
  const pulses = Array.from({ length: 3 }, (_, i) => ({
    id: i,
    delay: 1.5 + i * 0.3,
    scale: 1 + i * 0.5
  }));

  return (
    <div 
      className="pf-milestone pf-tier-lights" 
      data-animation-id="milestone-celebrations__tier-up-lights"
    >
      {/* Step platforms lighting up sequentially */}
      {platforms.map((platform) => (
        <div
          key={`platform-${platform.id}`}
          className="pf-tier-lights__platform"
          style={{
            left: '50%',
            top: '50%',
            marginLeft: `${platform.x}px`,
            marginTop: `${platform.y}px`,
            background: `linear-gradient(90deg, ${platform.color}, ${platform.color}aa)`,
            animation: `platformLight 2s ease-out ${platform.delay}s forwards`,
            opacity: 0
          }}
        />
      ))}
      
      {/* Light beams shooting up from platforms */}
      {beams.map((beam) => (
        <div
          key={`beam-${beam.id}`}
          className="pf-tier-lights__beam"
          style={{
            left: '50%',
            top: '50%',
            marginLeft: `${beam.x + 28}px`, // Center on platform
            marginTop: `${60 - beam.id * 15 - beam.height}px`,
            height: `${beam.height}px`,
            animation: `beamShoot 1.5s ease-out ${beam.delay}s forwards`,
            opacity: 0
          }}
        />
      ))}
      
      {/* Progress bar filling at bottom */}
      <div
        className="pf-tier-lights__progress"
        style={{
          left: '50%',
          marginLeft: '-100px'
        }}
      >
        <div
          className="pf-tier-lights__progress-fill"
          style={{
            animation: 'progressFill 2.5s ease-out 0.5s forwards',
            width: '0%'
          }}
        />
      </div>
      
      {/* Tier Up Arrow */}
      <div
        className="pf-tier-lights__tier-arrow"
        style={{
          left: '50%',
          top: '30%',
          marginLeft: '-25px',
          marginTop: '-25px',
          animation: 'arrowRise 2s ease-out 2s forwards',
          opacity: 0
        }}
      >
        <img 
          src={arrowUpImg} 
          alt="Tier Up Arrow" 
          style={{ 
            width: '50px', 
            height: '50px',
            filter: 'drop-shadow(0 0 10px rgba(0, 255, 0, 0.8)) brightness(1.5)'
          }} 
        />
      </div>

      {/* Pulsing rings expanding from center */}
      {pulses.map((pulse) => (
        <div
          key={`pulse-${pulse.id}`}
          className="pf-tier-lights__pulse"
          style={{
            left: '50%',
            top: '50%',
            marginLeft: '-50px',
            marginTop: '-50px',
            animation: `pulseExpand 2s ease-out ${pulse.delay}s infinite`,
            transform: `scale(${pulse.scale})`,
            opacity: 0
          }}
        />
      ))}

      {/* Additional CSS for enhanced neon gaming effects */}
      <style>{`
        @keyframes arrowRise {
          0% { 
            transform: translateY(50px) scale(0.5); 
            opacity: 0; 
          }
          50% { 
            transform: translateY(-10px) scale(1.2); 
            opacity: 1; 
          }
          100% { 
            transform: translateY(-20px) scale(1); 
            opacity: 1; 
          }
        }
        
        @keyframes beamShoot {
          0% { 
            transform: scaleY(0); 
            opacity: 0; 
          }
          50% { 
            transform: scaleY(1); 
            opacity: 1; 
          }
          100% { 
            transform: scaleY(0.7); 
            opacity: 0.6; 
          }
        }
        
        @keyframes pulseExpand {
          0% { 
            transform: scale(0); 
            opacity: 0; 
          }
          50% { 
            opacity: 0.8; 
          }
          100% { 
            transform: scale(1.5); 
            opacity: 0; 
          }
        }
        
        .pf-tier-lights__platform {
          border-radius: 4px;
          box-shadow: 0 0 20px currentColor;
        }
        
        .pf-tier-lights__beam {
          transform-origin: bottom center;
        }
      `}</style>
    </div>
  );
}