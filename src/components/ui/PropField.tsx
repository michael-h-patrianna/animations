import { Button } from '@/demo-ui/components/ui/Button'
import { ColorPicker } from '@/demo-ui/components/ui/ColorPicker'
import { Input } from '@/demo-ui/components/ui/Input'
import { Select } from '@/demo-ui/components/ui/Select'
import { Slider } from '@/demo-ui/components/ui/Slider'
import { Switch } from '@/demo-ui/components/ui/Switch'
import type { PropConfig, StyleObjectFieldConfig } from '@/types/animation'
import { assertNever } from '@/utils/assertNever'
import { resolveColorInputDefault } from '@/utils/colors'
import { memo, useCallback } from 'react'

function isStyleValueRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function normalizeColorDefault(value?: string): string {
  if (value == null) return ''
  const resolved = resolveColorInputDefault(value)
  return resolved !== '' ? resolved : value
}

function parseStyleNumberValue(value: unknown): number | undefined {
  if (typeof value === 'number' && !Number.isNaN(value)) {
    return value
  }

  if (typeof value === 'string') {
    const match = value.match(/[+-]?\d*\.?\d+/)
    if (match) {
      const parsed = Number(match[0])
      if (!Number.isNaN(parsed)) {
        return parsed
      }
    }
  }

  return undefined
}

function serializeStyleFieldValue(field: StyleObjectFieldConfig, value: unknown): string {
  switch (field.type) {
    case 'number':
      return typeof value === 'number' ? `${value}${field.unit ?? ''}` : ''
    case 'color':
    case 'string':
      return typeof value === 'string' ? value : ''
    default:
      return assertNever(field)
  }
}

function buildStyleObjectDefaultRecord(fields: StyleObjectFieldConfig[]): Record<string, unknown> {
  return Object.fromEntries(
    fields
      .map((field) => {
        switch (field.type) {
          case 'number':
            return [
              field.key,
              field.default != null ? `${field.default}${field.unit ?? ''}` : '',
            ] as const
          case 'color':
            return [field.key, normalizeColorDefault(field.default)] as const
          case 'string':
            return [field.key, field.default ?? ''] as const
          default:
            return assertNever(field)
        }
      })
      .filter(([, value]) => value !== '')
  )
}

// ── Disabled field ───────────────────────────────────────────────────────

function DisabledField({ config }: { config: PropConfig }) {
  return (
    <div className="flex flex-col gap-1" data-testid={`prop-field-${config.name}`}>
      <span className="text-xs font-medium text-text-secondary">{config.label}</span>
      <div className="px-3 py-2 text-xs text-text-tertiary bg-[var(--bg-surface)]/50 border border-[var(--border-subtle)] rounded-lg italic">
        {config.disabledReason ?? 'Not configurable interactively'}
      </div>
    </div>
  )
}

// ── Number field ─────────────────────────────────────────────────────────

