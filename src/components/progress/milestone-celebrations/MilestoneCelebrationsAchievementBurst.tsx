import { motion, AnimatePresence } from 'framer-motion';
import './milestone-celebrations.css';
import trophyImg from '@/assets/milestone-celebrations/trophy-gold.png';
import starImg from '@/assets/milestone-celebrations/star-gold.png';
import coinImg from '@/assets/milestone-celebrations/coin.png';
import confettiImg from '@/assets/milestone-celebrations/confetti.png';

export function MilestoneCelebrationsAchievementBurst() {
  // Generate 30 coins for explosion effect
  const coins = Array.from({ length: 30 }, (_, i) => {
    const angle = (Math.PI * 2 * i) / 30 + (Math.random() - 0.5) * 0.3;
    const distance = 120 + Math.random() * 60;
    return {
      id: i,
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      rotation: Math.random() * 720,
      delay: 0.5 + i * 0.02
    };
  });

  // Generate star particles
  const stars = Array.from({ length: 20 }, (_, i) => {
    const angle = (Math.PI * 2 * i) / 20;
    const distance = 80 + Math.random() * 100;
    return {
      id: i,
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      rotation: 360 + Math.random() * 360,
      scale: 0.5 + Math.random() * 0.5,
      delay: 0.8 + i * 0.03
    };
  });

  // Generate confetti pieces
  const confetti = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: (Math.random() - 0.5) * 300,
    initialY: -Math.random() * 50,
    finalY: 150 + Math.random() * 50,
    rotation: Math.random() * 360,
    delay: 1.2 + Math.random() * 0.5,
    duration: 1.5 + Math.random() * 0.5
  }));

  // Trophy animation variants
  const trophyVariants = {
    initial: { 
      y: -200, 
      scale: 0.5, 
      opacity: 0,
      rotate: -45
    },
    animate: {
      y: [null, 0, -15, 0],
      scale: [null, 1.2, 0.95, 1],
      opacity: 1,
      rotate: [null, 0, 5, 0],
      transition: {
        duration: 1.5,
        times: [0, 0.4, 0.6, 1],
        ease: [0.68, -0.55, 0.265, 1.55]
      }
    }
  };

  // Shockwave animation
  const shockwaveVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: {
      scale: [0, 2.5],
      opacity: [0, 0.8, 0],
      transition: {
        duration: 1,
        delay: 0.5,
        ease: "easeOut"
      }
    }
  };

  // Light burst animation
  const lightBurstVariants = {
    initial: { scale: 0, opacity: 0, rotate: 0 },
    animate: {
      scale: [0, 2, 1.5],
      opacity: [0, 0.6, 0.3],
      rotate: 180,
      transition: {
        duration: 2,
        delay: 0.4,
        ease: "easeOut"
      }
    }
  };

  // Banner animation
  const bannerVariants = {
    initial: { 
      y: 100, 
      scaleX: 0, 
      opacity: 0 
    },
    animate: {
      y: 0,
      scaleX: 1,
      opacity: 1,
      transition: {
        duration: 0.8,
        delay: 1.5,
        ease: [0.68, -0.55, 0.265, 1.55]
      }
    }
  };

  // Container for staggered animations
  const containerVariants = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.02,
        delayChildren: 0.5
      }
    }
  };

  // Coin animation
  const coinVariants = {
    initial: { 
      x: 0, 
      y: 0, 
      scale: 0, 
      opacity: 0 
    },
    animate: (custom: any) => ({
      x: custom.x,
      y: [0, custom.y * 0.7, custom.y],
      scale: [0, 1.2, 0.8],
      opacity: [0, 1, 0],
      rotateY: custom.rotation,
      transition: {
        duration: 1.8,
        delay: custom.delay,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    })
  };

  // Star particle animation
  const starVariants = {
    initial: { 
      x: 0, 
      y: 0, 
      scale: 0, 
      opacity: 0,
      rotate: 0
    },
    animate: (custom: any) => ({
      x: custom.x,
      y: custom.y,
      scale: [0, custom.scale * 1.2, custom.scale],
      opacity: [0, 1, 0],
      rotate: custom.rotation,
      transition: {
        duration: 2,
        delay: custom.delay,
        ease: "easeOut"
      }
    })
  };

  // Confetti animation
  const confettiVariants = {
    initial: (custom: any) => ({ 
      x: custom.x,
      y: custom.initialY,
      scale: 0,
      opacity: 0,
      rotate: 0
    }),
    animate: (custom: any) => ({
      y: custom.finalY,
      scale: [0, 1, 0.8],
      opacity: [0, 1, 0],
      rotate: custom.rotation,
      transition: {
        duration: custom.duration,
        delay: custom.delay,
        ease: [0.25, 0.1, 0.25, 1]
      }
    })
  };

  return (
    <div 
      className="pf-milestone pf-achievement-burst" 
      data-animation-id="milestone-celebrations__achievement-burst"
    >
      {/* Background radial gradient burst */}
      <div className="pf-achievement-burst__bg-gradient" />

      {/* Shockwave effect */}
      <motion.div
        className="pf-achievement-burst__shockwave"
        variants={shockwaveVariants}
        initial="initial"
        animate="animate"
      />

      {/* Light burst effect */}
      <motion.div
        className="pf-achievement-burst__light-burst"
        variants={lightBurstVariants}
        initial="initial"
        animate="animate"
      />

      {/* Trophy with physics bounce */}
      <motion.div
        className="pf-achievement-burst__trophy-container"
        variants={trophyVariants}
        initial="initial"
        animate="animate"
      >
        <img 
          src={trophyImg} 
          alt="Achievement Trophy" 
          className="pf-achievement-burst__trophy"
        />
        {/* Trophy glow aura */}
        <motion.div 
          className="pf-achievement-burst__trophy-glow"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.6, 1, 0.6]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: 1.5
          }}
        />
      </motion.div>

      {/* Coin explosion */}
      <motion.div
        className="pf-achievement-burst__coins"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        {coins.map(coin => (
          <motion.div
            key={coin.id}
            className="pf-achievement-burst__coin"
            custom={coin}
            variants={coinVariants}
          >
            <img src={coinImg} alt="" className="pf-achievement-burst__coin-img" />
          </motion.div>
        ))}
      </motion.div>

      {/* Star particles */}
      <motion.div
        className="pf-achievement-burst__stars"
        initial="initial"
        animate="animate"
      >
        {stars.map(star => (
          <motion.div
            key={star.id}
            className="pf-achievement-burst__star"
            custom={star}
            variants={starVariants}
          >
            <img src={starImg} alt="" className="pf-achievement-burst__star-img" />
          </motion.div>
        ))}
      </motion.div>

      {/* Confetti rain */}
      <motion.div
        className="pf-achievement-burst__confetti-container"
        initial="initial"
        animate="animate"
      >
        {confetti.map(piece => (
          <motion.div
            key={piece.id}
            className="pf-achievement-burst__confetti"
            custom={piece}
            variants={confettiVariants}
            style={{
              backgroundImage: `url(${confettiImg})`,
              backgroundSize: 'contain',
              width: '10px',
              height: '10px'
            }}
          />
        ))}
      </motion.div>

      {/* Achievement banner */}
      <motion.div
        className="pf-achievement-burst__banner"
        variants={bannerVariants}
        initial="initial"
        animate="animate"
      >
        <div className="pf-achievement-burst__banner-shine" />
        <div className="pf-achievement-burst__banner-text">
          ACHIEVEMENT UNLOCKED!
        </div>
        <div className="pf-achievement-burst__banner-stars">
          <span>★</span>
          <span>★</span>
          <span>★</span>
        </div>
      </motion.div>

      {/* Screen flash effect */}
      <motion.div
        className="pf-achievement-burst__flash"
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: [0, 0.6, 0],
          transition: {
            duration: 0.3,
            delay: 0.5,
            times: [0, 0.3, 1]
          }
        }}
      />
    </div>
  );
}