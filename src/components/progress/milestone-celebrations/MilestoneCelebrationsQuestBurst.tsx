import { motion } from 'framer-motion';
import './milestone-celebrations.css';
import questBookImg from '@/assets/milestone-celebrations/quest-book.png';

export function MilestoneCelebrationsQuestBurst() {
  return (
    <div className="pf-milestone pf-quest-burst" data-animation-id="milestone-celebrations__quest-burst">
      {/* Ancient Quest Book */}
      <motion.div 
        className="pf-quest-burst__scroll"
        initial={{ transform: 'rotateX(-90deg) scale(0.5)', opacity: 0 }}
        animate={{ transform: 'rotateX(0deg) scale(1)', opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.68, -0.55, 0.265, 1.55] }}
      >
        <img 
          src={questBookImg} 
          alt="Quest Book" 
          className="pf-quest-burst__book-image"
          style={{ 
            width: '140px', 
            height: '120px',
            filter: 'drop-shadow(0 0 15px rgba(255, 140, 0, 0.6))'
          }} 
        />
      </motion.div>

      {/* Legendary Swords */}
      <motion.div
        className="pf-quest-burst__legendary-sword pf-quest-burst__legendary-sword--left"
        initial={{ scaleY: 0, opacity: 0, rotateZ: -45 }}
        animate={{ scaleY: 1, opacity: [0, 1, 0.7], rotateZ: -30 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="pf-quest-burst__sword-blade"></div>
        <div className="pf-quest-burst__sword-crossguard"></div>
        <div className="pf-quest-burst__sword-hilt"></div>
        <div className="pf-quest-burst__sword-pommel"></div>
      </motion.div>
      
      <motion.div
        className="pf-quest-burst__legendary-sword pf-quest-burst__legendary-sword--right"
        initial={{ scaleY: 0, opacity: 0, rotateZ: 45 }}
        animate={{ scaleY: 1, opacity: [0, 1, 0.7], rotateZ: 30 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className="pf-quest-burst__sword-blade"></div>
        <div className="pf-quest-burst__sword-crossguard"></div>
        <div className="pf-quest-burst__sword-hilt"></div>
        <div className="pf-quest-burst__sword-pommel"></div>
      </motion.div>

      {/* Treasure Coins with 3D Effect */}
      {[...Array(8)].map((_, i) => {
        const angle = (Math.PI * 2 * i) / 8;
        const distance = 130;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;
        
        return (
          <motion.div
            key={`coin-${i}`}
            className="pf-quest-burst__treasure-coin"
            style={{
              left: '50%',
              top: '50%',
            }}
            initial={{ transform: 'translate(-50%, -50%) scale(0) rotateY(0deg)' }}
            animate={{
              transform: [
                'translate(-50%, -50%) scale(0) rotateY(0deg)',
                `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(1) rotateY(720deg)`,
                `translate(calc(-50% + ${tx}px), calc(-50% + ${ty * 1.2 + 40}px)) scale(0.8) rotateY(1440deg)`,
              ],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 1.2,
              delay: 0.5 + i * 0.05,
              ease: [0.68, -0.55, 0.265, 1.55],
            }}
          >
            <div className="pf-quest-burst__coin-face pf-quest-burst__coin-face--front"></div>
            <div className="pf-quest-burst__coin-face pf-quest-burst__coin-face--back"></div>
            <div className="pf-quest-burst__coin-edge"></div>
          </motion.div>
        );
      })}

      {/* Magic Sparkles */}
      {[...Array(15)].map((_, i) => {
        const angle = (Math.PI * 2 * i) / 15;
        const distance = 80 + Math.random() * 50;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;
        const sparkleType = ['star', 'diamond', 'cross'][i % 3];
        
        return (
          <motion.div
            key={`sparkle-${i}`}
            className={`pf-quest-burst__magic-sparkle pf-quest-burst__magic-sparkle--${sparkleType}`}
            style={{
              left: '50%',
              top: '50%',
            }}
            initial={{ 
              transform: 'translate(-50%, -50%) scale(0) rotate(0deg)',
              opacity: 0,
            }}
            animate={{
              transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(1) rotate(360deg)`,
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 1.0,
              delay: 0.2 + i * 0.04,
              ease: 'easeOut',
            }}
          />
        );
      })}
      
      {/* Quest Completion Banner */}
      <motion.div
        className="pf-quest-burst__completion-banner"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: [0, 1, 0.8] }}
        transition={{ duration: 0.8, delay: 1.2 }}
      >
        <div className="pf-quest-burst__banner-text">LEGENDARY QUEST COMPLETED!</div>
      </motion.div>
    </div>
  );
}