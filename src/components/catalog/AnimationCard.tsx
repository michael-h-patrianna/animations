import type { PropsWithChildren } from 'react';
import { useState, useEffect, useRef } from 'react';

interface AnimationCardProps extends PropsWithChildren {
  title: string;
  description: string;
  animationId: string;
  onReplay?: () => void;
  infiniteAnimation?: boolean; // For animations that should loop indefinitely
}

export function AnimationCard({
  title,
  description,
  animationId,
  children,
  onReplay,
  infiniteAnimation = false
}: AnimationCardProps) {
  const [replayKey, setReplayKey] = useState(0);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (infiniteAnimation) {
      // Infinite animations should always be visible/playing
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasPlayed) {
          setIsVisible(true);
          setHasPlayed(true);
          // Trigger animation by updating key
          setReplayKey((key) => key + 1);
        }
      },
      {
        threshold: 0.3, // Trigger when 30% of the card is visible
        rootMargin: '0px'
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, [hasPlayed, infiniteAnimation]);

  const handleReplay = () => {
    setReplayKey((key) => key + 1);
    onReplay?.();
  };

  return (
    <div className="pf-card" data-animation-id={animationId} ref={cardRef}>
      <header className="pf-card__header">
        <div>
          <h3 className="pf-card__title">{title}</h3>
        </div>
      </header>

      <p className="pf-card__description">{description}</p>

      <div className="pf-demo-canvas">
        <div key={replayKey} className="pf-demo-stage pf-demo-stage--top">
          {isVisible || infiniteAnimation ? children : null}
        </div>
      </div>

      <div className="pf-card__actions">
        <div className="pf-card__controls">
          <button
            type="button"
            className="pf-card__replay"
            data-role="replay"
            onClick={handleReplay}
          >
            Replay
          </button>
        </div>
      </div>
    </div>
  );
}
