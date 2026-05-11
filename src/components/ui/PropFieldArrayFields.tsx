import { useCallback, useRef } from 'react'
import { Button } from '@/demo-ui/components/ui/Button'
import { ColorPicker } from '@/demo-ui/components/ui/ColorPicker'
import { Input } from '@/demo-ui/components/ui/Input'
import type { PropConfig } from '@/types/animation'

let nextStableId = 0
function newKey(): string {
  return `sk-${String(nextStableId++)}`
}

function useStableKeys(length: number) {
  const keysRef = useRef<string[]>([])
  while (keysRef.current.length < length) keysRef.current.push(newKey())
  if (keysRef.current.length > length) keysRef.current.length = length
  const removeKey = useCallback((index: number) => {
    keysRef.current.splice(index, 1)
  }, [])
  return { keys: keysRef.current, removeKey }
}

/**
 *
 */
export function ImagesField({
  config,
  value,
  onChange,
}: {
  config: PropConfig & { type: 'images' }
  value: string[]
  onChange: (v: string[]) => void
}) {
  const { keys, removeKey } = useStableKeys(value.length)

  const addItem = useCallback(() => {
    if (config.maxItems != null && value.length >= config.maxItems) return
    onChange([...value, ''])
  }, [value, onChange, config.maxItems])

  const removeItem = useCallback(
    (index: number) => {
      removeKey(index)
      onChange(value.filter((_, i) => i !== index))
    },
    [value, onChange, removeKey]
  )

  const updateItem = useCallback(
    (index: number, newValue: string) => {
      const next = [...value]
      next[index] = newValue
      onChange(next)
    },
    [value, onChange]
  )

  return (
    <div className="flex flex-col gap-1.5" data-testid={`prop-field-${config.name}`}>
      <label className="text-xs font-medium text-text-secondary">{config.label}</label>
      <div className="flex flex-col gap-1">
        {value.map((item, i) => (
          <div key={keys[i]} className="flex items-center gap-1">
            <Input
              value={item}
              onChange={(e) => updateItem(i, e.target.value)}
              placeholder="Image URL"
              className="!h-7 !py-0 !text-xs"
              containerClassName="flex-1"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeItem(i)}
              ariaLabel={`Remove image ${i + 1}`}
              className="!w-7 !h-7 !p-0 text-text-tertiary hover:text-danger shrink-0"
            >
              ×
            </Button>
          </div>
        ))}
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={addItem}
        disabled={config.maxItems !== undefined && value.length >= config.maxItems}
        className="self-start !text-xs !px-1 !py-0.5 !h-auto text-accent"
      >
        + Add image
      </Button>
    </div>
  )
}

/**
 *
 */
export function ColorsField({
  config,
  value,
  onChange,
}: {
  config: PropConfig & { type: 'colors' }
  value: string[]
  onChange: (v: string[]) => void
}) {
  const { keys, removeKey } = useStableKeys(value.length)

  const addItem = useCallback(() => {
    if (config.maxItems != null && value.length >= config.maxItems) return
    // eslint-disable-next-line animation-rules/no-hardcoded-colors -- default white for new color stop
    onChange([...value, '#ffffff'])
  }, [value, onChange, config.maxItems])

  const removeItem = useCallback(
    (index: number) => {
      removeKey(index)
      onChange(value.filter((_, i) => i !== index))
    },
    [value, onChange, removeKey]
  )

  const updateItem = useCallback(
    (index: number, newValue: string) => {
      const next = [...value]
      next[index] = newValue
      onChange(next)
    },
    [value, onChange]
  )

  return (
    <div className="flex flex-col gap-1.5" data-testid={`prop-field-${config.name}`}>
      <label className="text-xs font-medium text-text-secondary">{config.label}</label>
      <div className="flex flex-wrap gap-1.5">
        {value.map((color, i) => (
          <div key={keys[i]} className="flex items-center gap-1">
            <ColorPicker value={color} onChange={(v) => updateItem(i, v)} />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeItem(i)}
              ariaLabel={`Remove color ${i + 1}`}
              className="!w-5 !h-5 !p-0 text-[10px] text-text-tertiary hover:text-danger"
            >
              ×
            </Button>
          </div>
        ))}
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={addItem}
        disabled={config.maxItems !== undefined && value.length >= config.maxItems}
        className="self-start !text-xs !px-1 !py-0.5 !h-auto text-accent"
      >
        + Add color
      </Button>
    </div>
  )
}
