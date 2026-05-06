/**
 * EditorRightPanel Component - Animation Catalog Inspector
 * Shared properties editor for the currently selected animation card.
 */

import { Button } from '@/demo-ui/components/ui/Button'
import { ControlGroup } from '@/demo-ui/components/ui/ControlGroup'
import type React from 'react'
import { useCallback } from 'react'
import { groupAdjacentProps } from '@/demo-ui/components/layout/editorRightPanelGrouping'
import { useInspectorPanel } from '@/demo-ui/components/layout/useInspectorPanel'
import {
  CountBadge,
  EmptyState,
  GeneralSection,
  InspectorField,
  ProfilerToggle,
  PropRunField,
} from '@/demo-ui/components/layout/EditorRightPanelSections'

export const EditorRightPanel: React.FC = () => {
  const {
    selectedAnimation,
    propOverrides,
    editableProps,
    codeOnlyProps,
    isDirty,
    handlePropChange,
    handleReset,
    handleReplay,
    getAnimateMode,
    setAnimateMode,
  } = useInspectorPanel()

  const handleAnimateToggle = useCallback(
    (propName: string) => (mode: 'fixed' | 'animate') => {
      if (selectedAnimation == null) return
      setAnimateMode(selectedAnimation.id, propName, mode)
    },
    [selectedAnimation, setAnimateMode]
  )

  return (
    <div className="h-full flex flex-col w-full shrink-0 overflow-hidden">
      <div className="p-4 border-b border-panel-border bg-panel-header/30 z-10 shrink-0 flex items-center justify-between gap-2">
        <h2 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest">
          Inspector
        </h2>
        <ProfilerToggle />
      </div>

      {selectedAnimation == null ? (
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin scrollbar-thumb-[var(--border-default)] hover:scrollbar-thumb-[var(--border-highlight)]">
          <GeneralSection />
          <EmptyState />
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin scrollbar-thumb-[var(--border-default)] hover:scrollbar-thumb-[var(--border-highlight)]">
          <GeneralSection />
          <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]/35 p-4 space-y-3">
            <div className="space-y-1">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-text-tertiary">
                Selected Animation
              </p>
              <h3 className="text-sm font-semibold text-text-primary">{selectedAnimation.title}</h3>
              <p className="text-xs leading-relaxed text-text-secondary">
                {selectedAnimation.description}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="primary" size="sm" onClick={handleReplay}>
                Replay
              </Button>
              {isDirty && (
                <Button variant="secondary" size="sm" onClick={handleReset}>
                  Reset
                </Button>
              )}
            </div>
          </div>

          <ControlGroup
            title="Properties"
            rightElement={<CountBadge count={editableProps.length} />}
            data-testid="inspector-editable-props"
          >
            {editableProps.length > 0 ? (
              <div className="space-y-3">
                {groupAdjacentProps(editableProps).map((run) => (
                  <PropRunField
                    key={run[0]?.group ?? run[0]?.name ?? ''}
                    run={run}
                    animationId={selectedAnimation.id}
                    propOverrides={propOverrides}
                    getAnimateMode={getAnimateMode}
                    onAnimateToggle={handleAnimateToggle}
                    onChange={handlePropChange}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-[var(--border-subtle)] bg-[var(--bg-surface)]/20 px-3 py-4">
                <p className="text-xs text-text-tertiary">
                  This animation has no configurable properties yet.
                </p>
              </div>
            )}
          </ControlGroup>

          {codeOnlyProps.length > 0 && (
            <ControlGroup
              title="Code-Only Props"
              collapsible
              defaultOpen={false}
              rightElement={<CountBadge count={codeOnlyProps.length} />}
              data-testid="inspector-disabled-props"
            >
              <div className="space-y-3">
                {codeOnlyProps.map((config) => (
                  <InspectorField
                    key={config.name}
                    config={config}
                    value={undefined}
                    onChange={handlePropChange}
                  />
                ))}
              </div>
            </ControlGroup>
          )}
        </div>
      )}
    </div>
  )
}
