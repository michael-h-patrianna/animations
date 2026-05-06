import ts from 'typescript'

/**
 * Extracts static import and re-export module specifiers from TypeScript source.
 *
 * @param source - Raw TypeScript or TSX source.
 * @returns Deduplicated module specifier strings.
 */
export function extractStaticModuleSpecifiers(source: string): string[] {
  const sourceFile = ts.createSourceFile(
    'component.tsx',
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX
  )
  const specifiers = new Set<string>()

  sourceFile.forEachChild((node) => {
    if (
      (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
      node.moduleSpecifier &&
      ts.isStringLiteralLike(node.moduleSpecifier)
    ) {
      specifiers.add(node.moduleSpecifier.text)
    }
  })

  return [...specifiers]
}
