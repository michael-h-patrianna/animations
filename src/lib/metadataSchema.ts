/**
 * Runtime validation schemas for animation metadata.
 *
 * These schemas mirror the TypeScript interfaces in `@/types/animation.ts` and
 * are used for dev-mode validation at the groupBuilder boundary. They catch
 * metadata typos (e.g., `tier: 5`, `demoMode: 'invalid'`) that compile-time
 * `satisfies` cannot detect when values are dynamically constructed.
 *
 * Valibot was chosen over Zod for its minimal bundle size (~5KB vs ~57KB).
 * Validation runs only in dev mode — production builds tree-shake this entirely.
 */

import * as v from 'valibot'

/** Schema for the `tier` field: must be 1, 2, 3, or 4. */
const TierSchema = v.optional(v.pipe(v.number(), v.minValue(1), v.maxValue(4), v.integer()))

/** Schema for the `demoMode` field: must be one of the known demo modes. */
const DemoModeSchema = v.optional(
  v.picklist(['burst', 'magnet', 'trail', 'fountain', 'icon-dot', 'status-row'])
)

/** Schema for the `controls` field. */
const ControlsSchema = v.optional(v.picklist(['lights', 'prizeCount']))

/** Schema for the `previewPosition` field. */
const PreviewPositionSchema = v.optional(
  v.picklist([
    'center',
    'top-left',
    'top-right',
    'bottom-left',
    'bottom-right',
    'top-center',
    'bottom-center',
  ])
)

/**
 * Runtime validation schema for AnimationMetadata.
 * Validates the structure and value constraints of metadata exported by `.meta.ts` files.
 */
export const AnimationMetadataSchema = v.object({
  id: v.pipe(v.string(), v.minLength(1)),
  title: v.pipe(v.string(), v.minLength(1)),
  description: v.pipe(v.string(), v.minLength(1)),
  disableReplay: v.optional(v.boolean()),
  infinite: v.optional(v.boolean()),
  controls: ControlsSchema,
  prizeCountMax: v.optional(v.number()),
  previewPosition: PreviewPositionSchema,
  urlSlugFramer: v.optional(v.string()),
  urlSlugCss: v.optional(v.string()),
  tier: TierSchema,
  demoMode: DemoModeSchema,
  previewMaxWidth: v.optional(v.number()),
  order: v.optional(v.number()),
  props: v.optional(v.array(v.any())),
})

/**
 * Validates animation metadata at runtime (dev-mode only).
 * Returns an array of human-readable violation messages, or an empty array if valid.
 */
export function validateAnimationMetadata(
  meta: unknown,
  sourcePath: string
): string[] {
  const result = v.safeParse(AnimationMetadataSchema, meta)
  if (result.success) return []

  return result.issues.map((issue) => {
    const path = issue.path?.map((p) => p.key).join('.') ?? 'root'
    return `${sourcePath}: ${path} — ${issue.message}`
  })
}
