import { useCallback } from 'react'
import type { PropConfig, StyleObjectFieldConfig } from '@/types/animation'
import {
  buildStyleObjectDefaultRecord,
  isStyleValueRecord,
  normalizeColorDefault,
  parseStyleNumberValue,
  serializeStyleFieldValue,
} from '@/components/ui/propFieldUtils'
import { ColorField, NumberField, StringField } from '@/components/ui/PropFieldPrimitiveFields'

/**
 *
 */
export function StyleObjectField({
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