function NumberField({
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

// ── String field ─────────────────────────────────────────────────────────

function StringField({
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

// ── Boolean field ────────────────────────────────────────────────────────

function BooleanField({
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

// ── Color field ──────────────────────────────────────────────────────────

function ColorField({
  config,
  value,
  onChange,
}: {
  config: PropConfig & { type: 'color' }
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div data-testid={`prop-field-${config.name}`}>
      <ColorPicker
        label={config.label}
        value={value !== '' ? value : '#000000'}
        onChange={onChange}
      />
    </div>
  )
}

// ── Select field ─────────────────────────────────────────────────────────

function SelectField({
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

// ── Image field ──────────────────────────────────────────────────────────

function ImageField({
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

// ── Images array field ───────────────────────────────────────────────────

function ImagesField({
  config,
  value,
  onChange,
}: {
  config: PropConfig & { type: 'images' }
  value: string[]
  onChange: (v: string[]) => void
}) {
  const addItem = useCallback(() => {
    if (config.maxItems != null && value.length >= config.maxItems) return
    onChange([...value, ''])
  }, [value, onChange, config.maxItems])

  const removeItem = useCallback(
    (index: number) => {
      onChange(value.filter((_, i) => i !== index))
    },
    [value, onChange]
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
          <div key={`img-${String(i)}`} className="flex items-center gap-1">
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

// ── Colors array field ───────────────────────────────────────────────────

function ColorsField({
  config,
  value,
  onChange,
}: {
  config: PropConfig & { type: 'colors' }
  value: string[]
  onChange: (v: string[]) => void
}) {
  const addItem = useCallback(() => {
    if (config.maxItems != null && value.length >= config.maxItems) return
    onChange([...value, '#ffffff'])
  }, [value, onChange, config.maxItems])

  const removeItem = useCallback(
    (index: number) => {
      onChange(value.filter((_, i) => i !== index))
    },
    [value, onChange]
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
          <div key={`color-${String(i)}`} className="flex items-center gap-1">
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

// ── Structured style object field ───────────────────────────────────────────

function StyleObjectField({
  config,
  value,
  onChange,
}: {
  config: PropConfig & { type: 'style-object' }
  value: Record<string, unknown>
  onChange: (v: Record<string, unknown>) => void
}) {
  const styleValue =
    isStyleValueRecord(value) && Object.keys(value).length > 0
      ? value
      : buildStyleObjectDefaultRecord(config.fields)

  const handleStyleFieldChange = useCallback(
    (field: StyleObjectFieldConfig, nextValue: unknown) => {
      onChange({
        ...styleValue,
        [field.key]: serializeStyleFieldValue(field, nextValue),
      })
    },
    [onChange, styleValue]
  )

  return (
    <div className="flex flex-col gap-3" data-testid={`prop-field-${config.name}`}>
      <span className="text-xs font-medium text-text-secondary">{config.label}</span>
      <div className="space-y-3">
        {config.fields.map((field) => {
          return (
            <div
              key={field.key}
              className="space-y-2"
              data-testid={`prop-field-style-${field.key}`}
            >
              {field.type === 'number' ? (
                <NumberField
                  config={{ ...field, name: field.key }}
                  value={parseStyleNumberValue(styleValue[field.key]) ?? field.default ?? 0}
                  onChange={(nextValue) => handleStyleFieldChange(field, nextValue)}
                />
              ) : field.type === 'color' ? (
                <ColorField
                  config={{ ...field, name: field.key }}
                  value={
                    typeof styleValue[field.key] === 'string'
                      ? (styleValue[field.key] as string)
                      : normalizeColorDefault(field.default)
                  }
                  onChange={(nextValue) => handleStyleFieldChange(field, nextValue)}
                />
              ) : (
                <StringField
                  config={{ ...field, name: field.key }}
                  value={
                    typeof styleValue[field.key] === 'string'
                      ? (styleValue[field.key] as string)
                      : (field.default ?? '')
                  }
                  onChange={(nextValue) => handleStyleFieldChange(field, nextValue)}
                />
              )}
              {field.description != null && field.description !== '' && (
                <p className="px-1 text-[11px] leading-relaxed text-text-tertiary">
                  {field.description}
                </p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Main PropField ───────────────────────────────────────────────────────

interface PropFieldProps {
  config: PropConfig
  value: unknown
  onChange: (name: string, value: unknown) => void
}

function PropFieldComponent({ config, value, onChange }: PropFieldProps) {
  if (config.disabled) {
    return <DisabledField config={config} />
  }

  const handleChange = (v: unknown) => onChange(config.name, v)

  switch (config.type) {
    case 'number':
      return (
        <NumberField
          config={config}
          value={typeof value === 'number' ? value : (config.default ?? 0)}
          onChange={handleChange as (v: number) => void}
        />
      )
    case 'string':
      return (
        <StringField
          config={config}
          value={typeof value === 'string' ? value : (config.default ?? '')}
          onChange={handleChange as (v: string) => void}
        />
      )
    case 'boolean':
      return (
        <BooleanField
          config={config}
          value={typeof value === 'boolean' ? value : (config.default ?? false)}
          onChange={handleChange as (v: boolean) => void}
        />
      )
    case 'color':
      return (
        <ColorField
          config={config}
          value={normalizeColorDefault(typeof value === 'string' ? value : config.default)}
          onChange={handleChange as (v: string) => void}
        />
      )
    case 'select':
      return (
        <SelectField
          config={config}
          value={
            typeof value === 'string' ? value : (config.default ?? config.options[0]?.value ?? '')
          }
          onChange={handleChange as (v: string) => void}
        />
      )
    case 'image':
      return (
        <ImageField
          config={config}
          value={typeof value === 'string' ? value : (config.default ?? '')}
          onChange={handleChange as (v: string) => void}
        />
      )
    case 'images':
      return (
        <ImagesField
          config={config}
          value={Array.isArray(value) ? (value as string[]) : (config.default ?? [])}
          onChange={handleChange as (v: string[]) => void}
        />
      )
    case 'colors': {
      const rawColors = Array.isArray(value) ? (value as string[]) : (config.default ?? [])
      const resolved = rawColors.map((c) => {
        const n = normalizeColorDefault(c)
        return n !== '' ? n : c
      })
      return (
        <ColorsField
          config={config}
          value={resolved}
          onChange={handleChange as (v: string[]) => void}
        />
      )
    }
    case 'style-object':
      return (
        <StyleObjectField
          config={config}
          value={isStyleValueRecord(value) ? value : buildStyleObjectDefaultRecord(config.fields)}
          onChange={handleChange as (v: Record<string, unknown>) => void}
        />
      )
    default:
      return assertNever(config)
  }
}

export const PropField = memo(PropFieldComponent)
