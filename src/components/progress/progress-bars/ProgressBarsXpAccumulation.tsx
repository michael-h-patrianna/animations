import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useTransform,
  type AnimationPlaybackControls,
} from 'framer-motion';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './progress-bars.css';

// Local type for milestone halo animation entries
type MilestoneAnimation = { id: number; threshold: number; trophy: string };

interface FloatingXP {
  id: number;
  value: number;
  percent: number;
  offset: number;
}



const INITIAL_XP = 100;
const MAX_XP = 1000;
const PROGRESS_DURATION = 0.48;
const ORB_IMPACT_DELAY_MS = 420;
const ORB_LIFETIME_MS = 1200;
const FLOATING_SPAWN_LEAD_MS = 110;
const FLOATING_LIFETIME_MS = 1650;
const ORB_ANIMATION_DURATION = 1.15;
const ORB_ANIMATION_TIMES: [number, number, number, number] = [
  0,
  Math.min(0.82, ORB_IMPACT_DELAY_MS / (ORB_ANIMATION_DURATION * 1000)),
  0.78,
  1,
];
const GAIN_INTERVAL_MS = 1580;
const FIRST_GAIN_DELAY_MS = 520;
const RESET_DELAY_MS = 2600;
const PROGRESS_EASE: [number, number, number, number] = [0.18, 0.85, 0.25, 1];

const MULTIPLIER_ZONES = [
  { threshold: 20, multiplier: 2, trophy: '01_Trophy.png' },
  { threshold: 40, multiplier: 3, trophy: '02_Trophy.png' },
  { threshold: 60, multiplier: 4, trophy: '03_Trophy.png' },
  { threshold: 80, multiplier: 5, trophy: '04_Trophy.png' },
] as const;

const STAR_IMAGES = ['01_Star.png', '03_Star.png', '05_Star.png', '07_Star.png'] as const;

const XP_SEQUENCE_RANGES: Array<[number, number]> = [
  [150, 165],
  [205, 222],
  [290, 310],
  [405, 430],
  [525, 552],
  [655, 678],
  [785, 812],
  [910, 940],
  [MAX_XP, MAX_XP],
];

const MIN_SEQUENCE_STEP = 28;

function createXpSequence() {
  let current = INITIAL_XP;

  return XP_SEQUENCE_RANGES.map(([min, max]) => {
    const span = Math.max(0, max - min);
    const roll = span === 0 ? min : min + Math.random() * span;
    const ensured = Math.max(current + MIN_SEQUENCE_STEP, roll);
    const clamped = Math.min(MAX_XP, ensured);
    current = clamped;
    return clamped;
  });
}

