import type { PropsWithChildren } from 'react';
import { useState } from 'react';

interface AnimationCardProps extends PropsWithChildren {
  title: string;
  description: string;
  animationId: string;
  onReplay?: () => void;
}

export function AnimationCard({
  title,
  description,
  animationId,
  children,
  onReplay
}: AnimationCardProps) {
  const [replayKey, setReplayKey] = useState(0);

  const handleReplay = () => {
    setReplayKey((key) => key + 1);
    onReplay?.();
  };

  return (
    <div className="pf-card" data-animation-id={animationId}>
      <header className="pf-card__header">
        <div>
          <h3 className="pf-card__title">{title}</h3>
        </div>
      </header>

      <p className="pf-card__description">{description}</p>

      <div className="pf-demo-canvas">
        <div key={replayKey} className="pf-demo-stage pf-demo-stage--top">
          {children}
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
