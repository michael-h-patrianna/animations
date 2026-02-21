import type { CodeMode } from '@/contexts/CodeModeContext'
import type { Category, Group } from '@/types/animation'
import { useEffect, useMemo, useState, type FC, type ReactNode } from 'react'

interface AppSidebarProps {
  categories: Category[]
  codeMode: CodeMode
  currentGroupId: string
  onCategorySelect: (categoryId: string) => void
  onGroupSelect: (groupId: string) => void
  className?: string
  topContent?: ReactNode
}

interface GroupVariants {
  baseId: string
  label: string
  framer?: Group
  css?: Group
  fallback: Group
}

const GROUP_MODE_SUFFIX_PATTERN = /-(?:framer|css)$/
const GROUP_MODE_TITLE_SUFFIX_PATTERN = /\s+\((?:Framer|CSS)\)$/

const getBaseGroupId = (groupId: string) => groupId.replace(GROUP_MODE_SUFFIX_PATTERN, '')

const toDisplayGroupTitle = (title: string) => title.replace(GROUP_MODE_TITLE_SUFFIX_PATTERN, '')

const inferGroupTech = (group: Group): 'framer' | 'css' | undefined => {
  if (group.tech === 'framer' || group.id.endsWith('-framer')) return 'framer'
  if (group.tech === 'css' || group.id.endsWith('-css')) return 'css'
  return undefined
}

const buildGroupVariants = (groups: Group[]): GroupVariants[] => {
  const variantsByBaseId = new Map<string, GroupVariants>()

  groups.forEach((group) => {
    const baseId = getBaseGroupId(group.id)
    const existing = variantsByBaseId.get(baseId)

    if (!existing) {
      variantsByBaseId.set(baseId, {
        baseId,
        label: toDisplayGroupTitle(group.title),
        fallback: group,
      })
    }

    const entry = variantsByBaseId.get(baseId)
    if (!entry) return

    const tech = inferGroupTech(group)
    if (tech === 'framer' && !entry.framer) entry.framer = group
    if (tech === 'css' && !entry.css) entry.css = group
  })

  return [...variantsByBaseId.values()]
}

const pickGroupIdForMode = (variants: GroupVariants, codeMode: CodeMode): string => {
  if (codeMode === 'CSS') {
    return variants.css?.id ?? variants.framer?.id ?? variants.fallback.id
  }

  return variants.framer?.id ?? variants.css?.id ?? variants.fallback.id
}

/**
 * Navigation sidebar component displaying hierarchical category and group structure.
 *
 * Renders a collapsible accordion-style navigation with categories as top-level items
 * and their associated groups as nested subitems. Highlights the currently active
 * group and its parent category.
 *
 * @component
 * @param {AppSidebarProps} props - Component props
 * @param {Category[]} props.categories - Array of animation categories with nested groups
 * @param {string} props.currentGroupId - ID of the currently selected group for highlighting
 * @param {(categoryId: string) => void} props.onCategorySelect - Reserved callback for category selection compatibility
 * @param {(groupId: string) => void} props.onGroupSelect - Callback when group item clicked
 * @param {string} [props.className] - Optional CSS class name for custom styling
 *
 * @returns {JSX.Element} Sidebar navigation component
 *
 * @example
 * ```tsx
 * <AppSidebar
 *   categories={animationCategories}
 *   currentGroupId="button-effects"
 *   onCategorySelect={(id) => console.log('Category:', id)}
 *   onGroupSelect={(id) => navigateToGroup(id)}
 *   className="custom-sidebar"
 * />
 * ```
 *
 * @remarks
 * - Categories show active state when any of their groups is selected
 * - Category sections are independently expandable/collapsible and start expanded
 * - Groups show active state when they match currentGroupId
 * - Categories without groups only display the category header
 * - Uses BEM naming convention for CSS classes (pf-sidebar)
 */
export const AppSidebar: FC<AppSidebarProps> = ({
  categories,
  codeMode,
  currentGroupId,
  onCategorySelect: _onCategorySelect,
  onGroupSelect,
  className,
  topContent,
}) => {
  const currentBaseGroupId = getBaseGroupId(currentGroupId)
  const categoryGroups = useMemo(
    () =>
      categories.map((category) => ({
        category,
        groupVariants: buildGroupVariants(category.groups),
      })),
    [categories]
  )
  const [expandedCategoryIds, setExpandedCategoryIds] = useState<Set<string>>(
    () => new Set(categories.map((category) => category.id))
  )

  useEffect(() => {
    setExpandedCategoryIds((previous) => {
      const next = new Set(previous)
      const categoryIds = new Set(categories.map((category) => category.id))
      let changed = false

      categoryIds.forEach((id) => {
        if (!next.has(id)) {
          next.add(id)
          changed = true
        }
      })

      previous.forEach((id) => {
        if (!categoryIds.has(id)) {
          next.delete(id)
          changed = true
        }
      })

      return changed ? next : previous
    })
  }, [categories])

  const toggleCategoryExpanded = (categoryId: string) => {
    setExpandedCategoryIds((previous) => {
      const next = new Set(previous)
      if (next.has(categoryId)) next.delete(categoryId)
      else next.add(categoryId)
      return next
    })
  }

  return (
    <aside className={`pf-sidebar${className ? ` ${className}` : ''}`}>
      {topContent && <div className="pf-sidebar__intro">{topContent}</div>}
      <div className="pf-sidebar__nav">
        {categoryGroups.map(({ category, groupVariants }) => {
          // Check if any group in this category is currently active
          const hasActiveGroup = groupVariants.some((group) => group.baseId === currentBaseGroupId)
          const isExpanded = expandedCategoryIds.has(category.id)

          return (
            <div key={category.id} className="pf-sidebar__section">
              <button
                type="button"
                onClick={() => toggleCategoryExpanded(category.id)}
                aria-expanded={isExpanded}
                className={`pf-sidebar__link pf-sidebar__link--category ${
                  hasActiveGroup ? 'pf-sidebar__link--active' : ''
                }`}
              >
                {category.title}
              </button>

              {isExpanded && groupVariants.length > 0 && (
                <div className="pf-sidebar__subnav">
                  {groupVariants.map((group) => {
                    const isActiveGroup = group.baseId === currentBaseGroupId

                    return (
                      <button
                        type="button"
                        key={group.baseId}
                        onClick={() => onGroupSelect(pickGroupIdForMode(group, codeMode))}
                        className={`pf-sidebar__link pf-sidebar__link--group ${
                          isActiveGroup ? 'pf-sidebar__link--active' : ''
                        }`}
                      >
                        {group.label}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </aside>
  )
}