export function ProgressBarsXpAccumulation() {
  const containerRef = useRef<HTMLDivElement>(null);

  const [floatingXP, setFloatingXP] = useState<FloatingXP[]>([]);
  const [currentMultiplier, setCurrentMultiplier] = useState(1);
  const [milestoneAnimations, setMilestoneAnimations] = useState<MilestoneAnimation[]>([]);
  const [progressDisplay, setProgressDisplay] = useState((INITIAL_XP / MAX_XP) * 100);
  const [displayXP, setDisplayXP] = useState(INITIAL_XP);

  const progressValue = useMotionValue((INITIAL_XP / MAX_XP) * 100);
  const progressScale = useTransform(progressValue, (value) => Math.max(value, 0) / 100);
  const xpValue = useMotionValue(INITIAL_XP);

  const xpRef = useRef(INITIAL_XP);
  const animationRef = useRef<{ orbId: number; floatingId: number; milestoneId: number }>({
    orbId: 0,
    floatingId: 0,
    milestoneId: 0,
  });
  const timeoutHandlesRef = useRef<Array<ReturnType<typeof setTimeout>>>([]);
  const animationControlsRef = useRef<AnimationPlaybackControls[]>([]);
  const reachedMilestonesRef = useRef<Set<number>>(new Set());
  const lastProgressRef = useRef(progressValue.get());
  const xpSequenceRef = useRef<number[]>(createXpSequence());
  const sequenceIndexRef = useRef(0);

  const multiplierZones = useMemo(() => [...MULTIPLIER_ZONES], []);
  const starImages = useMemo(() => [...STAR_IMAGES], []);

  const registerTimeout = useCallback((callback: () => void, delay: number) => {
    const handle = setTimeout(() => {
      timeoutHandlesRef.current = timeoutHandlesRef.current.filter((entry) => entry !== handle);
      callback();
    }, delay);

    timeoutHandlesRef.current.push(handle);
    return handle;
  }, []);

  const registerAnimation = useCallback((control: AnimationPlaybackControls) => {
    animationControlsRef.current.push(control);
    return control;
  }, []);

  const clearScheduledWork = useCallback(() => {
    timeoutHandlesRef.current.forEach(clearTimeout);
    timeoutHandlesRef.current = [];
    animationControlsRef.current.forEach((control) => control.stop());
    animationControlsRef.current = [];
  }, []);

  const getRandomStar = useCallback(() => {
    const index = Math.floor(Math.random() * starImages.length);
    return starImages[index];
  }, [starImages]);

  const getCurrentMultiplier = useCallback(
    (xp: number) => {
      const progressPercent = (xp / MAX_XP) * 100;
      const activeZone = [...multiplierZones].reverse().find((zone) => progressPercent >= zone.threshold);
      return activeZone ? activeZone.multiplier : 1;
    },
    [multiplierZones],
  );

  const triggerMilestone = useCallback(
    (threshold: number, trophy: string) => {
      const milestoneId = animationRef.current.milestoneId++;
      setMilestoneAnimations((prev) => [...prev, { id: milestoneId, threshold, trophy }]);

      registerTimeout(() => {
        setMilestoneAnimations((prev) => prev.filter((m) => m.id !== milestoneId));
      }, 2000);
    },
    [registerTimeout],
  );

  // Note: Avoid layout reads (getBoundingClientRect/clientWidth) for marker positioning;
  // we rely on pure CSS percentage-based placement relative to the track.

  useEffect(() => {
    const unsubscribe = xpValue.on('change', (latest) => {
      setDisplayXP(latest);
    });

    return () => {
      unsubscribe();
    };
  }, [xpValue]);

  useEffect(() => {
    lastProgressRef.current = progressValue.get();

    const unsubscribe = progressValue.on('change', (latest) => {
      const previous = lastProgressRef.current;
      setProgressDisplay(latest);

      if (latest < previous - 1.5) {
        reachedMilestonesRef.current.clear();
        setMilestoneAnimations([]);
      } else {
        multiplierZones.forEach((zone) => {
          if (!reachedMilestonesRef.current.has(zone.threshold) && previous < zone.threshold && latest >= zone.threshold) {
            reachedMilestonesRef.current.add(zone.threshold);
            triggerMilestone(zone.threshold, zone.trophy);
          }
        });
      }

      lastProgressRef.current = latest;
    });

    return () => {
      unsubscribe();
    };
  }, [multiplierZones, progressValue, triggerMilestone]);

  useEffect(() => {
    const computedMultiplier = getCurrentMultiplier(displayXP);
    setCurrentMultiplier((prev) => (prev === computedMultiplier ? prev : computedMultiplier));
  }, [displayXP, getCurrentMultiplier]);

  useEffect(() => {
    let stopped = false;

    const resetAnimation = () => {
      clearScheduledWork();
      reachedMilestonesRef.current.clear();
      animationRef.current = { orbId: 0, floatingId: 0, milestoneId: 0 };
      xpSequenceRef.current = createXpSequence();
      sequenceIndexRef.current = 0;
      xpRef.current = INITIAL_XP;

      progressValue.stop();
      xpValue.stop();
      progressValue.set((INITIAL_XP / MAX_XP) * 100);
      xpValue.set(INITIAL_XP);
      lastProgressRef.current = progressValue.get();

      setFloatingXP([]);
      setMilestoneAnimations([]);
      setDisplayXP(INITIAL_XP);
      setProgressDisplay((INITIAL_XP / MAX_XP) * 100);
      setCurrentMultiplier(getCurrentMultiplier(INITIAL_XP));
    };

    const startGainLoop = () => {
      const runGain = () => {
        if (stopped) {
          return;
        }

        const script = xpSequenceRef.current;
        const stepIndex = sequenceIndexRef.current;

        if (stepIndex >= script.length) {
          registerTimeout(() => {
            if (stopped) {
              return;
            }

            resetAnimation();
            registerTimeout(runGain, FIRST_GAIN_DELAY_MS);
          }, RESET_DELAY_MS);
          return;
        }

        const startingXP = xpRef.current;
        const targetXP = script[stepIndex];

        if (targetXP <= startingXP + 1) {
          sequenceIndexRef.current += 1;
          registerTimeout(runGain, 40);
          return;
        }

        const actualGain = Math.min(targetXP - startingXP, MAX_XP - startingXP);

        if (actualGain <= 0) {
          sequenceIndexRef.current += 1;
          registerTimeout(runGain, 80);
          return;
        }

        const nextIndex = stepIndex + 1;
        sequenceIndexRef.current = nextIndex;

        const zoneBoost = Math.max(1, getCurrentMultiplier(targetXP));
        const targetPercent = (targetXP / MAX_XP) * 100;
        const visualPercent = Math.min(99.4, targetPercent);

  // Advance internal ids; orbId not used for rendering, so don't store
  animationRef.current.orbId++;
        const floatingId = animationRef.current.floatingId++;


        registerTimeout(() => {
          setFloatingXP((prev) => prev.filter((entry) => entry.id !== floatingId));
        }, ORB_IMPACT_DELAY_MS + FLOATING_LIFETIME_MS);

        registerTimeout(() => {
          setFloatingXP((prev) => [
            ...prev,
            {
              id: floatingId,
              value: actualGain,
              percent: visualPercent,
              offset: (Math.random() - 0.5) * (18 + zoneBoost * 4),
            },
          ]);
        }, Math.max(0, ORB_IMPACT_DELAY_MS - FLOATING_SPAWN_LEAD_MS));

        registerTimeout(() => {
          registerAnimation(
            animate(xpValue, targetXP, {
              duration: PROGRESS_DURATION,
              ease: PROGRESS_EASE,
            }),
          );

          registerAnimation(
            animate(progressValue, targetPercent, {
              duration: PROGRESS_DURATION,
              ease: PROGRESS_EASE,
              onComplete: () => {
                xpRef.current = targetXP;
              },
            }),
          );
        }, ORB_IMPACT_DELAY_MS);

        registerTimeout(runGain, GAIN_INTERVAL_MS);
      };

      registerTimeout(runGain, FIRST_GAIN_DELAY_MS);
    };

    resetAnimation();
    startGainLoop();

    return () => {
      stopped = true;
      clearScheduledWork();
    };
  }, [
    clearScheduledWork,
    getCurrentMultiplier,
    getRandomStar,
    progressValue,
    registerAnimation,
    registerTimeout,
    xpValue,
  ]);

  const progressPercent = progressDisplay;
  const zoneColor = useMemo(() => {
    if (progressPercent >= 80) return '#1E90FF';
    if (progressPercent >= 60) return '#19D9FF';
    if (progressPercent >= 40) return '#00D0C7';
    if (progressPercent >= 20) return '#20B2AA';
    return '#2F6B95';
  }, [progressPercent]);

  // Dynamic glow that intensifies with progress (LED-like behavior)
  const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
  const intensity = clamp01(progressPercent / 100);
  const hexToRgb = (hex: string) => {
    const m = hex.replace('#', '');
    const r = parseInt(m.substring(0, 2), 16);
    const g = parseInt(m.substring(2, 4), 16);
    const b = parseInt(m.substring(4, 6), 16);
    return { r, g, b };
  };
  const rgba = (hex: string, a: number) => {
    const { r, g, b } = hexToRgb(hex);
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  };
  const glowAlpha = 0.35 + intensity * 0.5; // 0.35 -> 0.85
  const glowColor = rgba(zoneColor, glowAlpha);
  const fillGlowBlur = 16 + Math.round(12 * intensity); // 16px -> 28px
  const trackGlowBlur = 12 + Math.round(10 * intensity); // 12px -> 22px

  return (
    <div
      ref={containerRef}
      className="pf-progress-demo pf-xp-accumulation"
      data-animation-id="progress-bars__xp-accumulation"
    >

      <div className="pf-xp-counter" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
        <span
          style={{
            fontSize: '16px',
            fontWeight: 700,
            color: zoneColor,
            textShadow: `0 0 12px ${glowColor}`,
            letterSpacing: '0.5px',
          }}
        >
          {Math.round(displayXP).toLocaleString()} / {MAX_XP.toLocaleString()} XP
        </span>

        <AnimatePresence>
          {currentMultiplier > 1 && (
            <motion.span
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ duration: 0.38, ease: 'easeOut' }}
              style={{
                fontSize: '14px',
                fontWeight: 800,
                color: '#FFD700',
                textShadow: '0 0 8px rgba(255, 215, 0, 0.65)',
                letterSpacing: '1px',
              }}
            >
              x{currentMultiplier}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <div className="pf-xp-container" style={{ position: 'relative', height: '60px' }}>
        <div
          className="pf-progress-track"
          style={{
            width: '100%',
            height: '12px',
            background: 'linear-gradient(180deg, rgba(10, 18, 25, 0.65) 0%, rgba(34, 49, 63, 0.35) 100%)',
            borderRadius: '6px',
            position: 'absolute',
            top: '24px',
            overflow: 'visible',
            boxShadow: `inset 0 2px 4px rgba(0, 0, 0, 0.35), 0 0 ${trackGlowBlur}px ${glowColor}`,
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <motion.div
            className="pf-progress-fill"
            style={{
              height: '100%',
              background: `linear-gradient(90deg, ${zoneColor} 0%, #00FFFF 55%, ${zoneColor} 100%)`,
              borderRadius: '6px',
              transformOrigin: 'left center',
              boxShadow: `0 0 ${fillGlowBlur}px ${glowColor}, inset 0 1px 2px rgba(255, 255, 255, 0.25)`,
              position: 'relative',
              overflow: 'visible',
              scaleX: progressScale,
            }}
          />

          {multiplierZones.map((zone) => {
            const isActive = progressPercent >= zone.threshold - 0.2;
            const milestoneAnim = milestoneAnimations.find((m) => m.threshold === zone.threshold);
            const indicatorColor = isActive ? zoneColor : 'rgba(255, 255, 255, 0.28)';

            return (
              <div
                key={zone.threshold}
                style={{
                  position: 'absolute',
                  left: `${zone.threshold}%`,
                  top: '50%',
                  height: '100%',
                  transform: 'translate(-50%, -50%)',
                  zIndex: 12,
                }}
              >
                <motion.div
                  style={{
                    position: 'absolute',
                    width: '3px',
                    height: '24px',
                    borderRadius: '999px',
                    background: `linear-gradient(180deg, rgba(255,255,255,0.15) 0%, ${indicatorColor} 100%)`,
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    boxShadow: isActive ? `0 0 10px ${rgba(zoneColor, 0.45 + 0.25 * intensity)}` : 'none',
                  }}
                  animate={{
                    opacity: isActive ? 1 : 0.38,
                    scaleY: isActive ? 1 : 0.7,
                  }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                />

                <motion.div
                  style={{
                    position: 'absolute',
                    width: '14px',
                    height: '14px',
                    borderRadius: '50%',
                    background: isActive
                      ? `radial-gradient(circle, ${zoneColor} 0%, #00FFFF 60%, rgba(255,255,255,0.95) 100%)`
                      : 'rgba(255, 255, 255, 0.25)',
                    border: isActive ? `1px solid ${zoneColor}99` : '1px solid rgba(255,255,255,0.2)',
                    left: 'calc(50% - 6px)',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                  }}
                  animate={{
                    scale: isActive ? 1 : 0.9,
                    boxShadow: isActive ? `0 0 12px ${rgba(zoneColor, 0.5 + 0.3 * intensity)}` : 'none',
                  }}
                  transition={{ duration: 0.32, ease: 'easeOut' }}
                />

                <AnimatePresence>
                  {milestoneAnim && (
                    <motion.div
                      key={`halo-${zone.threshold}`}
                      initial={{ scale: 0.55, opacity: 0.6 }}
                      animate={{ scale: 1.3, opacity: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.9, ease: 'easeOut' }}
                      style={{
                        position: 'absolute',
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        border: `1px solid ${zoneColor}55`,
                        boxShadow: `0 0 10px ${zoneColor}44`,
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                      }}
                    />
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {/* Trophy animation removed per requirement */}
                </AnimatePresence>

                <motion.span
                  style={{
                    position: 'absolute',
                    fontSize: '10px',
                    fontWeight: 700,
                    color: isActive ? '#F8FBFF' : 'rgba(255, 255, 255, 0.45)',
                    letterSpacing: '0.6px',
                    textShadow: isActive ? `0 0 6px ${rgba(zoneColor, 0.75)}` : 'none',
                    top: '26px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    whiteSpace: 'nowrap',
                  }}
                  animate={{ opacity: isActive ? 1 : 0.42 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                >
                  x{zone.multiplier}
                </motion.span>
              </div>
            );
          })}
        </div>



        <AnimatePresence>
          {floatingXP.map((floating) => (
            <motion.div
              key={floating.id}
              initial={{ opacity: 0, y: 0, scale: 0.6 }}
              animate={{
                opacity: [0, 1, 1, 0],
                y: [0, -18, -36, -52],
                scale: [0.6, 1.05, 1, 0.92],
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.45, times: [0, 0.28, 0.68, 1], ease: 'easeOut' }}
              style={{
                position: 'absolute',
                top: '18px',
                left: `calc(${Math.min(floating.percent, 100)}% + ${floating.offset}px)`,
                pointerEvents: 'none',
                zIndex: 15,
                fontSize: '12px',
                fontWeight: 700,
                color: '#00FFFF',
                textShadow: '0 0 8px rgba(0, 255, 255, 0.85), 0 0 4px rgba(0, 255, 255, 0.55)',
                transform: 'translateX(-50%)',
              }}
            >
              +{Math.round(floating.value)} XP
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
