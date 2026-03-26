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
