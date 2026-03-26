/**
 * EditorLeftPanel Component
 * Left panel with code mode toggle and category/group navigation.
 * Follows chain-offer-mock panel pattern: header → controls → scrollable content.
 */

import type React from 'react'
import { useDeferredValue, useMemo, useState } from 'react'
import { type CodeMode, useCodeMode } from '@/contexts/CodeModeContext'
import { useAppNavigation } from '@/contexts/AppNavigationContext'
import { ControlGroup } from '@/demo-ui/components/ui/ControlGroup'
import { Input } from '@/demo-ui/components/ui/Input'
import { ToggleGroup, type ToggleOption } from '@/demo-ui/components/ui/ToggleGroup'
import type { LazyCategory, LazyGroup } from '@/types/lazy'

const CODE_MODE_OPTIONS: ToggleOption<CodeMode>[] = [
  { value: 'Framer', label: 'Framer' },
  { value: 'CSS', label: 'CSS' },
]

const GROUP_MODE_SUFFIX = /-(?:framer|css)$/

interface GroupVariants {
  baseId: string
  framer?: LazyGroup
  css?: LazyGroup
  fallback: LazyGroup
}

function buildGroupVariants(groups: LazyGroup[]): GroupVariants[] {
  const map = new Map<string, GroupVariants>()

  for (const group of groups) {
    const baseId = group.id.replace(GROUP_MODE_SUFFIX, '')
    let entry = map.get(baseId)

    if (!entry) {
      entry = {
        baseId,
        fallback: group,
      }
      map.set(baseId, entry)
    }

    const tech =
      group.tech === 'framer' || group.id.endsWith('-framer')
        ? 'framer'
        : group.tech === 'css' || group.id.endsWith('-css')
          ? 'css'
          : undefined

    if (tech === 'framer' && !entry.framer) entry.framer = group
    if (tech === 'css' && !entry.css) entry.css = group
  }

  return [...map.values()]
}

function pickGroup(variants: GroupVariants, mode: CodeMode): LazyGroup {
  if (mode === 'CSS') {
    return variants.css ?? variants.framer ?? variants.fallback
  }
  return variants.framer ?? variants.css ?? variants.fallback
}

function pickGroupId(variants: GroupVariants, mode: CodeMode): string {
  return pickGroup(variants, mode).id
}

/** Filters category groups by a case-insensitive search query against group titles. */
function filterCategoryGroups(
  categoryGroups: Array<{ category: LazyCategory; variants: GroupVariants[] }>,
  query: string
): Array<{ category: LazyCategory; variants: GroupVariants[] }> {
  if (query === '') return categoryGroups
  const lower = query.toLowerCase()
  return categoryGroups
    .map(({ category, variants }) => ({
      category,
      variants: variants.filter((v) => v.fallback.metadata.title.toLowerCase().includes(lower)),
    }))
    .filter(({ variants }) => variants.length > 0)
}

export const EditorLeftPanel: React.FC = () => {
  const { codeMode, setCodeMode } = useCodeMode()
  const { navCategories, currentGroupId, handleGroupSelect, handleModeSelect } = useAppNavigation()
  const currentBaseGroupId = currentGroupId.replace(GROUP_MODE_SUFFIX, '')

  // Search state: input value is immediate, deferred value drives the filtered list.
  // This keeps the input responsive while React batches the list re-render.
  const [searchQuery, setSearchQuery] = useState('')
  const deferredQuery = useDeferredValue(searchQuery)
  const isStale = searchQuery !== deferredQuery

  const categoryGroups = useMemo(
    () =>
      navCategories.map((cat: LazyCategory) => ({
        category: cat,
        variants: buildGroupVariants(cat.groups),
      })),
    [navCategories]
  )

  const filteredGroups = useMemo(
    () => filterCategoryGroups(categoryGroups, deferredQuery),
    [categoryGroups, deferredQuery]
  )

  const handleCodeModeChange = (mode: CodeMode) => {
    setCodeMode(mode)
    handleModeSelect(mode)
  }

  return (
    <div className="h-full flex flex-col w-full shrink-0 overflow-hidden">
      {/* Panel header */}
      <div className="p-4 border-b border-panel-border bg-panel-header/30 z-10 shrink-0">
        <h2 className="text-xs font-bold text-(--text-secondary) uppercase tracking-widest">
          Categories
        </h2>
      </div>

      {/* Code mode toggle */}
      <div className="px-4 pt-3 pb-2 shrink-0">
        <ToggleGroup
          options={CODE_MODE_OPTIONS}
          value={codeMode}
          onChange={handleCodeModeChange}
          ariaLabel="Code mode"
          data-testid="code-mode-switch"
        />
      </div>

      {/* Search */}
      <div className="px-4 pt-1 pb-2 shrink-0">
        <Input
          placeholder="Search animations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          clearable={searchQuery.length > 0}
          onClear={() => setSearchQuery('')}
          data-testid="sidebar-search"
          aria-label="Search animations"
        />
      </div>

      {/* Scrollable category/group navigation */}
      <div
        className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[var(--border-default)] hover:scrollbar-thumb-[var(--border-highlight)] px-4 pb-4 transition-opacity duration-150"
        style={{ opacity: isStale ? 0.6 : 1 }}
      >
        {filteredGroups.length === 0 && deferredQuery !== '' && (
          <p className="text-xs text-(--text-secondary) text-center py-6">
            No animations matching &ldquo;{deferredQuery}&rdquo;
          </p>
        )}
        {filteredGroups.map(({ category, variants }) => (
          <ControlGroup
            key={category.id}
            title={category.title}
            collapsible
            defaultOpen
            data-testid={`sidebar-section-${category.id}`}
          >
            <nav className="flex flex-col gap-0.5" data-testid={`sidebar-subnav-${category.id}`}>
              {variants.map((group) => {
                const isActive = group.baseId === currentBaseGroupId
                const selectedGroup = pickGroup(group, codeMode)
                return (
                  <button
                    key={group.baseId}
                    type="button"
                    onClick={() => handleGroupSelect(pickGroupId(group, codeMode))}
                    className={`pf-nav-item text-left w-full py-1.5 text-sm rounded-md cursor-pointer transition-all duration-200 ${
                      isActive
                        ? 'pf-nav-item--active bg-accent/10 text-accent font-semibold'
                        : 'text-(--text-secondary) hover:bg-(--bg-hover) hover:text-(--text-primary)'
                    }`}
                    data-testid={`sidebar-group-${group.baseId}`}
                    data-active={isActive || undefined}
                  >
                    {selectedGroup.metadata.title}
                  </button>
                )
              })}
            </nav>
          </ControlGroup>
        ))}
      </div>
    </div>
  )
}
