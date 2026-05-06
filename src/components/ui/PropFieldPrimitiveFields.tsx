import { ColorPicker } from '@/demo-ui/components/ui/ColorPicker'
import { ColorGradientPicker } from '@/demo-ui/components/ui/ColorGradientPicker'
import { Input } from '@/demo-ui/components/ui/Input'
import { Select } from '@/demo-ui/components/ui/Select'
import { Slider } from '@/demo-ui/components/ui/Slider'
import { Switch } from '@/demo-ui/components/ui/Switch'
import type { PropConfig } from '@/types/animation'
import type { ColorOrGradient } from '@/types/gradient'

/**
 *
 */
export function DisabledField({ config }: { config: PropConfig }) {
  return (
    <div className="flex flex-col gap-1" data-testid={`prop-field-${config.name}`}>
      <span className="text-xs font-medium text-text-secondary">{config.label}</span>
      <div className="px-3 py-2 text-xs text-text-tertiary bg-[var(--bg-surface)]/50 border border-[var(--border-subtle)] rounded-lg italic">
        {config.disabledReason ?? 'Not configurable interactively'}
      </div>
    </div>
  )
}

/**
 *
 */
export function NumberField({
  config,
  value,
  onChange,
}: {
  config: PropConfig & { type: 'number' }
  value: number
  onChange: (v: number) => void
}) {
  const hasRange = config.min !== undefined && config.max !== undefined

  if (hasRange) {
    return (
      <Slider
        value={value}
        onChange={onChange}
        min={config.min}
        max={config.max}
        step={config.step ?? 1}
        label={config.label}
        unit={config.unit}
        data-testid={`prop-field-${config.name}`}
      />
    )
  }

  return (
    <Input
      type="number"
      label={config.label}
      value={String(value)}
      onChange={(e) => {
        const n = Number(e.target.value)
        if (!Number.isNaN(n)) onChange(n)
      }}
      data-testid={`prop-field-${config.name}`}
    />
  )
}

/**
 *
 */
export function StringField({
  config,
  value,
  onChange,
}: {
  config: PropConfig & { type: 'string' }
  value: string
  onChange: (v: string) => void
}) {
  return (
    <Input
      label={config.label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      data-testid={`prop-field-${config.name}`}
    />
  )
}

/**
 *
 */
export function BooleanField({
  config,
  value,
  onChange,
}: {
  config: PropConfig & { type: 'boolean' }
  value: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <Switch
      label={config.label}
      checked={value}
      onCheckedChange={onChange}
      data-testid={`prop-field-${config.name}`}
    />
  )
}

/**
 *
 */
export function ColorField({
  config,
  value,
  onChange,
}: {
  config: PropConfig & { type: 'color' }
  value: ColorOrGradient
  onChange: (v: ColorOrGradient) => void
}) {
  if (config.allowGradient === true) {
    return (
      <div data-testid={`prop-field-${config.name}`}>
        <ColorGradientPicker label={config.label} value={value} onChange={onChange} />
      </div>
    )
  }
  const solidValue = typeof value === 'string' ? value : '#000000'
  return (
    <div data-testid={`prop-field-${config.name}`}>
      <ColorPicker
        label={config.label}
        value={solidValue !== '' ? solidValue : '#000000'}
        onChange={onChange as (v: string) => void}
      />
    </div>
  )
}

/**
 *
 */
export function SelectField({
  config,
  value,
  onChange,
}: {
  config: PropConfig & { type: 'select' }
  value: string
  onChange: (v: string) => void
}) {
  return (
    <Select
      label={config.label}
      options={config.options}
      value={value}
      onChange={onChange}
      data-testid={`prop-field-${config.name}`}
    />
  )
}

/**
 *
 */
export function ImageField({
  config,
  value,
  onChange,
}: {
  config: PropConfig & { type: 'image' }
  value: string
  onChange: (v: string) => void
}) {
  return (
    <Input
      label={config.label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="https://... or /images/..."
      data-testid={`prop-field-${config.name}`}
    />
  )
}
