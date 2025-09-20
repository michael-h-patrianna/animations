import React from 'react';
import './milestone-celebrations.css';
import gameAssetImg from '@/assets/milestone-celebrations/game-asset.png';
import energyOrbImg from '@/assets/milestone-celebrations/energy-orb.png';

export function MilestoneCelebrationsLevelBreakthroughFlare() {
  // Generate barrier shards (8 shards breaking outward)
  const shards = Array.from({ length: 8 }, (_, i) => {
    const angle = (Math.PI * 2 * i) / 8;
    const distance = 80 + Math.random() * 40;
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;
    const rotation = angle * (180 / Math.PI) + Math.random() * 60 - 30;
    return { id: i, x, y, rotation, delay: 0.8 + i * 0.05 };
  });

  // Generate ripple waves (3 expanding ripples)
  const ripples = Array.from({ length: 3 }, (_, i) => ({
    id: i,
    delay: 1.2 + i * 0.15,
    scale: 1 + i * 0.5
  }));

  return (
    <div 
      className="pf-milestone pf-breakthrough" 
      data-animation-id="milestone-celebrations__level-breakthrough-flare"
    >
      {/* Game Asset Breaking Through */}
      <div
        className="pf-breakthrough__game-asset"
        style={{
          left: '50%',
          top: '50%',
          marginLeft: '-60px',
          marginTop: '-60px',
          animation: 'assetBreakthrough 2s ease-out 0.3s forwards',
          opacity: 0
        }}
      >
        <img 
          src={gameAssetImg} 
          alt="Level Breakthrough" 
          style={{ 
            width: '120px', 
            height: '120px',
            filter: 'drop-shadow(0 0 20px rgba(0, 255, 255, 0.8))'
          }} 
        />
      </div>
      
      {/* Energy Orb at Center */}
      <div
        className="pf-breakthrough__energy-orb"
        style={{
          left: '50%',
          top: '50%',
          marginLeft: '-40px',
          marginTop: '-40px',
          animation: 'orbPulse 1.5s ease-out 0.8s forwards',
          opacity: 0
        }}
      >
        <img 
          src={energyOrbImg} 
          alt="Energy Orb" 
          style={{ 
            width: '80px', 
            height: '80px',
            filter: 'drop-shadow(0 0 15px rgba(255, 255, 0, 0.9))'
          }} 
        />
      </div>
      
      {/* Barrier shards flying outward */}
      {shards.map((shard) => (
        <div
          key={`shard-${shard.id}`}
          className="pf-breakthrough__shard"
          style={{
            left: '50%',
            top: '50%',
            marginLeft: '-20px',
            marginTop: '-7px',
            animation: `shardFly 1.8s ease-out ${shard.delay}s forwards`,
            transform: `translate(0, 0) rotate(${shard.rotation}deg)`,
            opacity: 0
          }}
        />
      ))}
      
      {/* Expanding shockwave ripples */}
      {ripples.map((ripple) => (
        <div
          key={`ripple-${ripple.id}`}
          className="pf-breakthrough__ripple"
          style={{
            left: '50%',
            top: '50%',
            marginLeft: '-150px',
            marginTop: '-150px',
            animation: `rippleExpand 1.5s ease-out ${ripple.delay}s forwards`,
            transform: `scale(${ripple.scale})`
          }}
        />
      ))}

      {/* Additional CSS for shards and ripples */}
      <style>{`
        @keyframes assetBreakthrough {
          0% { 
            transform: scale(0.3) rotateY(-180deg); 
            opacity: 0; 
          }
          50% { 
            transform: scale(1.2) rotateY(0deg); 
            opacity: 1; 
          }
          100% { 
            transform: scale(1) rotateY(360deg); 
            opacity: 1; 
          }
        }
        
        @keyframes orbPulse {
          0% { 
            transform: scale(0); 
            opacity: 0; 
          }
          50% { 
            transform: scale(1.3); 
            opacity: 1; 
          }
          100% { 
            transform: scale(1); 
            opacity: 0.8; 
          }
        }
        
        @keyframes shardFly {
          0% { 
            transform: translate(0, 0) rotate(var(--rotation, 0deg)) scale(0.8); 
            opacity: 1; 
          }
          100% { 
            transform: translate(var(--tx, 0), var(--ty, 0)) rotate(calc(var(--rotation, 0deg) + 180deg)) scale(0.3); 
            opacity: 0; 
          }
        }
        
        @keyframes rippleExpand {
          0% { 
            transform: scale(0); 
            opacity: 0; 
          }
          50% { 
            opacity: 0.8; 
          }
          100% { 
            transform: scale(2); 
            opacity: 0; 
          }
        }
      `}</style>
    </div>
  );
}