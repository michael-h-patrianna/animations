/**
 * EditorLeftPanel Component
 * Left panel with code mode toggle and category/group navigation.
 * Follows chain-offer-mock panel pattern: header → controls → scrollable content.
 */

import type React from 'react'
import { useMemo } from 'react'
import { type CodeMode, useCodeMode } from '@/contexts/CodeModeContext'
import { useAnimations } from '@/hooks/useAnimations'
import { useAppNavigation } from '@/hooks/useAppNavigation'
import { ControlGroup } from '@/demo-ui/components/ui/ControlGroup'
import { ToggleGroup, type ToggleOption } from '@/demo-ui/components/ui/ToggleGroup'
import type { Group } from '@/types/animation'

const CODE_MODE_OPTIONS: ToggleOption<CodeMode>[] = [
  { value: 'Framer', label: 'Framer' },
  { value: 'CSS', label: 'CSS' },
]

const GROUP_MODE_SUFFIX = /-(?:framer|css)$/
const GROUP_TITLE_SUFFIX = /\s+\((?:Framer|CSS)\)$/

interface GroupVariants {
  baseId: string
  label: string
  framer?: Group
  css?: Group
  fallback: Group
}

function buildGroupVariants(groups: Group[]): GroupVariants[] {
  const map = new Map<string, GroupVariants>()

  for (const group of groups) {
    const baseId = group.id.replace(GROUP_MODE_SUFFIX, '')
    let entry = map.get(baseId)

    if (!entry) {
      entry = {
        baseId,
        label: group.title.replace(GROUP_TITLE_SUFFIX, ''),
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

function pickGroupId(variants: GroupVariants, mode: CodeMode): string {
  if (mode === 'CSS') {
    return variants.css?.id ?? variants.framer?.id ?? variants.fallback.id
  }
  return variants.framer?.id ?? variants.css?.id ?? variants.fallback.id
}

export const EditorLeftPanel: React.FC = () => {
  const { categories } = useAnimations()
  const { codeMode, setCodeMode } = useCodeMode()
  const { currentGroupId, handleGroupSelect, handleModeSelect } = useAppNavigation(categories)
  const currentBaseGroupId = currentGroupId.replace(GROUP_MODE_SUFFIX, '')

  const categoryGroups = useMemo(
    () =>
      categories.map((cat) => ({
        category: cat,
        variants: buildGroupVariants(cat.groups),
      })),
    [categories]
  )

  const handleCodeModeChange = (mode: CodeMode) => {
    setCodeMode(mode)
    handleModeSelect(mode)
  }

  return (
    <div className="h-full flex flex-col w-full shrink-0 overflow-hidden">
      {/* Panel header */}
      <div className="p-4 border-b border-[var(--border-subtle)] bg-[var(--bg-panel)] backdrop-blur-sm z-10 shrink-0">
        <h2 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest">
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

      {/* Scrollable category/group navigation */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[var(--border-default)] hover:scrollbar-thumb-[var(--border-highlight)] px-4 pb-4">
        {categoryGroups.map(({ category, variants }) => (
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
                return (
                  <button
                    key={group.baseId}
                    type="button"
                    onClick={() => handleGroupSelect(pickGroupId(group, codeMode))}
                    className={`text-left w-full px-2 py-1.5 text-xs rounded-md transition-colors duration-150 ${
                      isActive
                        ? 'bg-accent/15 text-accent font-medium'
                        : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]'
                    }`}
                    data-testid={`sidebar-group-${group.baseId}`}
                    data-active={isActive || undefined}
                  >
                    {group.label}
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
