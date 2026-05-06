import { parseColorToHsv, type HSVA } from '@/demo-ui/lib/colors/colorUtils'
import { showToast } from '@/demo-ui/stores/toastStore'
import { logger } from '@/services/logger'

/**
 *
 */
export function computeSaturationValue(el: HTMLDivElement, clientX: number, clientY: number) {
  const rect = el.getBoundingClientRect()
  const s = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
  const v = 1 - Math.max(0, Math.min(1, (clientY - rect.top) / rect.height))
  return { s, v }
}

/**
 *
 */
export function pickEyedropper(onColor: (hsv: HSVA) => void): void {
  if (typeof window === 'undefined' || !('EyeDropper' in window)) return
  const dropper = new (
    window as unknown as { EyeDropper: new () => { open: () => Promise<{ sRGBHex: string }> } }
  ).EyeDropper()
  void dropper
    .open()
    .then((result) => onColor(parseColorToHsv(result.sRGBHex)))
    .catch(() => {})
}

/**
 *
 */
export function copyColor(value: string): void {
  void navigator.clipboard.writeText(value).then(
    () => showToast('Color copied to clipboard'),
    (err) => logger.warn('Clipboard write failed — browser may have denied access', err)
  )
}
