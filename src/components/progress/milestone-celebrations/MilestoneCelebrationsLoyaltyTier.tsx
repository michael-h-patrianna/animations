import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './milestone-celebrations.css';
import './loyalty-tier.css';
import diamondImg from '../../../assets/milestone-celebrations/diamond.png';
import crownImg from '../../../assets/milestone-celebrations/crown.png';

export function MilestoneCelebrationsLoyaltyTier() {
  // Energy burst particles
  const energyParticles = Array.from({ length: 32 }, (_, i) => {
    const angle = (Math.PI * 2 * i) / 32;
    const speed = 200 + Math.random() * 100;
    return {
      id: `energy-${i}`,
      x: Math.cos(angle) * speed,
      y: Math.sin(angle) * speed,
      size: 3 + Math.random() * 5,
      delay: Math.random() * 0.2
    };
  });

  // Confetti particles
  const confettiParticles = Array.from({ length: 40 }, (_, i) => ({
    id: `confetti-${i}`,
    x: (Math.random() - 0.5) * 300,
    delay: Math.random() * 0.8,
    duration: 2 + Math.random(),
    rotation: Math.random() * 360,
    color: ['#FFD700', '#FFA500', '#FF69B4', '#9370DB', '#00CED1'][Math.floor(Math.random() * 5)]
  }));

  // Starburst rays
  const starburstRays = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    rotation: (360 / 12) * i,
    delay: i * 0.02
  }));

  return (
    <motion.div 
      data-animation-id="milestone-celebrations__loyalty-tier" 
      className="loyalty-tier-epic"
      initial="initial"
      animate="animate"
    >
      {/* Epic background gradient pulse */}
      <motion.div 
        className="epic-bg-pulse"
        animate={{
          scale: [1, 1.5, 1.3],
          opacity: [0, 0.8, 0]
        }}
        transition={{
          duration: 2,
          ease: 'easeOut'
        }}
      />

      {/* Animated starburst rays */}
      <div className="starburst-container">
        {starburstRays.map(ray => (
          <motion.div
            key={ray.id}
            className="starburst-ray"
            style={{ transform: `rotate(${ray.rotation}deg)` }}
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{
              scaleY: [0, 1.5, 1],
              opacity: [0, 1, 0.6]
            }}
            transition={{
              delay: 0.3 + ray.delay,
              duration: 1.2,
              ease: [0.43, 0.13, 0.23, 0.96]
            }}
          />
        ))}
      </div>

      {/* Main badge container with 3D rotation */}
      <motion.div 
        className="badge-3d-container"
        initial={{ scale: 0, rotateY: -180 }}
        animate={{
          scale: [0, 1.3, 1],
          rotateY: [-180, 360, 360]
        }}
        transition={{
          duration: 1.5,
          times: [0, 0.7, 1],
          ease: [0.68, -0.55, 0.265, 1.55]
        }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Multi-layer glow effects */}
        <motion.div 
          className="badge-glow-outer"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
        <motion.div 
          className="badge-glow-inner"
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.2
          }}
        />

        {/* Diamond badge */}
        <motion.div 
          className="badge-main"
          animate={{
            rotateZ: [0, 5, -5, 0]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1
          }}
        >
          <img src={diamondImg} alt="Diamond Tier" className="tier-badge" />
          
          {/* Shimmer effect overlay */}
          <motion.div 
            className="badge-shimmer"
            animate={{
              x: [-200, 200],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 2,
              ease: 'easeInOut'
            }}
          />
        </motion.div>

        {/* Crown on top with bounce */}
        <motion.div 
          className="crown-container"
          initial={{ y: -150, opacity: 0 }}
          animate={{
            y: [-150, -70, -80, -75],
            opacity: [0, 1, 1, 1],
            scale: [0.5, 1.2, 0.95, 1]
          }}
          transition={{
            delay: 0.8,
            duration: 1,
            times: [0, 0.5, 0.8, 1],
            ease: [0.68, -0.55, 0.265, 1.55]
          }}
        >
          <img src={crownImg} alt="VIP Crown" className="tier-crown-epic" />
          
          {/* Crown shine pulse */}
          <motion.div 
            className="crown-shine"
            initial={{ scale: 0 }}
            animate={{
              scale: [0, 2.5, 0],
              opacity: [0, 1, 0]
            }}
            transition={{
              delay: 1.6,
              duration: 0.8,
              ease: 'easeOut'
            }}
          />
        </motion.div>
      </motion.div>

      {/* Energy burst particles */}
      <AnimatePresence>
        {energyParticles.map(particle => (
          <motion.div
            key={particle.id}
            className="energy-particle"
            style={{
              width: particle.size,
              height: particle.size
            }}
            initial={{ x: 0, y: 0, scale: 0 }}
            animate={{
              x: particle.x,
              y: particle.y,
              scale: [0, 1.5, 0],
              opacity: [0, 1, 0]
            }}
            transition={{
              delay: 1.5 + particle.delay,
              duration: 1.2,
              ease: 'easeOut'
            }}
          />
        ))}
      </AnimatePresence>

      {/* Confetti rain */}
      <div className="confetti-container">
        {confettiParticles.map(particle => (
          <motion.div
            key={particle.id}
            className="confetti-particle"
            style={{
              left: '50%',
              backgroundColor: particle.color
            }}
            initial={{
              x: particle.x,
              y: -50,
              rotate: 0,
              opacity: 0
            }}
            animate={{
              y: 400,
              rotate: particle.rotation * 3,
              opacity: [0, 1, 1, 0]
            }}
            transition={{
              delay: 1.2 + particle.delay,
              duration: particle.duration,
              ease: 'linear'
            }}
          />
        ))}
      </div>

      {/* Epic text reveal with letter animation */}
      <motion.div 
        className="epic-text-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
      >
        <motion.div className="tier-subtitle">
          {'CONGRATULATIONS!'.split('').map((letter, i) => (
            <motion.span
              key={i}
              initial={{ y: 20, opacity: 0 }}
              animate={{
                y: 0,
                opacity: 1
              }}
              transition={{
                delay: 1.8 + i * 0.03,
                duration: 0.4,
                ease: [0.68, -0.55, 0.265, 1.55]
              }}
            >
              {letter}
            </motion.span>
          ))}
        </motion.div>
        
        <motion.div 
          className="tier-main-text"
          initial={{ scale: 0, y: 20 }}
          animate={{
            scale: [0, 1.2, 1],
            y: 0
          }}
          transition={{
            delay: 2.2,
            duration: 0.6,
            ease: [0.68, -0.55, 0.265, 1.55]
          }}
        >
          DIAMOND VIP
        </motion.div>
        
        <motion.div 
          className="tier-status"
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 1],
            scale: [0.8, 1]
          }}
          transition={{
            delay: 2.6,
            duration: 0.5
          }}
        >
          TIER UNLOCKED
        </motion.div>
      </motion.div>

      {/* Circular shockwave */}
      <motion.div 
        className="shockwave"
        initial={{ scale: 0, opacity: 1 }}
        animate={{
          scale: [0, 3],
          opacity: [1, 0]
        }}
        transition={{
          delay: 1.5,
          duration: 1.5,
          ease: 'easeOut'
        }}
      />
    </motion.div>
  );
}