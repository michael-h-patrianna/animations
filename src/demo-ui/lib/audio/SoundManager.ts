/**
 * SoundManager stub - no-op implementation for compatibility with demo-ui components.
 * Components import soundManager.playClick(), playHover(), etc.
 * This stub provides the same API with no audio output.
 */

const noop = () => {}

export const soundManager = {
  playClick: noop,
  playHover: noop,
  playSwish: noop,
  playSnap: noop,
  playSuccess: noop,
  playError: noop,
}
