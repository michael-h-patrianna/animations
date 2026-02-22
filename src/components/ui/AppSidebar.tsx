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

function useCategoryExpansion(categories: Category[]) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    () => new Set(categories.map((c) => c.id))
  )

  useEffect(() => {
    setExpandedIds((previous) => {
      const next = new Set(previous)
      const ids = new Set(categories.map((c) => c.id))
      let changed = false

      ids.forEach((id) => {
        if (!next.has(id)) { next.add(id); changed = true }
      })
      previous.forEach((id) => {
        if (!ids.has(id)) { next.delete(id); changed = true }
      })

      return changed ? next : previous
    })
  }, [categories])

  const toggle = (categoryId: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(categoryId)) next.delete(categoryId)
      else next.add(categoryId)
      return next
    })
  }

  return { expandedIds, toggle }
}

function CategorySection({
  category,
  groupVariants,
  isExpanded,
  hasActiveGroup,
  currentBaseGroupId,
  codeMode,
  onToggle,
  onGroupSelect,
}: {
  category: Category
  groupVariants: GroupVariants[]
  isExpanded: boolean
  hasActiveGroup: boolean
  currentBaseGroupId: string
  codeMode: CodeMode
  onToggle: () => void
  onGroupSelect: (groupId: string) => void
}) {
  return (
    <div className="pf-sidebar__section">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isExpanded}
        className={`pf-sidebar__link pf-sidebar__link--category ${hasActiveGroup ? 'pf-sidebar__link--active' : ''}`}
      >
        {category.title}
      </button>

      {isExpanded && groupVariants.length > 0 && (
        <div className="pf-sidebar__subnav">
          {groupVariants.map((group) => (
            <button
              type="button"
              key={group.baseId}
              onClick={() => onGroupSelect(pickGroupIdForMode(group, codeMode))}
              className={`pf-sidebar__link pf-sidebar__link--group ${group.baseId === currentBaseGroupId ? 'pf-sidebar__link--active' : ''}`}
            >
              {group.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/**
 *
 */
export const AppSidebar: FC<AppSidebarProps> = ({
  categories,
  codeMode,
  currentGroupId,
  onGroupSelect,
  className,
  topContent,
}) => {
  const currentBaseGroupId = getBaseGroupId(currentGroupId)
  const categoryGroups = useMemo(
    () => categories.map((category) => ({ category, groupVariants: buildGroupVariants(category.groups) })),
    [categories]
  )
  const { expandedIds, toggle } = useCategoryExpansion(categories)

  return (
    <aside className={`pf-sidebar${className ? ` ${className}` : ''}`}>
      {topContent && <div className="pf-sidebar__intro">{topContent}</div>}
      <div className="pf-sidebar__nav">
        {categoryGroups.map(({ category, groupVariants }) => (
          <CategorySection
            key={category.id}
            category={category}
            groupVariants={groupVariants}
            isExpanded={expandedIds.has(category.id)}
            hasActiveGroup={groupVariants.some((g) => g.baseId === currentBaseGroupId)}
            currentBaseGroupId={currentBaseGroupId}
            codeMode={codeMode}
            onToggle={() => toggle(category.id)}
            onGroupSelect={onGroupSelect}
          />
        ))}
      </div>
    </aside>
  )
}
