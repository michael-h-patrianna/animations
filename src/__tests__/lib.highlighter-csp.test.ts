import { describe, expect, it } from 'vitest'
import { highlightCode } from '@/lib/highlighter'

describe('highlightCode CSP output', () => {
  it('renders Shiki token spans without inline style attributes', async () => {
    const html = await highlightCode('const x = <div>Hello</div>', 'tsx')

    expect(html).toContain('<pre')
    expect(html).toContain('<span')
    expect(html).toContain('code-modal__shiki')
    expect(html).toContain('shiki-fg-')
    expect(html).not.toMatch(/\sstyle=/)
  })
})
