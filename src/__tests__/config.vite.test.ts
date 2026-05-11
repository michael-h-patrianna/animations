import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { describe, expect, it } from 'vitest'
import type { ConfigEnv, UserConfig, UserConfigExport } from 'vite'

interface ViteConfigModule {
  default: UserConfigExport
}

async function loadViteConfig(): Promise<UserConfigExport> {
  const moduleUrl = pathToFileURL(resolve(process.cwd(), 'vite.config.ts')).href
  const mod = (await import(moduleUrl)) as ViteConfigModule
  return mod.default
}

async function resolveViteConfig(mode: string): Promise<UserConfig> {
  const viteConfig = await loadViteConfig()
  const env: ConfigEnv = {
    command: 'build',
    mode,
    isSsrBuild: false,
    isPreview: false,
  }
  const resolved = typeof viteConfig === 'function' ? await viteConfig(env) : await viteConfig

  if (Array.isArray(resolved)) {
    throw new Error('Expected a single Vite config object')
  }
  return resolved
}

function getAliasRecord(config: UserConfig): Record<string, string> {
  const alias = config.resolve?.alias
  if (!alias || Array.isArray(alias)) {
    throw new Error('Expected object-form Vite aliases')
  }
  return alias as Record<string, string>
}

describe('vite config', () => {
  it('includes path alias without profiling in production mode', async () => {
    const config = await resolveViteConfig('production')
    const alias = getAliasRecord(config)

    expect(alias).toMatchObject({ '@': '/src' })
    expect(Object.keys(alias)).toEqual(['@'])
  })

  it('includes profiling alias in profile mode', async () => {
    const config = await resolveViteConfig('profile')
    const alias = getAliasRecord(config)

    expect(alias).toMatchObject({
      '@': '/src',
      'react-dom/client': 'react-dom/profiling',
    })
  })
})
