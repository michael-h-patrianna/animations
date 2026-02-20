/* eslint-disable animation-rules/require-animation-metadata, animation-rules/require-dual-implementation -- helper components, not standalone animations */
import { useEffect, useRef } from 'react';

/** Floating XP data */
export interface FloatingXP {
  id: number
  value: number
  percent: number
  offset: number
}

/** Multiplier badge with scale-in animation */
export function MultiplierBadge({ multiplier }: { multiplier: number }) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!ref.current) return

    const element = ref.current
    const animation = element.animate(
      [
        { transform: 'scale(0.4)', opacity: 0 },
        { transform: 'scale(1)', opacity: 1 }
      ],
      {
        duration: 380,
        easing: 'ease-out',
        fill: 'forwards'
      }
    )

    return () => {
      animation.cancel()
    }
  }, [])

  return (
    <span
      ref={ref}
      className="pf-xp-multiplier"
      style={{ transform: 'scale(0.4)', opacity: 0, willChange: 'transform, opacity' }}
    >
      x{multiplier}
    </span>
  )
}

/** Marker indicator with active state animation */
export function MarkerIndicator({ isActive }: { isActive: boolean }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return

    const element = ref.current
    const animation = element.animate(
      [
        { opacity: isActive ? 1 : 0.38, transform: `scaleY(${isActive ? 1 : 0.7})` }
      ],
      {
        duration: 300,
        easing: 'ease-out',
        fill: 'forwards'
      }
    )

    return () => {
      animation.cancel()
    }
  }, [isActive])

  return (
    <div
      ref={ref}
      className="pf-marker__indicator"
      style={{ willChange: 'opacity, transform' }}
    />
  )
}

/** Marker dot with active state scale animation */
export function MarkerDot({ isActive }: { isActive: boolean }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return

    const element = ref.current
    const animation = element.animate(
      [
        { transform: `scale(${isActive ? 1 : 0.9})` }
      ],
      {
        duration: 320,
        easing: 'ease-out',
        fill: 'forwards'
      }
    )

    return () => {
      animation.cancel()
    }
  }, [isActive])

  return (
    <div
      ref={ref}
      className="pf-marker__dot"
      style={{ willChange: 'transform' }}
    />
  )
}

/** Marker label with active state opacity animation */
export function MarkerLabel({ isActive, children }: { isActive: boolean; children: React.ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!ref.current) return

    const element = ref.current
    const animation = element.animate(
      [
        { opacity: isActive ? 1 : 0.42 }
      ],
      {
        duration: 250,
        easing: 'ease-out',
        fill: 'forwards'
      }
    )

    return () => {
      animation.cancel()
    }
  }, [isActive])

  return (
    <span
      ref={ref}
      className="pf-marker__label"
      style={{ willChange: 'opacity' }}
    >
      {children}
    </span>
  )
}

/** Milestone pulse ring animation */
export function MilestonePulse({ threshold, isBoundary }: { threshold: number; isBoundary?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return

    const element = ref.current
    const animation = element.animate(
      [
        { transform: 'scale(0.8)', opacity: 0.6 },
        { transform: 'scale(1.6)', opacity: 0 }
      ],
      {
        duration: 800,
        easing: 'ease-out',
        fill: 'forwards'
      }
    )

    return () => {
      animation.cancel()
    }
  }, [])

  return (
    <div
      ref={ref}
      key={`pulse-${threshold}`}
      className={`pf-marker__pulse${isBoundary ? ' pf-marker__pulse--boundary' : ''}`}
      style={{ willChange: 'transform, opacity' }}
    />
  )
}

/** Milestone halo animation */
export function MilestoneHalo({ threshold }: { threshold: number }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return

    const element = ref.current
    const animation = element.animate(
      [
        { transform: 'scale(0.55)', opacity: 0.6 },
        { transform: 'scale(1.3)', opacity: 0 }
      ],
      {
        duration: 900,
        easing: 'ease-out',
        fill: 'forwards'
      }
    )

    return () => {
      animation.cancel()
    }
  }, [])

  return (
    <div
      ref={ref}
      key={`halo-${threshold}`}
      className="pf-marker__halo"
      style={{ willChange: 'transform, opacity' }}
    />
  )
}

/** Floating XP display with rise-and-fade animation */
export function FloatingXPDisplay({ floating }: { floating: FloatingXP }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return

    const element = ref.current
    const animation = element.animate(
      [
        { opacity: 0, transform: 'translateY(0px) scale(0.6)' },
        { opacity: 1, transform: 'translateY(-18px) scale(1.05)', offset: 0.28 },
        { opacity: 1, transform: 'translateY(-36px) scale(1)', offset: 0.68 },
        { opacity: 0, transform: 'translateY(-52px) scale(0.92)' }
      ],
      {
        duration: 1450,
        easing: 'ease-out',
        fill: 'forwards'
      }
    )

    return () => {
      animation.cancel()
    }
  }, [])

  return (
    <div
      ref={ref}
      key={floating.id}
      className="pf-floating-xp"
      style={{
        left: `calc(${Math.min(floating.percent, 100)}% + ${floating.offset}px)`,
        willChange: 'opacity, transform'
      }}
    >
      +{Math.round(floating.value)} XP
    </div>
  )
}
