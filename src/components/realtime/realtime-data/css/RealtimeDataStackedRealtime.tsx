import { useEffect, useMemo, useRef, type MutableRefObject } from 'react'
import './RealtimeDataStackedRealtime.css'

type TimeoutId = ReturnType<typeof setTimeout>

type StackItem = {
  label: string
  value: string
  active: boolean
}

const STACK_ITEMS: StackItem[] = [
  { label: 'Active Players', value: '1,247', active: true },
  { label: 'Total Wins', value: '856', active: false },
  { label: 'Live Games', value: '23', active: true },
  { label: 'Pending Rewards', value: '42', active: false },
  { label: 'Daily Bonus', value: '2x', active: true },
]

const enterAnimation = (offsetX: number, delayMs: number) => ({
  keyframes: [
    { transform: `translateX(${offsetX}px)`, opacity: 0 },
    { transform: 'translateX(0)', opacity: 1 },
  ],
  options: {
    duration: 600,
    delay: delayMs,
    easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    fill: 'forwards' as const,
  },
})

const exitAnimation = (offsetX: number) => ({
  keyframes: [
    { transform: 'translateX(0)', opacity: 1 },
    { transform: `translateX(${offsetX}px)`, opacity: 0 },
  ],
  options: {
    duration: 400,
    easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    fill: 'forwards' as const,
  },
})

const animateStackRows = (
  items: StackItem[],
  rowRefs: Array<HTMLDivElement | null>,
  valueRefs: Array<HTMLSpanElement | null>
) => {
  items.forEach((item, index) => {
    const rowElement = rowRefs[index]
    const valueElement = valueRefs[index]
    const offsetX = index % 2 === 0 ? -16 : 16

    if (rowElement) {
      const { keyframes, options } = enterAnimation(offsetX, index * 80)
      rowElement.animate(keyframes, options)
    }

    if (valueElement) {
      const targetColor = item.active ? 'var(--pf-anim-cyan)' : 'var(--pf-anim-gray-400)'
      valueElement.animate([{ color: 'var(--pf-anim-cyan)' }, { color: targetColor }], {
        duration: 400,
        delay: index * 80 + 200,
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        fill: 'forwards',
      })
    }
  })
}

const animateStackRowsOut = (rowRefs: Array<HTMLDivElement | null>) => {
  rowRefs.forEach((rowElement, index) => {
    if (!rowElement) return
    const offsetX = index % 2 === 0 ? -16 : 16
    const { keyframes, options } = exitAnimation(offsetX)
    rowElement.animate(keyframes, options)
  })
}

const useStackLoop = (
  items: StackItem[],
  rowRefs: MutableRefObject<Array<HTMLDivElement | null>>,
  valueRefs: MutableRefObject<Array<HTMLSpanElement | null>>
) => {
  useEffect(() => {
    const timeoutIds = new Set<TimeoutId>()
    let isMounted = true

    const scheduleTimeout = (callback: () => void, delayMs: number) => {
      const timeoutId = setTimeout(() => {
        timeoutIds.delete(timeoutId)
        callback()
      }, delayMs)
      timeoutIds.add(timeoutId)
      return timeoutId
    }

    const startAnimation = () => {
      if (!isMounted) return

      animateStackRows(items, rowRefs.current, valueRefs.current)
      scheduleTimeout(() => {
        if (!isMounted) return
        animateStackRowsOut(rowRefs.current)
        scheduleTimeout(startAnimation, 2000)
      }, 1500)
    }

    startAnimation()

    return () => {
      isMounted = false
      timeoutIds.forEach(clearTimeout)
      timeoutIds.clear()
    }
  }, [items, rowRefs, valueRefs])
}

/**
 *
 */
export function RealtimeDataStackedRealtime() {
  const rowRefs = useRef<Array<HTMLDivElement | null>>([])
  const valueRefs = useRef<Array<HTMLSpanElement | null>>([])
  const stackItems = useMemo(() => STACK_ITEMS, [])

  useStackLoop(stackItems, rowRefs, valueRefs)

  return (
    <div className="pf-realtime-data" data-animation-id="realtime-data__stacked-realtime">
      <div className="pf-realtime-data__stack">
        {stackItems.map((item, index) => (
          <div
            key={item.label}
            ref={(element) => {
              rowRefs.current[index] = element
            }}
            className={`pf-realtime-data__stack-row ${item.active ? 'active' : ''}`}
            style={{ opacity: 0, transform: `translateX(${index % 2 === 0 ? -16 : 16}px)` }}
          >
            <span className="pf-realtime-data__stack-label">{item.label}</span>
            <span
              ref={(element) => {
                valueRefs.current[index] = element
              }}
              className="pf-realtime-data__stack-value"
              style={{ color: 'var(--pf-anim-cyan)' }}
            >
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
