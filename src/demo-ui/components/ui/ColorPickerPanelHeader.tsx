import type { CSSProperties } from 'react'
import { m as MotionEl } from 'motion/react'
import { CHECKERBOARD, ICON_PROPS } from '@/demo-ui/components/ui/colorPickerPanelConstants'

/** Before/after color swatch with eyedropper and clipboard actions. */
export function PanelHeader({
  initialColor,
  value,
  onEyedropper,
  onCopy,
}: {
  initialColor: string
  value: string
  onEyedropper: () => void
  onCopy: () => void
}) {
  const swatchVars = {
    '--swatch-checker': `url(${CHECKERBOARD})`,
    '--swatch-initial': initialColor,
    '--swatch-current': value,
  } as CSSProperties

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-2 bg-[var(--bg-hover)] rounded-full p-0.5 border border-border-subtle">
        <div
          className="relative w-12 h-6 rounded-full overflow-hidden flex cursor-help"
          title="Original vs New"
          style={swatchVars}
        >
          <div className="absolute inset-0 -z-10 bg-[image:var(--swatch-checker)] opacity-40" />
          <div className="w-1/2 h-full bg-[var(--swatch-initial)]" />
          <div className="w-1/2 h-full bg-[var(--swatch-current)]" />
        </div>
      </div>
      <div className="flex items-center gap-1">
        {typeof window !== 'undefined' && 'EyeDropper' in window && (
          <MotionEl.button
            data-testid="color-picker-eyedropper"
            onClick={onEyedropper}
            className="p-1.5 rounded hover:bg-[var(--bg-hover)] text-text-tertiary hover:text-text-primary transition-colors"
            title="Pick color"
          >
            <svg {...ICON_PROPS}>
              <path d="M2 22l5-5 5-5 5 5-5 5-5-5z" />
              <path d="M17 7l-5 5" />
              <path d="M14 2l8 8" />
            </svg>
          </MotionEl.button>
        )}
        <MotionEl.button
          data-testid="color-picker-copy"
          onClick={onCopy}
          className="p-1.5 rounded hover:bg-[var(--bg-hover)] text-text-tertiary hover:text-text-primary transition-colors"
          title="Copy to clipboard"
        >
          <svg {...ICON_PROPS}>
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
        </MotionEl.button>
      </div>
    </div>
  )
}
