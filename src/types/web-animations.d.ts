// Ensure DOM Element has Web Animations API types (non-optional)
// This aligns with modern browsers and our runtime polyfills in tests.
declare global {
  interface Element {
    animate(
      keyframes: Keyframe[] | PropertyIndexedKeyframes,
      options?: number | KeyframeAnimationOptions
    ): Animation
    getAnimations(): Animation[]
  }
}

export {}
