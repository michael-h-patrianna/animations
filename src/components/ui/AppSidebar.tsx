import type { CodeMode } from '@/contexts/CodeModeContext'
import { ControlGroup } from '@/demo-ui/components/ui/ControlGroup'
import type { Category, Group } from '@/types/animation'
import { useMemo, type FC, type ReactNode } from 'react'

/** Props for the AppSidebar component. */
interface AppSidebarProps {
  categories: Category[]
  codeMode: CodeMode
  currentGroupId: string
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
    let entry = variantsByBaseId.get(baseId)

    if (!entry) {
      entry = {
        baseId,
        label: toDisplayGroupTitle(group.title),
        fallback: group,
      }
      variantsByBaseId.set(baseId, entry)
    }

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

/** Single navigation link for a group within a category. */
function GroupNavLink({
  group,
  isActive,
  codeMode,
  onSelect,
}: {
  group: GroupVariants
  isActive: boolean
  codeMode: CodeMode
  onSelect: (groupId: string) => void
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(pickGroupIdForMode(group, codeMode))}
      className={`pf-sidebar__nav-link ${isActive ? 'pf-sidebar__nav-link--active' : ''}`}
      data-testid={`sidebar-group-${group.baseId}`}
      data-active={isActive || undefined}
    >
      <span className="pf-sidebar__nav-link-label">{group.label}</span>
    </button>
  )
}

/** Desktop sidebar with category/group navigation and code mode switching. */
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
    () =>
      categories.map((category) => ({
        category,
        groupVariants: buildGroupVariants(category.groups),
      })),
    [categories]
  )

  return (
    <aside
      className={`pf-sidebar${className != null ? ` ${className}` : ''}`}
      data-testid="sidebar"
    >
      {topContent != null && <div className="pf-sidebar__intro">{topContent}</div>}
      <div className="pf-sidebar__nav">
        {categoryGroups.map(({ category, groupVariants }) => (
          <ControlGroup
            key={category.id}
            title={category.title}
            collapsible
            defaultOpen
            data-testid={`sidebar-section-${category.id}`}
          >
            <nav className="pf-sidebar__group-list" data-testid={`sidebar-subnav-${category.id}`}>
              {groupVariants.map((group) => (
                <GroupNavLink
                  key={group.baseId}
                  group={group}
                  isActive={group.baseId === currentBaseGroupId}
                  codeMode={codeMode}
                  onSelect={onGroupSelect}
                />
              ))}
            </nav>
          </ControlGroup>
        ))}
      </div>
    </aside>
  )
}
