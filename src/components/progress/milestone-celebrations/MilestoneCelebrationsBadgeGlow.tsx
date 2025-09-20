import { motion } from 'framer-motion';
import './milestone-celebrations.css';
import badgeImg from '@/assets/milestone-celebrations/badge.png';

export function MilestoneCelebrationsBadgeGlow() {
  // Generate honor ribbon cascade
  const honorRibbons = Array.from({ length: 6 }, (_, i) => ({
    id: i,
    delay: 0.8 + i * 0.1,
    angle: (Math.PI * 2 * i) / 6,
    distance: 80 + i * 10
  }));

  // Generate medal gleam rays
  const gleamRays = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    angle: (Math.PI * 2 * i) / 12,
    delay: 1.2 + i * 0.05
  }));

  // Generate floating commendation stars
  const commendationStars = Array.from({ length: 8 }, (_, i) => {
    const angle = (Math.PI * 2 * i) / 8;
    const distance = 60 + Math.random() * 40;
    return {
      id: i,
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      delay: 1.8 + i * 0.08,
      scale: 0.8 + Math.random() * 0.4
    };
  });

  return (
    <div 
      className="pf-milestone pf-badge-glow" 
      data-animation-id="milestone-celebrations__badge-glow"
    >
      {/* Honor Aura */}
      <motion.div
        className="pf-badge-glow__honor-aura"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ 
          scale: [0, 1.5, 1.2],
          opacity: [0, 0.6, 0.4] 
        }}
        transition={{ 
          duration: 1.8, 
          delay: 0.5,
          ease: "easeOut"
        }}
      />

      {/* Premium Military Badge */}
      <motion.div
        className="pf-badge-glow__premium-badge"
        initial={{ 
          rotateY: -180, 
          scale: 0.3, 
          opacity: 0 
        }}
        animate={{ 
          rotateY: [0, 360, 0], 
          scale: [0.3, 1.1, 1], 
          opacity: 1 
        }}
        transition={{ 
          duration: 2.2, 
          delay: 0.3,
          ease: [0.68, -0.55, 0.265, 1.55]
        }}
      >
        <img 
          src={badgeImg} 
          alt="Service Badge" 
          className="pf-badge-glow__badge-image"
          style={{ 
            width: '100px', 
            height: '100px',
            filter: 'drop-shadow(0 0 15px rgba(255, 165, 0, 0.8))'
          }} 
        />
        
        {/* Holographic Shimmer */}
        <motion.div
          className="pf-badge-glow__holographic-shimmer"
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{ 
            duration: 1.5, 
            delay: 2.0,
            repeat: Infinity,
            repeatDelay: 2.0
          }}
        />
      </motion.div>

      {/* Medal Gleam Rays */}
      {gleamRays.map((ray) => (
        <motion.div
          key={`gleam-${ray.id}`}
          className="pf-badge-glow__gleam-ray"
          style={{
            transform: `rotate(${ray.angle}rad)`,
            transformOrigin: 'center bottom'
          }}
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ 
            scaleY: [0, 1, 0.7], 
            opacity: [0, 0.8, 0.3] 
          }}
          transition={{ 
            duration: 1.0, 
            delay: ray.delay,
            ease: "easeOut"
          }}
        />
      ))}

      {/* Honor Ribbon Cascade */}
      {honorRibbons.map((ribbon) => (
        <motion.div
          key={`ribbon-${ribbon.id}`}
          className="pf-badge-glow__floating-ribbon"
          style={{
            left: '50%',
            top: '50%'
          }}
          initial={{
            x: 0,
            y: 0,
            scale: 0,
            rotate: 0,
            opacity: 0
          }}
          animate={{
            x: Math.cos(ribbon.angle) * ribbon.distance,
            y: Math.sin(ribbon.angle) * ribbon.distance,
            scale: [0, 1.2, 1],
            rotate: [0, 180, 360],
            opacity: [0, 1, 0.6]
          }}
          transition={{
            duration: 1.5,
            delay: ribbon.delay,
            ease: "easeOut"
          }}
        />
      ))}

      {/* Commendation Stars */}
      {commendationStars.map((star) => (
        <motion.div
          key={`commendation-${star.id}`}
          className="pf-badge-glow__commendation-star"
          style={{
            left: '50%',
            top: '50%'
          }}
          initial={{
            x: 0,
            y: 0,
            scale: 0,
            opacity: 0
          }}
          animate={{
            x: star.x,
            y: star.y,
            scale: [0, star.scale * 1.2, star.scale],
            opacity: [0, 1, 0.7]
          }}
          transition={{
            duration: 1.2,
            delay: star.delay,
            ease: "easeOut"
          }}
        />
      ))}

      {/* Service Excellence Banner */}
      <motion.div
        className="pf-badge-glow__service-banner"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 0.8, delay: 2.5 }}
      >
        <div className="pf-badge-glow__banner-medal"></div>
        <div className="pf-badge-glow__banner-text">SERVICE EXCELLENCE</div>
        <div className="pf-badge-glow__banner-medal"></div>
      </motion.div>
    </div>
  );
}