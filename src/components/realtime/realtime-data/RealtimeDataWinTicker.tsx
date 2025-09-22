// React import not required for JSX in React 17+
import { motion } from 'framer-motion'
import './RealtimeDataWinTicker.css'

export function RealtimeDataWinTicker() {
  const tickerText = 'Mega Win! +5,000 credits · Daily streak unlocked · Bonus wheel ready · '

  return (
    <div className="pf-realtime-data" data-animation-id="realtime-data__win-ticker">
      <div className="pf-realtime-data__ticker">
        <motion.div
          className="pf-realtime-data__ticker-text"
          initial={{ x: '100%' }}
          animate={{ x: '-100%' }}
          transition={{
            duration: 8,
            ease: 'linear',
            repeat: Infinity,
            repeatType: 'loop',
          }}
        >
          {tickerText.repeat(3)} {/* Repeat to ensure continuous scrolling */}
        </motion.div>
      </div>
    </div>
  )
}
