import { ColorPickerPanel } from '@/demo-ui/components/ui/ColorPickerPanel'

/**
 *
 */
export function StopColorPanel({
  index,
  color,
  onChange,
  onClose,
}: {
  index: number
  color: string
  onChange: (c: string) => void
  onClose: () => void
}) {
  return (
    <div className="border-l border-border-subtle" data-testid="gradient-stop-color-panel">
      <div className="flex items-center justify-between px-3 pt-2">
        <span className="text-xs text-text-tertiary font-medium">Stop {index + 1}</span>
        <button
          onClick={onClose}
          className="text-text-tertiary hover:text-text-primary text-xs p-0.5 transition-colors"
          aria-label="Close stop color editor"
        >
          ×
        </button>
      </div>
      <ColorPickerPanel
        value={color}
        onChange={onChange}
        disableAlpha
        showHeader={false}
        showPalette={false}
        width={220}
      />
    </div>
  )
}
