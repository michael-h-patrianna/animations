import { describe, it, expect } from 'vitest'
import { validateAnimationMetadata } from '@/lib/metadataSchema'

const validMeta = {
  id: 'group__variant',
  title: 'Test Animation',
  description: 'A test animation for validation',
  tier: 2,
}

describe('validateAnimationMetadata', () => {
  it('accepts valid metadata with all required fields', () => {
    const violations = validateAnimationMetadata(validMeta, 'test.meta.ts')
    expect(violations).toEqual([])
  })

  it('accepts valid metadata with all optional fields', () => {
    const full = {
      ...validMeta,
      disableReplay: true,
      infinite: false,
      controls: 'lights',
      prizeCountMax: 4,
      previewPosition: 'top-left',
      urlSlugFramer: '/test-framer?animation=group__variant',
      urlSlugCss: '/test-css?animation=group__variant',
      tier: 3,
      demoMode: 'burst',
      previewMaxWidth: 400,
      order: 1,
    }
    const violations = validateAnimationMetadata(full, 'test.meta.ts')
    expect(violations).toEqual([])
  })

  it('rejects tier values outside 1-4 range', () => {
    const violations = validateAnimationMetadata({ ...validMeta, tier: 5 }, 'test.meta.ts')
    expect(violations.join('\n')).toContain('.meta.ts')
    expect(violations[0]).toContain('tier')
  })

  it('rejects tier value of 0', () => {
    const violations = validateAnimationMetadata({ ...validMeta, tier: 0 }, 'test.meta.ts')
    expect(violations.join('\n')).toContain('.meta.ts')
  })

  it('rejects non-integer tier values', () => {
    const violations = validateAnimationMetadata({ ...validMeta, tier: 1.5 }, 'test.meta.ts')
    expect(violations.join('\n')).toContain('.meta.ts')
  })

  it('rejects invalid demoMode values', () => {
    const violations = validateAnimationMetadata(
      { ...validMeta, demoMode: 'invalid-mode' },
      'test.meta.ts'
    )
    expect(violations.join('\n')).toContain('.meta.ts')
    expect(violations[0]).toContain('demoMode')
  })

  it('rejects empty id', () => {
    const violations = validateAnimationMetadata({ ...validMeta, id: '' }, 'test.meta.ts')
    expect(violations.join('\n')).toContain('.meta.ts')
    expect(violations[0]).toContain('id')
  })

  it('rejects empty title', () => {
    const violations = validateAnimationMetadata({ ...validMeta, title: '' }, 'test.meta.ts')
    expect(violations.join('\n')).toContain('.meta.ts')
  })

  it('rejects missing required fields', () => {
    const violations = validateAnimationMetadata({}, 'test.meta.ts')
    // At minimum id, title, description are required — each produces a violation
    expect(violations.join('\n')).toContain('id')
    expect(violations.join('\n')).toContain('title')
    expect(violations.join('\n')).toContain('description')
  })

  it('includes the source path in violation messages', () => {
    const violations = validateAnimationMetadata(
      { ...validMeta, tier: 99 },
      'framer/BadAnim.meta.ts'
    )
    expect(violations[0]).toContain('framer/BadAnim.meta.ts')
  })

  it('accepts all valid demoMode values', () => {
    const modes = ['burst', 'magnet', 'trail', 'fountain', 'icon-dot', 'status-row']
    for (const mode of modes) {
      const violations = validateAnimationMetadata({ ...validMeta, demoMode: mode }, 'test.meta.ts')
      expect(violations).toEqual([])
    }
  })

  it('accepts all valid previewPosition values', () => {
    const positions = [
      'center',
      'top-left',
      'top-right',
      'bottom-left',
      'bottom-right',
      'top-center',
      'bottom-center',
    ]
    for (const pos of positions) {
      const violations = validateAnimationMetadata(
        { ...validMeta, previewPosition: pos },
        'test.meta.ts'
      )
      expect(violations).toEqual([])
    }
  })
})

