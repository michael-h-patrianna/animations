/**
 * Vite plugin that builds a title index from animation `.meta.ts` files at
 * dev-server start / production build — replacing 171 eager runtime imports
 * with a single pre-computed virtual module.
 *
 * Virtual module ID: `virtual:animation-title-index`
 * Exports: `{ groupTitles: Record<baseGroupId, { id: string; title: string }[]> }`
 */

import { readFileSync, readdirSync } from 'node:fs'
import { join, relative, sep } from 'node:path'
import type { Plugin } from 'vite'

const VIRTUAL_ID = 'virtual:animation-title-index'
const RESOLVED_ID = `\0${VIRTUAL_ID}`

const ID_RE = /^\s+id:\s*'([^']+)'/m
const TITLE_RE = /^\s+title:\s*'([^']+)'/m

interface TitleEntry {
  id: string
  title: string
}

/** Recursively collects all `framer/*.meta.ts` files under `root`. */
function collectMetaFiles(root: string): string[] {
  const results: string[] = []
  const walk = (dir: string) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name)
      if (entry.isDirectory()) {
        walk(full)
      } else if (
        entry.isFile() &&
        entry.name.endsWith('.meta.ts') &&
        relative(root, dir).split(sep).includes('framer')
      ) {
        results.push(full)
      }
    }
  }
  walk(root)
  return results
}

/** Extracts `id` and `title` from a `.meta.ts` file via regex. */
function extractMeta(filePath: string): TitleEntry | null {
  const content = readFileSync(filePath, 'utf-8')
  const idMatch = ID_RE.exec(content)
  const titleMatch = TITLE_RE.exec(content)
  if (!idMatch || !titleMatch) return null
  return { id: idMatch[1], title: titleMatch[1] }
}

function buildIndex(componentsDir: string): Record<string, TitleEntry[]> {
  const files = collectMetaFiles(componentsDir)
  const index: Record<string, TitleEntry[]> = {}

  for (const file of files) {
    const entry = extractMeta(file)
    if (!entry) continue
    const sepIdx = entry.id.indexOf('__')
    if (sepIdx === -1) continue
    const groupId = entry.id.slice(0, sepIdx)
    ;(index[groupId] ??= []).push(entry)
  }

  return index
}

/** Vite plugin that serves a virtual animation title index built from `.meta.ts` files at startup. */
export function animationTitleIndexPlugin(): Plugin {
  let componentsDir: string

  return {
    name: 'animation-title-index',

    configResolved(config) {
      componentsDir = join(config.root, 'src/components')
    },

    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED_ID
    },

    load(id) {
      if (id !== RESOLVED_ID) return
      const index = buildIndex(componentsDir)
      return `export const groupTitles = ${JSON.stringify(index)};`
    },

    handleHotUpdate({ file, server }) {
      if (file.endsWith('.meta.ts') && file.includes(`${sep}framer${sep}`)) {
        const mod = server.moduleGraph.getModuleById(RESOLVED_ID)
        if (mod) {
          server.moduleGraph.invalidateModule(mod)
          return [mod]
        }
      }
    },
  }
}
