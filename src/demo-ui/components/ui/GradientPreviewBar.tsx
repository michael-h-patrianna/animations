import React, { useCallback, useMemo, useRef, useState } from 'react'
import { toCssGradientString } from '@/demo-ui/lib/colors/gradientUtils'
import { sx } from '@/demo-ui/lib/sx'
import type { GradientStop, LinearGradientValue } from '@/types/gradient'
import {
  CHECKERBOARD,
  MARKER_HIT_SIZE,
  MARKER_SIZE,
  MAX_STOPS,
  interpolateColorAtPosition,
} from '@/demo-ui/components/ui/gradientEditorColor'
import type { StopWithKey } from '@/demo-ui/components/ui/gradientEditorTypes'

/**
 *
 */
export function GradientPreviewBar({
  gradient,
  stops,
  selectedIndex,
  onSelectStop,
  onStopPositionChange,
  onAddStop,
}: {
  gradient: LinearGradientValue
  stops: StopWithKey[]
  selectedIndex: number
  onSelectStop: (index: number) => void
  onStopPositionChange: (index: number, position: number) => void
  onAddStop: (position: number, color: string) => void
}) {
  const barRef = useRef<HTMLDivElement>(null)
  const sortedStops = useMemo(
    () => gradient.stops.slice().sort((a, b) => a.position - b.position),
    [gradient.stops]
  )
  const cssGradient = toCssGradientString({ ...gradient, angle: 90, stops: sortedStops })

  const positionFromClient = useCallback((clientX: number): number => {
    if (!barRef.current) return 0
    const rect = barRef.current.getBoundingClientRect()
    if (rect.width === 0) return 0
    return Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100))
  }, [])

  const handleBarClick = useCallback(
    (e: React.MouseEvent) => {
      if ((e.target as HTMLElement).closest('[data-gradient-marker]')) return
      if (stops.length >= MAX_STOPS) return
      const pos = positionFromClient(e.clientX)
      const color = interpolateColorAtPosition(sortedStops, pos)
      onAddStop(pos, color)
    },
    [stops.length, positionFromClient, sortedStops, onAddStop]
  )

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-xs text-text-tertiary font-medium">Gradient</span>
        <span className="text-xs text-text-tertiary font-mono">{String(gradient.angle)}°</span>
      </div>
      <div
        ref={barRef}
        className="relative h-8 rounded-md ring-1 ring-border-default cursor-crosshair overflow-visible"
        onClick={handleBarClick}
      >
        <div
          className="absolute inset-0 -z-10 rounded-md"
          style={sx({ backgroundImage: `url(${CHECKERBOARD})`, opacity: 0.4 })}
        />
        <div className="absolute inset-0 rounded-md" style={sx({ background: cssGradient })} />
        {stops.map((stop, i) => (
          <GradientMarker
            key={stop.key}
            stop={stop}
            index={i}
            isSelected={i === selectedIndex}
            barRef={barRef}
            onSelect={() => onSelectStop(i)}
            onPositionChange={(pos) => onStopPositionChange(i, pos)}
          />
        ))}
      </div>
    </div>
  )
}

function GradientMarker({
  stop,
  index,
  isSelected,
  barRef,
  onSelect,
  onPositionChange,
}: {
  stop: GradientStop
  index: number
  isSelected: boolean
  barRef: React.RefObject<HTMLDivElement | null>
  onSelect: () => void
  onPositionChange: (position: number) => void
}) {
  const [isDragging, setIsDragging] = useState(false)
  const startXRef = useRef(0)
  const startPosRef = useRef(0)

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault()
      e.stopPropagation()
      onSelect()
      setIsDragging(true)
      startXRef.current = e.clientX
      startPosRef.current = stop.position
      ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    },
    [onSelect, stop.position]
  )

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging || !barRef.current) return
      const rect = barRef.current.getBoundingClientRect()
      if (rect.width === 0) return
      const deltaPercent = ((e.clientX - startXRef.current) / rect.width) * 100
      const newPos = Math.max(0, Math.min(100, startPosRef.current + deltaPercent))
      onPositionChange(Math.round(newPos * 10) / 10)
    },
    [isDragging, barRef, onPositionChange]
  )

  const handlePointerUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  return (
    <div
      data-gradient-marker
      data-testid={`gradient-marker-${String(index)}`}
      className={`absolute top-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing touch-none flex items-center justify-center ${isSelected ? 'z-20' : 'z-10'}`}
      style={sx({
        left: `calc(${String(stop.position)}% - ${String(MARKER_HIT_SIZE / 2)}px)`,
        width: `${String(MARKER_HIT_SIZE)}px`,
        height: `${String(MARKER_HIT_SIZE)}px`,
      })}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <div
        className={`rounded-full border-2 shadow-md transition-transform ${
          isSelected
            ? 'border-white ring-2 ring-accent scale-110'
            : 'border-white/80 hover:scale-110'
        }`}
        style={sx({
          backgroundColor: stop.color,
          width: `${String(MARKER_SIZE)}px`,
          height: `${String(MARKER_SIZE)}px`,
        })}
      />
    </div>
  )
}
