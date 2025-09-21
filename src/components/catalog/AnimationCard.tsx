import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ChevronDown } from 'lucide-react';
import type { PropsWithChildren } from 'react';
import { useEffect, useRef, useState } from 'react';

interface AnimationCardProps extends PropsWithChildren {
  title: string;
  description: string;
  animationId: string;
  onReplay?: () => void;
  infiniteAnimation?: boolean; // For animations that should loop indefinitely
  disableReplay?: boolean; // When true, hide/disable the replay button
}

export function AnimationCard({
  title,
  description,
  animationId,
  children,
  onReplay,
  infiniteAnimation = false,
  disableReplay = false
}: AnimationCardProps) {
  const [replayKey, setReplayKey] = useState(0);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
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
    <Card className="pf-card" data-animation-id={animationId} ref={cardRef}>
      <CardHeader className="p-0 pb-3 space-y-0">
        <CardTitle className="pf-card__title mb-2">{title}</CardTitle>
        <div className="flex items-start gap-2">
          <p
            className={`pf-card__description flex-1 m-0 transition-all duration-200 ${
              !isExpanded ? 'line-clamp-1' : ''
            }`}
          >
            {description}
          </p>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="shrink-0 p-0 bg-transparent border-none cursor-pointer focus:outline-none"
            aria-label={isExpanded ? 'Collapse description' : 'Expand description'}
            style={{ marginTop: '4px' }}
          >
            <ChevronDown
              className={`h-3 w-3 transition-transform duration-200 ${
                isExpanded ? 'rotate-180' : ''
              }`}
              style={{ color: 'var(--pf-text-secondary)', opacity: 0.6 }}
            />
          </button>
        </div>
      </CardHeader>

      <CardContent className="p-0 py-3">
        <div className="pf-demo-canvas">
          <div key={replayKey} className="pf-demo-stage pf-demo-stage--top">
            {isVisible || infiniteAnimation ? children : null}
          </div>
        </div>
      </CardContent>

      <CardFooter className="pf-card__actions p-0 pt-3">
        <div className="pf-card__controls">
          <Button
            variant="outline"
            size="sm"
            className="pf-card__replay"
            data-role="replay"
            onClick={handleReplay}
            disabled={disableReplay}
            aria-disabled={disableReplay}
          >
            Replay
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
