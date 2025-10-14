import { categories } from '@/components/animationRegistry'
import { AnimationCard } from '@/components/ui/AnimationCard'
import type { Group } from '@/types/animation'
import React, { Suspense, useMemo } from 'react'

interface GroupSectionProps {
  group: Group
  elementId: string
}

/**
 * Helper function to determine if an animation should run infinitely.
 *
 * Applies infinite loop behavior to loading states and specific realtime/indicator
 * animations that represent continuous activity.
 *
 * @param {string} groupId - The group identifier (e.g., 'loading-states-framer')
 * @param {string} animationId - The animation identifier (e.g., 'timer-effects__timer-pulse')
 * @returns {boolean} True if animation should loop infinitely
 *
 * @example
 * ```tsx
 * isInfiniteAnimation('loading-states-framer', 'spinner') // true
 * isInfiniteAnimation('button-effects', 'click-ripple') // false
 * ```
 */
function isInfiniteAnimation(groupId: string, animationId: string): boolean {
  // All loading states should be infinite
  if (groupId === 'loading-states-framer' || groupId === 'loading-states-css') return true

  // Specific animations that should loop infinitely
  const infiniteAnimations = [
    // Timer effects that should continuously pulse/glow
    'timer-effects__timer-pulse',
    'timer-effects__timer-glow',
    'timer-effects__timer-breathe',

    // Update indicators that should continuously show activity
    'update-indicators__live-ping',
    'update-indicators__badge-pulse',
    'update-indicators__notification-dot',

    // Realtime data animations
    'realtime-data__live-score-update',
    'realtime-data__currency-update',
    'realtime-data__win-ticker',
  ]

  return infiniteAnimations.includes(animationId)
}

/**
 * Section component displaying a group of related animations in a card grid layout.
 *
 * Dynamically loads animation components from the registry based on the group ID,
 * automatically detecting whether to render Framer Motion or CSS implementations.
 * Supports infinite animations, lights controls, and lazy loading with Suspense.
 *
 * @component
 * @param {GroupSectionProps} props - Component props
 * @param {Group} props.group - Group metadata containing animations, title, and ID
 * @param {string} props.elementId - HTML ID for scroll-to-section navigation
 *
 * @returns {JSX.Element} Group section with header and animation card grid
 *
 * @example
 * ```tsx
 * <GroupSection
 *   group={{
 *     id: 'button-effects-framer',
 *     title: 'Button Effects',
 *     animations: [{ id: 'click-ripple', title: 'Click Ripple', ... }]
 *   }}
 *   elementId="button-effects"
 * />
 * ```
 *
 * @remarks
 * - Automatically detects Framer vs CSS groups via ID suffix (-framer/-css)
 * - Builds animation registry from animationRegistry exports
 * - Applies infinite loop behavior via isInfiniteAnimation() helper
 * - Passes bulbCount/onColor props only to lights animations
 * - Uses Suspense boundaries for lazy-loaded animation components
 * - Shows "Animations coming soon" for empty groups
 */
export function GroupSection({ group, elementId }: GroupSectionProps) {
  // Determine if this is a CSS group based on the group ID suffix
  const isCssGroup = group.id.endsWith('-css')

  // Extract the base group ID (without -framer or -css suffix)
  const baseGroupId = group.id.replace(/-(?:framer|css)$/, '')

  // Build a registry for this specific group by looking up components from categories
  const animationRegistry = useMemo(() => {
    const registry: Record<string, React.ComponentType<Record<string, unknown>>> = {}

    // Find the category and group in the categories export
    for (const category of Object.values(categories)) {
      const groupExport = category.groups[baseGroupId]
      if (groupExport) {
        // Get components from the correct source (framer or css)
        const animationSource = isCssGroup ? groupExport.css : groupExport.framer
        Object.entries(animationSource).forEach(([id, anim]) => {
          registry[id] = anim.component
        })
        break
      }
    }

    return registry
  }, [baseGroupId, isCssGroup])
  return (
    <article id={elementId} className="pf-group">
      <header className="pf-group__header">
        <div>
          <h2 className="pf-group__title">
            {group.title} ({group.animations.length})
          </h2>
        </div>
      </header>

      {group.animations.length > 0 ? (
        <div className="pf-card-grid">
          {group.animations.map((animation) => {
            const AnimationComponent = animationRegistry[animation.id]
            const infiniteAnimation = isInfiniteAnimation(group.id, animation.id)
            const isLightsAnimation = animation.id.startsWith('lights__')

            return (
              <AnimationCard
                key={animation.id}
                title={animation.title}
                description={animation.description}
                animationId={animation.id}
                tags={animation.tags}
                infiniteAnimation={infiniteAnimation}
                disableReplay={animation.disableReplay}
              >
                {({ bulbCount, onColor }) => (
                  AnimationComponent ? (
                    <Suspense fallback={<div className="pf-card__placeholder">Loading…</div>}>
                      <AnimationComponent {...(isLightsAnimation ? { numBulbs: bulbCount, onColor } : {})} />
                    </Suspense>
                  ) : (
                    <div className="pf-card__placeholder">{animation.id}</div>
                  )
                )}
              </AnimationCard>
            )
          })}
        </div>
      ) : (
        <div className="pf-group__empty">Animations coming soon</div>
      )}
    </article>
  )
}
