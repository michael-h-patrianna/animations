import { useEffect, useRef, useState } from 'react';
import './timer-effects.css';

export function TimerEffectsTimerFlash() {
  const [seconds, setSeconds] = useState(32);
  const [isAnimating, setIsAnimating] = useState(false);
  const timerRef = useRef<HTMLDivElement>(null);
  const lastStyleUpdateRef = useRef({ color: '', animation: '' });

  useEffect(() => {
    let animationId: number;
  let timeoutId: ReturnType<typeof setTimeout>;

    const startAnimation = () => {
      if (isAnimating) return;

      setIsAnimating(true);
      setSeconds(32);

      const timer = timerRef.current;
      if (!timer) return;

      const duration = 32000; // 32 seconds total
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Calculate remaining seconds with higher precision
        const remainingSeconds = Math.max(0, 32 - (elapsed / 1000));
        const displaySeconds = Math.max(0, Math.ceil(remainingSeconds));

        // Only update state when display value actually changes to avoid unnecessary re-renders
        if (displaySeconds !== seconds) {
          setSeconds(displaySeconds);
        }

        // Apply urgency effects based on precise time left (not display seconds)
        const urgencyLevel = remainingSeconds <= 30 ? (30 - remainingSeconds) / 30 : 0;

        // Smoother color transition: yellow to red
        const yellow = { r: 255, g: 193, b: 7 }; // #ffc107
        const red = { r: 220, g: 53, b: 69 }; // #dc3545

        // Use easing function for smoother color transition
        const easeInOut = (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        const easedUrgency = easeInOut(urgencyLevel);

        const r = Math.round(yellow.r + (red.r - yellow.r) * easedUrgency);
        const g = Math.round(yellow.g + (red.g - yellow.g) * easedUrgency);
        const b = Math.round(yellow.b + (red.b - yellow.b) * easedUrgency);

        const newColor = `rgb(${r}, ${g}, ${b})`;

        // Only update background color if it has changed
        if (newColor !== lastStyleUpdateRef.current.color) {
          timer.style.backgroundColor = newColor;
          lastStyleUpdateRef.current.color = newColor;
        }

        // Smoother pulsing intensity based on urgency
        let newAnimation = 'none';
        if (remainingSeconds <= 30) {
          const pulseSpeed = Math.max(300, 1000 - (urgencyLevel * 700)); // 1000ms to 300ms (slower transition)
          const pulseScale = 1 + (urgencyLevel * 0.15); // up to 1.15x scale (less aggressive)

          newAnimation = `flash-urgency-pulse ${pulseSpeed}ms infinite ease-in-out`;
          timer.style.setProperty('--pulse-scale', pulseScale.toString());
        }

        // Only update animation if it has changed
        if (newAnimation !== lastStyleUpdateRef.current.animation) {
          timer.style.animation = newAnimation;
          lastStyleUpdateRef.current.animation = newAnimation;
        }

        if (progress < 1) {
          animationId = requestAnimationFrame(animate);
        } else {
          setIsAnimating(false);
          timer.style.animation = 'none';
          // Auto-restart after a brief pause
          timeoutId = setTimeout(startAnimation, 2000);
        }
      };

      animationId = requestAnimationFrame(animate);
    };

    // Start animation immediately
    startAnimation();

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
      if (timeoutId) clearTimeout(timeoutId);
      if (timerRef.current) {
        timerRef.current.style.animation = 'none';
        timerRef.current.style.backgroundColor = '';
      }
    };
  }, []);

  // Format time as MM:SS
  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div
      className="pf-timer-flash"
      data-animation-id="timer-effects__timer-flash"
    >
      <div
        ref={timerRef}
        className="pf-timer-flash__pill"
      >
        <div className="pf-timer-flash__time">{formatTime(seconds)}</div>
      </div>
      <span className="pf-timer-flash__label">Flash Expire</span>
    </div>
  );
}
