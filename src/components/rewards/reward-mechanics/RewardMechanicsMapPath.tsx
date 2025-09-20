import { useEffect, useRef } from 'react';
import './reward-mechanics.css';

export function RewardMechanicsMapPath() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isAnimatingRef = useRef(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const startAnimation = async () => {
      const steps = containerRef.current?.querySelectorAll('.pf-reward-map__step');
      if (!steps || steps.length === 0 || isAnimatingRef.current) return;
      
      isAnimatingRef.current = true;
      
      // Remove 'is-active' class from all steps
      steps.forEach(step => {
        step.classList.remove('is-active');
      });
      
      // 4 steps activate sequentially by adding 'is-active' class
      // 120ms delay between each step activation
      const activationPromises = Array.from(steps).map((step, index) => {
        return new Promise<void>((resolve) => {
          setTimeout(() => {
            step.classList.add('is-active');
            resolve();
          }, index * 120);
        });
      });

      try {
        await Promise.all(activationPromises);
        isAnimatingRef.current = false;
        
        // Auto-restart after 2 second delay
        timeoutId = setTimeout(() => {
          startAnimation();
        }, 2000);
      } catch (error) {
        // Animation was cancelled
        isAnimatingRef.current = false;
      }
    };

    startAnimation();
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div 
      className="pf-reward-mechanic pf-reward-mechanic--map-path" 
      ref={containerRef}
      data-animation-id="reward-mechanics__map-path"
    >
      <div className="pf-reward-map">
        <div className="pf-reward-map__step"></div>
        <div className="pf-reward-map__step"></div>
        <div className="pf-reward-map__step"></div>
        <div className="pf-reward-map__step"></div>
      </div>
    </div>
  );
}
