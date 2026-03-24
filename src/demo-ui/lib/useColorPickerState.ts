import { useState, useEffect, useCallback } from 'react'
import {
  parseColorToHsv,
  hsvToHex,
  hsvToHex8,
  hsvToRgb,
  generatePalette,
  type HSVA,
  type RGBA,
} from '@/demo-ui/lib/colors/colorUtils'

const HISTORY_KEY = 'mdimension_color_history'
const MAX_HISTORY = 8

/** Options for the useColorPickerState hook. */
export interface UseColorPickerStateOptions {
  value: string
  onChange: (value: string) => void
  alpha?: number
  onChangeAlpha?: (alpha: number) => void
  disableAlpha: boolean
}

/** Return type for useColorPickerState. */
export interface ColorPickerState {
  hsv: HSVA
  mode: 'HEX' | 'RGB'
  setMode: (mode: 'HEX' | 'RGB') => void
  history: string[]
  addToHistory: (color: string) => void
  hexInput: string
  setHexInput: (v: string) => void
  rgbInput: RGBA
  setRgbInput: (v: RGBA) => void
  handleHsvChange: (hsv: HSVA) => void
  palette: string[]
}

/**
 * Core state management for the ColorPicker.
 * Handles HSV state, color format sync, history persistence, and external change propagation.
 */
export function useColorPickerState(opts: UseColorPickerStateOptions): ColorPickerState {
  const [hsv, setHsv] = useState<HSVA>({ h: 0, s: 0, v: 0, a: 1 })
  const [mode, setMode] = useState<'HEX' | 'RGB'>('HEX')
  const [history, setHistory] = useState<string[]>([])
  const [hexInput, setHexInput] = useState(opts.value)
  const [rgbInput, setRgbInput] = useState<RGBA>({ r: 0, g: 0, b: 0, a: 1 })

  useEffect(() => {
    try {
      const stored = localStorage.getItem(HISTORY_KEY)
      if (stored) setHistory(JSON.parse(stored) as string[])
    } catch {
      // localStorage unavailable — history starts empty
    }
  }, [])

  const addToHistory = (color: string) => {
    setHistory((prev) => {
      const filtered = prev.filter((c) => c !== color)
      const next = [color, ...filtered].slice(0, MAX_HISTORY)
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(next))
      } catch {
        // localStorage unavailable
      }
      return next
    })
  }

  useEffect(() => {
    const newHsv = parseColorToHsv(opts.value)
    if (opts.disableAlpha) {
      newHsv.a = 1
    } else if (opts.alpha !== undefined) {
      newHsv.a = opts.alpha
    }
    setHsv(newHsv)
    setHexInput(
      newHsv.a === 1
        ? hsvToHex(newHsv.h, newHsv.s, newHsv.v)
        : hsvToHex8(newHsv.h, newHsv.s, newHsv.v, newHsv.a)
    )
    setRgbInput(hsvToRgb(newHsv.h, newHsv.s, newHsv.v, newHsv.a))
  }, [opts.value, opts.alpha, opts.disableAlpha])

  const {
    onChange: onChangeProp,
    onChangeAlpha: onChangeAlphaProp,
    disableAlpha: disableAlphaProp,
  } = opts

  const updateExternal = useCallback(
    (newHsv: HSVA) => {
      const h = { ...newHsv }
      if (disableAlphaProp) h.a = 1
      if (onChangeAlphaProp) {
        onChangeAlphaProp(h.a)
        onChangeProp(hsvToHex(h.h, h.s, h.v))
      } else {
        onChangeProp(h.a === 1 ? hsvToHex(h.h, h.s, h.v) : hsvToHex8(h.h, h.s, h.v, h.a))
      }
    },
    [onChangeProp, onChangeAlphaProp, disableAlphaProp]
  )

  const handleHsvChange = useCallback(
    (newHsv: HSVA) => {
      setHsv(newHsv)
      updateExternal(newHsv)
      const displayHex =
        newHsv.a === 1
          ? hsvToHex(newHsv.h, newHsv.s, newHsv.v)
          : hsvToHex8(newHsv.h, newHsv.s, newHsv.v, newHsv.a)
      setHexInput(displayHex)
      setRgbInput(hsvToRgb(newHsv.h, newHsv.s, newHsv.v, newHsv.a))
    },
    [updateExternal]
  )

  const palette = generatePalette(hsv.h, hsv.s, hsv.v)

  return {
    hsv,
    mode,
    setMode,
    history,
    addToHistory,
    hexInput,
    setHexInput,
    rgbInput,
    setRgbInput,
    handleHsvChange,
    palette,
  }
}
