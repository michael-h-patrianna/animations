import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import './progress-bars.css';

export function ProgressBarsBattlePassTiers() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [unlockedTiers, setUnlockedTiers] = useState<Set<number>>(new Set());
  const [showBanner, setShowBanner] = useState<number | null>(null);
  const [currentTier, setCurrentTier] = useState<number>(-1);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const progressFill = container.querySelector('.pf-battle-pass-fill') as HTMLElement;
    const premiumTrack = container.querySelector('.pf-battle-pass-premium-track') as HTMLElement;
    if (!progressFill || !premiumTrack) return;

    // Reset states
    setUnlockedTiers(new Set());
    setShowBanner(null);
    setCurrentTier(-1);
    progressFill.style.transform = 'scaleX(0)';
    premiumTrack.style.transform = 'scaleX(0)';

    // Start animation after small delay
    const timer = setTimeout(() => {
      // Start progress animation - 2500ms total duration
      progressFill.style.animation = 'pf-battle-pass-progress 2500ms cubic-bezier(0.2, 0.8, 0.2, 1) forwards';
      premiumTrack.style.animation = 'pf-battle-pass-premium 2500ms cubic-bezier(0.2, 0.8, 0.2, 1) forwards';

      // Tier unlock timings - 500ms per tier
      const tierTimings = [0, 625, 1250, 1875, 2500]; // Free immediately, then 25%, 50%, 75%, 100%

      tierTimings.forEach((timing, index) => {
        setTimeout(() => {
          setCurrentTier(index);
          setUnlockedTiers(prev => new Set(Array.from(prev).concat(index)));

          // Show tier unlocked banner for tiers 1+ (not free tier)
          if (index > 0) {
            setShowBanner(index);
            setTimeout(() => setShowBanner(null), 800);
          }
        }, timing);
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      setUnlockedTiers(new Set());
      setShowBanner(null);
      setCurrentTier(-1);
    };
  }, []);

  const tiers = [
    { position: 0, tier: 'Free', icon: '🎁', color: 'gray' },
    { position: 25, tier: 'Common', icon: '⚡', color: 'blue' },
    { position: 50, tier: 'Rare', icon: '🔥', color: 'purple' },
    { position: 75, tier: 'Epic', icon: '⭐', color: 'orange' },
    { position: 100, tier: 'Legendary', icon: '👑', color: 'gold' }
  ];

  const tierVariants = {
    locked: {
      scale: 0.8,
      opacity: 0.3,
      y: 0
    },
    unlocking: {
      scale: shouldReduceMotion ? 1 : [0.8, 1.3, 1],
      opacity: 1,
      y: shouldReduceMotion ? 0 : [0, -8, 0],
      transition: {
        // Use tween for multi-keyframe arrays to avoid spring keyframe limitation
        type: "tween" as const,
        duration: shouldReduceMotion ? 0.3 : 0.6,
        ease: "easeOut" as const
      }
    }
  };

  const rewardBoxVariants = {
    closed: {
      rotateX: 0,
      scale: 1
    },
    opening: {
      rotateX: shouldReduceMotion ? 0 : [0, -15, 0],
      scale: shouldReduceMotion ? 1 : [1, 1.1, 1],
      transition: {
        duration: 0.5,
        ease: "easeOut" as const
      }
    }
  };

  const flashVariants = {
    hidden: {
      opacity: 0,
      scale: 0.5
    },
    visible: {
      opacity: shouldReduceMotion ? 0 : [0, 0.8, 0],
      scale: shouldReduceMotion ? 1 : [0.5, 1.5, 1],
      transition: {
        duration: 0.6,
        ease: "easeOut" as const
      }
    }
  };

  const bannerVariants = {
    hidden: {
      opacity: 0,
      y: -20,
      scale: 0.8
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 25,
        duration: 0.4
      }
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.9,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className="pf-progress-demo pf-battle-pass-tiers"
      data-animation-id="progress-bars__battle-pass-tiers"
    >

      {/* Tier unlocked banner */}
      {showBanner !== null && (
        <motion.div
          className="pf-battle-pass-banner"
          variants={bannerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div className="pf-battle-pass-banner__text">TIER UNLOCKED</div>
          <div className="pf-battle-pass-banner__tier">{tiers[showBanner].tier}</div>
        </motion.div>
      )}

      <div className="pf-battle-pass-container">
        {/* Premium track indicator */}
        <div className="pf-battle-pass-premium-container">
          <div className="pf-battle-pass-premium-label">Premium Track</div>
          <div className="pf-battle-pass-premium-track"></div>
        </div>

        {/* Main progress track */}
        <div className="pf-battle-pass-track">
          <div className="pf-battle-pass-fill"></div>
        </div>

        {/* Tier rewards */}
        <div className="pf-battle-pass-rewards">
          {tiers.map((tier, index) => (
            <div
              key={index}
              className="pf-battle-pass-tier-container"
              style={{ left: `${tier.position}%` }}
            >
              {/* Flash effect for tier unlock */}
              {unlockedTiers.has(index) && index > 0 && !shouldReduceMotion && (
                <motion.div
                  className={`pf-battle-pass-flash pf-battle-pass-flash--${tier.color}`}
                  variants={flashVariants}
                  initial="hidden"
                  animate="visible"
                />
              )}

              {/* Reward box */}
              <motion.div
                className={`pf-battle-pass-reward pf-battle-pass-reward--${tier.color}`}
                variants={rewardBoxVariants}
                initial="closed"
                animate={unlockedTiers.has(index) ? "opening" : "closed"}
              >
                <motion.div
                  className="pf-battle-pass-reward__icon"
                  variants={tierVariants}
                  initial="locked"
                  animate={unlockedTiers.has(index) ? "unlocking" : "locked"}
                >
                  {tier.icon}
                </motion.div>
              </motion.div>

              {/* Tier label */}
              <div className={`pf-battle-pass-tier-label ${unlockedTiers.has(index) ? 'pf-battle-pass-tier-label--unlocked' : ''}`}>
                {tier.tier}
              </div>

              {/* Legendary explosion effect */}
              {index === 4 && unlockedTiers.has(index) && !shouldReduceMotion && (
                <div className="pf-battle-pass-legendary-explosion">
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className={`pf-battle-pass-explosion-particle pf-battle-pass-explosion-particle-${i}`}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{
                        scale: [0, 1, 0],
                        opacity: [0, 1, 0],
                        transition: {
                          duration: 1,
                          delay: i * 0.1,
                          ease: "easeOut"
                        }
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
