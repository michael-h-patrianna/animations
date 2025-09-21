import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import './realtime-data.css';

export function RealtimeDataLeaderboardShift() {
  const [isAnimating, setIsAnimating] = useState(false);
  const [leaderboard, setLeaderboard] = useState([
    { rank: 1, player: 'Phoenix', score: 2450 },
    { rank: 2, player: 'Shadow', score: 2380 },
    { rank: 3, player: 'Nova', score: 2320 },
    { rank: 4, player: 'Apex', score: 2290 }
  ]);

  useEffect(() => {
  let timeoutId: ReturnType<typeof setTimeout>;

    const startAnimation = () => {
      setIsAnimating(true);

      // After animation, reorganize leaderboard
      setTimeout(() => {
        const newLeaderboard = [...leaderboard];
        const firstPlayer = newLeaderboard.shift()!;
        firstPlayer.rank = 4;
        firstPlayer.score -= 50;
        newLeaderboard.push(firstPlayer);

        // Update ranks
        newLeaderboard.forEach((player, index) => {
          player.rank = index + 1;
        });

        setLeaderboard(newLeaderboard);
        setIsAnimating(false);

        // Reset after delay
        timeoutId = setTimeout(() => {
          setLeaderboard([
            { rank: 1, player: 'Phoenix', score: 2450 },
            { rank: 2, player: 'Shadow', score: 2380 },
            { rank: 3, player: 'Nova', score: 2320 },
            { rank: 4, player: 'Apex', score: 2290 }
          ]);
          setTimeout(startAnimation, 1000);
        }, 2000);
      }, 1000);
    };

    startAnimation();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div
      className="pf-realtime-data"
      data-animation-id="realtime-data__leaderboard-shift"
    >
      <div className="pf-realtime-data__leaderboard">
        <AnimatePresence mode="popLayout">
          {leaderboard.map((player, index) => (
            <motion.div
              key={player.player}
              className="pf-realtime-data__row"
              layout
              initial={index === 0 && isAnimating ? { y: 0, opacity: 1 } : false}
              animate={
                index === 0 && isAnimating
                  ? { y: 100, opacity: 0 }
                  : { y: 0, opacity: 1 }
              }
              exit={{ y: 100, opacity: 0 }}
              transition={{
                duration: 0.8,
                ease: [0.25, 0.46, 0.45, 0.94] as const
              }}
            >
              <div className="pf-realtime-data__rank">#{player.rank}</div>
              <div className="pf-realtime-data__player">{player.player}</div>
              <div className="pf-realtime-data__score">{player.score.toLocaleString()}</div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
