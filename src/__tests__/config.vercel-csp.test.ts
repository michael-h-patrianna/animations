import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

interface Header {
  key: string
  value: string
}

interface HeaderRule {
  headers: Header[]
  source: string
}

interface VercelConfig {
  headers: HeaderRule[]
}

function readVercelConfig(): VercelConfig {
  return JSON.parse(readFileSync(resolve(process.cwd(), 'vercel.json'), 'utf-8')) as VercelConfig
}

function getContentSecurityPolicy(config: VercelConfig): string {
  const headers = config.headers.flatMap((rule) => rule.headers)
  const csp = headers.find((header) => header.key === 'Content-Security-Policy')
  if (!csp) throw new Error('Missing Content-Security-Policy header')
  return csp.value
}

describe('vercel CSP config', () => {
  it('does not allow unsafe-inline styles', () => {
    const policy = getContentSecurityPolicy(readVercelConfig())

    expect(policy).toContain("style-src 'self'")
    expect(policy).not.toContain("'unsafe-inline'")
  })
})
