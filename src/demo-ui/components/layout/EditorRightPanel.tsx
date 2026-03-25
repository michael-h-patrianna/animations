/**
 * EditorRightPanel Component - Animation Catalog Inspector
 * Shared properties editor for the currently selected animation card.
 */

import { PropField } from '@/components/ui/PropField'
import { hasDirtyPropOverrides, useAnimationInspector } from '@/contexts/AnimationInspectorContext'
import { Button } from '@/demo-ui/components/ui/Button'
import { ControlGroup } from '@/demo-ui/components/ui/ControlGroup'
import type { PropConfig } from '@/types/animation'
import type React from 'react'
import { useMemo } from 'react'

function CountBadge({ count }: { count: number }) {
  return (
    <span className="inline-flex min-w-5 items-center justify-center rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)]/60 px-1.5 py-0.5 text-[10px] font-semibold text-text-tertiary">
      {count}
    </span>
  )
}

function EmptyState() {
  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="w-full rounded-2xl border border-dashed border-[var(--border-subtle)] bg-[var(--bg-surface)]/35 px-4 py-10 text-center">
        <p className="text-sm font-medium text-text-secondary">Select an animation</p>
      </div>
    </div>
  )
}

function InspectorField({
  config,
  value,
  onChange,
}: {
  config: PropConfig
  value: unknown
  onChange: (name: string, value: unknown) => void
}) {
  return (
    <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]/35 p-3">
      <PropField config={config} value={value} onChange={onChange} />
      {config.description != null && config.description !== '' && (
        <p className="mt-2 px-1 text-[11px] leading-relaxed text-text-tertiary">
          {config.description}
        </p>
      )}
    </div>
  )
}

/** Groups adjacent props sharing the same `group` key into runs. Ungrouped props become solo runs. */
function groupAdjacentProps(props: PropConfig[]): PropConfig[][] {
  const runs: PropConfig[][] = []
  for (const prop of props) {
    const prev = runs[runs.length - 1]
    const prevFirst = prev?.[0]
    if (prev != null && prevFirst != null && prop.group != null && prevFirst.group === prop.group) {
      prev.push(prop)
    } else {
      runs.push([prop])
    }
  }
  return runs
}

function InspectorGroup({
  configs,
  propOverrides,
  onChange,
}: {
  configs: PropConfig[]
  propOverrides: Record<string, unknown> | undefined
  onChange: (name: string, value: unknown) => void
}) {
  const description = [...configs]
    .reverse()
    .find((c: PropConfig) => c.description != null && c.description !== '')?.description
  return (
    <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]/35 p-3 space-y-2">
      {configs.map((config) => (
        <PropField
          key={config.name}
          config={config}
          value={propOverrides?.[config.name]}
          onChange={onChange}
        />
      ))}
      {description != null && (
        <p className="px-1 text-[11px] leading-relaxed text-text-tertiary">{description}</p>
      )}
    </div>
  )
}

export const EditorRightPanel: React.FC = () => {
  const {
    selectedAnimation,
    getPropOverrides,
    setPropOverride,
    resetPropOverrides,
    replayAnimation,
  } = useAnimationInspector()

  const propOverrides = useMemo(
    () =>
      selectedAnimation != null
        ? getPropOverrides(selectedAnimation.id, selectedAnimation.props)
        : undefined,
    [selectedAnimation, getPropOverrides]
  )

  const editableProps = useMemo(
    () => selectedAnimation?.props?.filter((prop) => prop.disabled !== true) ?? [],
    [selectedAnimation]
  )

  const codeOnlyProps = useMemo(
    () => selectedAnimation?.props?.filter((prop) => prop.disabled === true) ?? [],
    [selectedAnimation]
  )

  const isDirty =
    selectedAnimation != null && propOverrides != null
      ? hasDirtyPropOverrides(propOverrides, selectedAnimation.props, selectedAnimation.id)
      : false

  const handlePropChange = (name: string, value: unknown) => {
    if (selectedAnimation == null) return
    setPropOverride(selectedAnimation.id, selectedAnimation.props, name, value)
    replayAnimation(selectedAnimation.id)
  }

  const handleReset = () => {
    if (selectedAnimation == null) return
    resetPropOverrides(selectedAnimation.id, selectedAnimation.props)
    replayAnimation(selectedAnimation.id)
  }

  const handleReplay = () => {
    if (selectedAnimation == null) return
    replayAnimation(selectedAnimation.id)
  }

  return (
    <div className="h-full flex flex-col w-full shrink-0 overflow-hidden">
      <div className="p-4 border-b border-panel-border bg-panel-header/50 z-10 shrink-0 flex items-center gap-2">
        <h2 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest">
          Inspector
        </h2>
      </div>

      {selectedAnimation == null ? (
        <EmptyState />
      ) : (
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin scrollbar-thumb-[var(--border-default)] hover:scrollbar-thumb-[var(--border-highlight)]">
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
                {groupAdjacentProps(editableProps).map((run) => {
                  const first = run[0]
                  if (first == null) return null
                  return run.length === 1 ? (
                    <InspectorField
                      key={first.name}
                      config={first}
                      value={propOverrides?.[first.name]}
                      onChange={handlePropChange}
                    />
                  ) : (
                    <InspectorGroup
                      key={first.group ?? first.name}
                      configs={run}
                      propOverrides={propOverrides}
                      onChange={handlePropChange}
                    />
                  )
                })}
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
