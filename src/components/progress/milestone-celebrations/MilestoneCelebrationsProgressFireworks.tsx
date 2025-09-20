import React from 'react';
import './milestone-celebrations.css';
import sparkleImg from '@/assets/milestone-celebrations/sparkle.png';
import star1Img from '@/assets/milestone-celebrations/star-1.png';
import star2Img from '@/assets/milestone-celebrations/star-2.png';

export function MilestoneCelebrationsProgressFireworks() {
  // Generate multiple rockets launching from bottom (5 rockets)
  const rockets = Array.from({ length: 5 }, (_, i) => {
    const x = -60 + i * 30; // Spread horizontally
    const targetY = -80 - Math.random() * 40; // Different explosion heights
    const launchDelay = 0.2 + i * 0.15;
    const explodeDelay = launchDelay + 0.8;
    return { 
      id: i, 
      x, 
      targetY, 
      launchDelay, 
      explodeDelay,
      color: ['#ff4500', '#ffd700', '#ff69b4', '#00ff00', '#9370db'][i]
    };
  });

  // Generate explosion sparks for each rocket (12 sparks per explosion)
  const explosions = rockets.map((rocket, rocketIndex) => 
    Array.from({ length: 12 }, (_, sparkIndex) => {
      const angle = (Math.PI * 2 * sparkIndex) / 12;
      const distance = 40 + Math.random() * 30;
      const sparkX = rocket.x + Math.cos(angle) * distance;
      const sparkY = rocket.targetY + Math.sin(angle) * distance;
      return {
        id: `${rocketIndex}-${sparkIndex}`,
        x: sparkX,
        y: sparkY,
        startX: rocket.x,
        startY: rocket.targetY,
        delay: rocket.explodeDelay,
        color: rocket.color
      };
    })
  ).flat();

  return (
    <div 
      className="pf-milestone pf-fireworks" 
      data-animation-id="milestone-celebrations__progress-fireworks"
    >
      {/* Rockets launching from bottom */}
      {rockets.map((rocket) => (
        <div key={`rocket-${rocket.id}`}>
          {/* Rocket body */}
          <div
            className="pf-fireworks__rocket"
            style={{
              left: '50%',
              bottom: '10%',
              marginLeft: `${rocket.x}px`,
              backgroundColor: rocket.color,
              animation: `rocketLaunch 1s ease-out ${rocket.launchDelay}s forwards`,
              '--ty': `${rocket.targetY}px`,
              opacity: 0
            } as React.CSSProperties}
          />
          
          {/* Rocket trail */}
          <div
            className="pf-fireworks__trail"
            style={{
              left: '50%',
              bottom: '10%',
              marginLeft: `${rocket.x + 1}px`,
              animation: `trailFade 1.2s ease-out ${rocket.launchDelay}s forwards`,
              opacity: 0
            }}
          />
        </div>
      ))}
      
      {/* Staggered explosions with colorful sparks */}
      {explosions.map((explosion) => (
        <div
          key={`explosion-${explosion.id}`}
          className="pf-fireworks__explosion"
          style={{
            left: '50%',
            bottom: '10%',
            marginLeft: `${explosion.startX}px`,
            marginBottom: `${-explosion.startY}px`,
            backgroundColor: explosion.color,
            animation: `fireworkExplode 1.5s ease-out ${explosion.delay}s forwards`,
            opacity: 0
          }}
        />
      ))}
      
      {/* Individual sparks flying out from explosions */}
      {explosions.map((explosion, index) => {
        const sparkImages = [sparkleImg, star1Img, star2Img];
        const selectedImg = sparkImages[index % sparkImages.length];
        
        return (
          <div
            key={`spark-${explosion.id}`}
            className="pf-fireworks__spark"
            style={{
              left: '50%',
              bottom: '10%',
              marginLeft: `${explosion.startX}px`,
              marginBottom: `${-explosion.startY}px`,
              animation: `sparkFly 2s ease-out ${explosion.delay}s forwards`,
              '--spark-x': `${explosion.x - explosion.startX}px`,
              '--spark-y': `${explosion.y - explosion.startY}px`,
              opacity: 0
            } as React.CSSProperties}
          >
            <img 
              src={selectedImg} 
              alt="Firework Spark" 
              style={{ 
                width: '20px', 
                height: '20px',
                filter: `hue-rotate(${index * 60}deg) brightness(1.2)`
              }} 
            />
          </div>
        );
      })}

      {/* Additional CSS for grand finale fireworks */}
      <style>{`
        @keyframes trailFade {
          0% { 
            opacity: 1; 
            transform: scaleY(0); 
          }
          50% { 
            opacity: 0.8; 
            transform: scaleY(1); 
          }
          100% { 
            opacity: 0; 
            transform: scaleY(0.3); 
          }
        }
        
        @keyframes sparkFly {
          0% { 
            transform: translate(0, 0) scale(1); 
            opacity: 1; 
          }
          70% { 
            opacity: 0.8; 
          }
          100% { 
            transform: translate(var(--spark-x, 0), var(--spark-y, 0)) scale(0.3); 
            opacity: 0; 
          }
        }
        
        .pf-fireworks__trail {
          transform-origin: bottom center;
        }
        
        .pf-fireworks__explosion {
          border-radius: 50%;
        }
      `}</style>
    </div>
  );
}