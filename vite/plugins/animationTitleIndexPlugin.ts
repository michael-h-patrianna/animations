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
import * as ts from 'typescript'
import type { Plugin } from 'vite'

const VIRTUAL_ID = 'virtual:animation-title-index'
const RESOLVED_ID = `\0${VIRTUAL_ID}`

/** Minimal metadata shape needed by the title-index virtual module. */
export interface TitleEntry {
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

function unwrapExpression(expression: ts.Expression): ts.Expression {
  if (
    ts.isSatisfiesExpression(expression) ||
    ts.isAsExpression(expression) ||
    ts.isParenthesizedExpression(expression)
  ) {
    return unwrapExpression(expression.expression)
  }
  return expression
}

function propertyNameText(name: ts.PropertyName): string | null {
  if (ts.isIdentifier(name) || ts.isStringLiteral(name) || ts.isNumericLiteral(name)) {
    return name.text
  }
  return null
}

function stringLiteralValue(expression: ts.Expression): string | null {
  if (ts.isStringLiteral(expression) || ts.isNoSubstitutionTemplateLiteral(expression)) {
    return expression.text
  }
  return null
}

function isExportedVariableStatement(statement: ts.Statement): statement is ts.VariableStatement {
  return (
    ts.isVariableStatement(statement) &&
    statement.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword) === true
  )
}

function findMetadataDeclaration(statement: ts.VariableStatement): ts.VariableDeclaration | null {
  for (const declaration of statement.declarationList.declarations) {
    if (ts.isIdentifier(declaration.name) && declaration.name.text === 'metadata')
      return declaration
  }
  return null
}

function objectLiteralFromDeclaration(
  declaration: ts.VariableDeclaration
): ts.ObjectLiteralExpression | null {
  if (!declaration.initializer) return null
  const initializer = unwrapExpression(declaration.initializer)
  return ts.isObjectLiteralExpression(initializer) ? initializer : null
}

function findMetadataObject(sourceFile: ts.SourceFile): ts.ObjectLiteralExpression | null {
  for (const statement of sourceFile.statements) {
    if (!isExportedVariableStatement(statement)) continue
    const declaration = findMetadataDeclaration(statement)
    if (declaration) return objectLiteralFromDeclaration(declaration)
  }
  return null
}

function readMetadataStringProperty(
  objectLiteral: ts.ObjectLiteralExpression,
  propertyName: 'id' | 'title'
): string | null {
  for (const property of objectLiteral.properties) {
    if (!ts.isPropertyAssignment(property)) continue
    if (propertyNameText(property.name) !== propertyName) continue
    return stringLiteralValue(unwrapExpression(property.initializer))
  }
  return null
}

/**
 * Extracts the title-index fields from a `.meta.ts` module.
 *
 * Exported for focused tests because malformed metadata should fail at build
 * time instead of silently dropping animations from the generated index.
 */
export function parseAnimationTitleMetadata(sourceText: string, filePath = '<inline>'): TitleEntry {
  const sourceFile = ts.createSourceFile(
    filePath,
    sourceText,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS
  )
  const metadataObject = findMetadataObject(sourceFile)
  if (!metadataObject) {
    throw new Error(`Invalid animation metadata in ${filePath}: expected exported metadata object`)
  }

  const id = readMetadataStringProperty(metadataObject, 'id')
  const title = readMetadataStringProperty(metadataObject, 'title')
  if (id === null || title === null) {
    const missingFields = [id === null ? 'id' : null, title === null ? 'title' : null].filter(
      (field): field is string => field !== null
    )
    throw new Error(
      `Invalid animation metadata in ${filePath}: missing string literal ${missingFields.join(', ')}`
    )
  }

  return { id, title }
}

/** Extracts `id` and `title` from a `.meta.ts` file. */
function extractMeta(filePath: string): TitleEntry {
  const content = readFileSync(filePath, 'utf-8')
  return parseAnimationTitleMetadata(content, filePath)
}

function buildIndex(componentsDir: string): Record<string, TitleEntry[]> {
  const files = collectMetaFiles(componentsDir)
  const index: Record<string, TitleEntry[]> = {}

  for (const file of files) {
    const entry = extractMeta(file)
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
