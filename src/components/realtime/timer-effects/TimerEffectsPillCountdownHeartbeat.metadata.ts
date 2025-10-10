import type { AnimationMetadata } from '@/types/animation'

export const timerEffectsPillCountdownHeartbeatMetadata: AnimationMetadata = {
  id: 'timer-effects__pill-countdown-heartbeat',
  title: 'Pill Countdown — Threshold Pulse',
  description:
    '60s timer with discrete heartbeat pulses at 50/40/30/20/10s thresholds. Pulse intensity increases with urgency. Continuous heartbeat only in final 10s. Ends with red glow pulse at 00:00.',
  tags: ['js', 'css'],
}

export default timerEffectsPillCountdownHeartbeatMetadata