describe('validateAnimationMetadata — props field', () => {
  const base = {
    id: 'group__variant',
    title: 'Test',
    description: 'Desc',
    tier: 1,
  }

  it('accepts all 9 PropConfig variant types', () => {
    const props = [
      { type: 'number', name: 'duration', label: 'Duration', default: 400 },
      { type: 'string', name: 'text', label: 'Text', default: 'hello' },
      { type: 'boolean', name: 'visible', label: 'Visible', default: true },
      { type: 'color', name: 'color', label: 'Color', default: '#ff0000' },
      {
        type: 'select',
        name: 'ease',
        label: 'Ease',
        options: [{ label: 'Linear', value: 'linear' }],
      },
      { type: 'image', name: 'src', label: 'Image', default: '/img.png' },
      { type: 'images', name: 'imgs', label: 'Images', default: ['/a.png'], maxItems: 5 },
      { type: 'colors', name: 'palette', label: 'Palette', default: ['#ff0000'], maxItems: 3 },
      {
        type: 'style-object',
        name: 'style',
        label: 'Style',
        fields: [
          { type: 'number', key: '--gap', label: 'Gap', default: 8, unit: 'px' },
          { type: 'string', key: '--font', label: 'Font', default: 'sans-serif' },
          { type: 'color', key: '--bg', label: 'BG', default: '#000' },
        ],
      },
    ]
    const violations = validateAnimationMetadata({ ...base, props }, 'test.meta.ts')
    expect(violations).toEqual([])
  })

  it('accepts number prop with animatable fields', () => {
    const props = [
      {
        type: 'number',
        name: 'progress',
        label: 'Progress',
        min: 0,
        max: 100,
        step: 1,
        unit: '%',
        animatable: true,
        animateDefault: 'animate',
        animateDuration: 4000,
        animatePause: 1200,
        animateStyle: 'linear',
      },
    ]
    const violations = validateAnimationMetadata({ ...base, props }, 'test.meta.ts')
    expect(violations).toEqual([])
  })

  it('accepts props with disabled and group fields', () => {
    const props = [
      {
        type: 'string',
        name: 'children',
        label: 'Children',
        disabled: true,
        disabledReason: 'Pass via JSX',
        group: 'content',
      },
    ]
    const violations = validateAnimationMetadata({ ...base, props }, 'test.meta.ts')
    expect(violations).toEqual([])
  })

  it('rejects prop with invalid type discriminant', () => {
    const props = [{ type: 'invalid', name: 'x', label: 'X' }]
    const violations = validateAnimationMetadata({ ...base, props }, 'test.meta.ts')
    expect(violations.join('\n')).toContain('props')
  })

  it('rejects prop missing required name field', () => {
    const props = [{ type: 'number', label: 'Duration' }]
    const violations = validateAnimationMetadata({ ...base, props }, 'test.meta.ts')
    expect(violations.join('\n')).toContain('name')
  })

  it('rejects select prop missing options array', () => {
    const props = [{ type: 'select', name: 'ease', label: 'Ease' }]
    const violations = validateAnimationMetadata({ ...base, props }, 'test.meta.ts')
    expect(violations.join('\n')).toContain('options')
  })

  it('rejects style-object prop with invalid field type', () => {
    const props = [
      {
        type: 'style-object',
        name: 'style',
        label: 'Style',
        fields: [{ type: 'invalid', key: '--x', label: 'X' }],
      },
    ]
    const violations = validateAnimationMetadata({ ...base, props }, 'test.meta.ts')
    expect(violations.join('\n')).toContain('fields')
  })

  it('rejects number prop with invalid animateStyle value', () => {
    const props = [
      { type: 'number', name: 'x', label: 'X', animatable: true, animateStyle: 'bounce' },
    ]
    const violations = validateAnimationMetadata({ ...base, props }, 'test.meta.ts')
    expect(violations.join('\n')).toContain('animateStyle')
  })
})
