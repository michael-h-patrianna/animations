import { memo } from 'react'
import type { PropConfig } from '@/types/animation'
import type { ColorOrGradient } from '@/types/gradient'
import { assertNever } from '@/utils/assertNever'
import {
  BooleanField,
  ColorField,
  ColorsField,
  DisabledField,
  ImageField,
  ImagesField,
  NumberField,
  SelectField,
  StringField,
  StyleObjectField,
} from '@/components/ui/PropFieldFields'
import {
  buildStyleObjectDefaultRecord,
  isStyleValueRecord,
  normalizeColorOrGradient,
  resolveColorArray,
} from '@/components/ui/propFieldUtils'
import {
  coerceBoolean,
  coerceNumber,
  coerceSelectValue,
  coerceString,
  coerceStringArray,
  isDisabledByCondition,
} from '@/components/ui/propFieldValue'

interface PropFieldProps {
  config: PropConfig
  value: unknown
  onChange: (name: string, value: unknown) => void
  /** All current prop values - used to evaluate disabledWhen conditions. */
  allValues?: Record<string, unknown>
}

function PropFieldComponent({ config, value, onChange, allValues }: PropFieldProps) {
  if (config.disabled || isDisabledByCondition(config, allValues)) {
    return <DisabledField config={config} />
  }

  const handleChange = (v: unknown) => onChange(config.name, v)

  switch (config.type) {
    case 'number':
      return (
        <NumberField
          config={config}
          value={coerceNumber(value, config.default ?? 0)}
          onChange={handleChange as (v: number) => void}
        />
      )
    case 'string':
      return (
        <StringField
          config={config}
          value={coerceString(value, config.default ?? '')}
          onChange={handleChange as (v: string) => void}
        />
      )
    case 'boolean':
      return (
        <BooleanField
          config={config}
          value={coerceBoolean(value, config.default ?? false)}
          onChange={handleChange as (v: boolean) => void}
        />
      )
    case 'color':
      return (
        <ColorField
          config={config}
          value={normalizeColorOrGradient(value, config.default)}
          onChange={handleChange as (v: ColorOrGradient) => void}
        />
      )
    case 'select':
      return (
        <SelectField
          config={config}
          value={coerceSelectValue(value, config)}
          onChange={handleChange as (v: string) => void}
        />
      )
    case 'image':
      return (
        <ImageField
          config={config}
          value={coerceString(value, config.default ?? '')}
          onChange={handleChange as (v: string) => void}
        />
      )
    case 'images':
      return (
        <ImagesField
          config={config}
          value={coerceStringArray(value, config.default ?? [])}
          onChange={handleChange as (v: string[]) => void}
        />
      )
    case 'colors':
      return (
        <ColorsField
          config={config}
          value={resolveColorArray(coerceStringArray(value, config.default ?? []))}
          onChange={handleChange as (v: string[]) => void}
        />
      )
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
