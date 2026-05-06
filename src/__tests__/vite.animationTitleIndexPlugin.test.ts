import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { describe, expect, it } from 'vitest'

interface TitleEntry {
  id: string
  title: string
}

interface AnimationTitleIndexPluginModule {
  parseAnimationTitleMetadata: (sourceText: string, filePath?: string) => TitleEntry
}

async function loadParser(): Promise<
  AnimationTitleIndexPluginModule['parseAnimationTitleMetadata']
> {
  const moduleUrl = pathToFileURL(
    resolve(process.cwd(), 'vite/plugins/animationTitleIndexPlugin.ts')
  ).href
  const mod = (await import(moduleUrl)) as AnimationTitleIndexPluginModule
  return mod.parseAnimationTitleMetadata
}

describe('animationTitleIndexPlugin metadata parser', () => {
  it('extracts id and title from satisfies metadata with mixed quote styles', async () => {
    const parseAnimationTitleMetadata = await loadParser()
    const source = `
      import type { AnimationMetadata } from '@/types/animation'

      export const metadata = {
        id: "modal-base__scale-gentle-pop",
        title: 'Scale Gentle Pop',
        description: 'Gentle modal scale.',
      } satisfies AnimationMetadata
    `

    expect(parseAnimationTitleMetadata(source, 'ModalBaseScaleGentlePop.meta.ts')).toEqual({
      id: 'modal-base__scale-gentle-pop',
      title: 'Scale Gentle Pop',
    })
  })

  it('extracts id and title from plain exported metadata objects', async () => {
    const parseAnimationTitleMetadata = await loadParser()
    const source = `
      export const metadata = {
        id: 'button-effects__press',
        title: "Press",
      }
    `

    expect(parseAnimationTitleMetadata(source)).toEqual({
      id: 'button-effects__press',
      title: 'Press',
    })
  })

  it('fails visibly when id or title is missing', async () => {
    const parseAnimationTitleMetadata = await loadParser()
    const source = `
      export const metadata = {
        id: 'loading-states__pulse',
      } satisfies AnimationMetadata
    `

    expect(() => parseAnimationTitleMetadata(source, 'Broken.meta.ts')).toThrow(
      'Invalid animation metadata in Broken.meta.ts: missing string literal title'
    )
  })

  it('fails visibly when metadata is not an exported object', async () => {
    const parseAnimationTitleMetadata = await loadParser()
    expect(() => parseAnimationTitleMetadata('const metadata = {}', 'Hidden.meta.ts')).toThrow(
      'Invalid animation metadata in Hidden.meta.ts: expected exported metadata object'
    )
  })
})
