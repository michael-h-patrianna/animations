import React from 'react';
import './milestone-celebrations.css';
import ribbonImg from '@/assets/milestone-celebrations/ribbon.png';

export function MilestoneCelebrationsMilestoneBanner() {
  // Generate musical notes for trumpets (6 notes per trumpet)
  const leftNotes = Array.from({ length: 6 }, (_, i) => ({
    id: i,
    delay: 1.2 + i * 0.1,
    x: -20 - i * 8,
    y: -10 - i * 5
  }));

  const rightNotes = Array.from({ length: 6 }, (_, i) => ({
    id: i,
    delay: 1.2 + i * 0.1,
    x: 20 + i * 8,
    y: -10 - i * 5
  }));

  // Generate crossing spotlight beams (4 beams)
  const spotlights = Array.from({ length: 4 }, (_, i) => ({
    id: i,
    rotation: i * 90 + 45, // 45, 135, 225, 315 degrees
    delay: 0.8 + i * 0.2
  }));

  return (
    <div 
      className="pf-milestone pf-banner" 
      data-animation-id="milestone-celebrations__milestone-banner"
    >
      {/* Crossing spotlight beams */}
      {spotlights.map((spotlight) => (
        <div
          key={`spotlight-${spotlight.id}`}
          className="pf-banner__spotlight"
          style={{
            left: '50%',
            top: '0%',
            marginLeft: '-40px',
            transform: `rotate(${spotlight.rotation}deg)`,
            transformOrigin: 'bottom center',
            animation: `spotlightSweep 3s ease-out ${spotlight.delay}s infinite`,
            opacity: 0
          }}
        />
      ))}
      
      {/* Royal banner dropping from top */}
      <div
        className="pf-banner__banner"
        style={{
          left: '50%',
          top: '50%',
          marginLeft: '-60px',
          marginTop: '-35px',
          animation: 'bannerDrop 2s ease-out 0.3s forwards',
          transform: 'translateY(-200px) scaleY(0)',
          opacity: 1
        }}
      >
        <img 
          src={ribbonImg} 
          alt="Milestone Banner" 
          style={{ 
            width: '120px', 
            height: '70px',
            filter: 'drop-shadow(0 0 10px rgba(255, 215, 0, 0.6))'
          }} 
        />
      </div>
      
      {/* Left trumpet */}
      <div
        className="pf-banner__trumpet"
        style={{
          left: '15%',
          top: '55%',
          marginLeft: '-30px',
          marginTop: '-20px',
          animation: 'trumpetFanfare 1.5s ease-out 1s forwards',
          opacity: 0
        }}
      />
      
      {/* Right trumpet (flipped) */}
      <div
        className="pf-banner__trumpet"
        style={{
          right: '15%',
          top: '55%',
          marginRight: '-30px',
          marginTop: '-20px',
          transform: 'scaleX(-1)',
          animation: 'trumpetFanfare 1.5s ease-out 1.1s forwards',
          opacity: 0
        }}
      />
      
      {/* Musical notes from left trumpet */}
      {leftNotes.map((note) => (
        <div
          key={`left-note-${note.id}`}
          className="pf-banner__note"
          style={{
            left: '15%',
            top: '55%',
            animation: `noteFloat 2s ease-out ${note.delay}s forwards`,
            '--note-x': `${note.x}px`,
            '--note-y': `${note.y}px`,
            opacity: 0
          } as React.CSSProperties}
        >
          ♪
        </div>
      ))}
      
      {/* Musical notes from right trumpet */}
      {rightNotes.map((note) => (
        <div
          key={`right-note-${note.id}`}
          className="pf-banner__note"
          style={{
            right: '15%',
            top: '55%',
            animation: `noteFloat 2s ease-out ${note.delay}s forwards`,
            '--note-x': `${note.x}px`,
            '--note-y': `${note.y}px`,
            opacity: 0
          } as React.CSSProperties}
        >
          ♫
        </div>
      ))}

      {/* Additional CSS for enhanced effects */}
      <style>{`
        @keyframes trumpetFanfare {
          0% { 
            transform: scale(0.5) rotate(-10deg); 
            opacity: 0; 
          }
          50% { 
            transform: scale(1.1) rotate(2deg); 
            opacity: 1; 
          }
          100% { 
            transform: scale(1) rotate(0deg); 
            opacity: 1; 
          }
        }
        
        @keyframes noteFloat {
          0% { 
            transform: translate(0, 0) scale(0.5); 
            opacity: 0; 
          }
          30% { 
            opacity: 1; 
          }
          100% { 
            transform: translate(var(--note-x, 0), var(--note-y, 0)) scale(1.2); 
            opacity: 0; 
          }
        }
        
        @keyframes spotlightSweep {
          0% { 
            opacity: 0; 
            transform: rotate(var(--rotation, 0deg)) scaleY(0.3); 
          }
          30% { 
            opacity: 0.6; 
            transform: rotate(var(--rotation, 0deg)) scaleY(1); 
          }
          70% { 
            opacity: 0.3; 
            transform: rotate(var(--rotation, 0deg)) scaleY(0.8); 
          }
          100% { 
            opacity: 0; 
            transform: rotate(var(--rotation, 0deg)) scaleY(0.2); 
          }
        }
      `}</style>
    </div>
  );
}