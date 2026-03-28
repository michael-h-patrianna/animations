/**
 * EditorRightPanel Component - Animation Catalog Inspector
 * Shared properties editor for the currently selected animation card.
 */

import { PropField } from '@/components/ui/PropField'
import { hasDirtyPropOverrides, useAnimationInspector } from '@/contexts/AnimationInspectorContext'
import { Button } from '@/demo-ui/components/ui/Button'
import { ControlGroup } from '@/demo-ui/components/ui/ControlGroup'
import { Select } from '@/demo-ui/components/ui/Select'
import { ToggleGroup } from '@/demo-ui/components/ui/ToggleGroup'
import { ToggleButton } from '@/demo-ui/components/ui/ToggleButton'
import {
  PREVIEW_FONTS,
  REDUCED_MOTION_LABELS,
  REDUCED_MOTION_OPTIONS,
  useLayoutStore,
} from '@/demo-ui/stores/layoutStore'
import type { NumberPropConfig, PropConfig } from '@/types/animation'
import type React from 'react'
import { useCallback, useMemo } from 'react'

const ANIMATE_TOGGLE_OPTIONS = [
  { value: 'fixed' as const, label: 'Fixed' },
  { value: 'animate' as const, label: 'Animate' },
]

const MOTION_TOGGLE_OPTIONS = REDUCED_MOTION_OPTIONS.map((value) => ({
  value,
  label: REDUCED_MOTION_LABELS[value],
}))

function ProfilerToggle() {
  const showProfiler = useLayoutStore((s) => s.showProfiler)
  const toggleProfiler = useLayoutStore((s) => s.toggleProfiler)

  return (
    <ToggleButton
      pressed={showProfiler}
      onToggle={toggleProfiler}
      ariaLabel="Toggle render profiler"
      data-testid="toggle-profiler"
      className="text-[10px] px-2 py-1"
    >
      Profiler
    </ToggleButton>
  )
}

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

function AnimatableField({
  config,
  value,
  animateMode,
  onToggle,
  onChange,
}: {
  config: NumberPropConfig
  value: unknown
  animateMode: 'fixed' | 'animate'
  onToggle: (mode: 'fixed' | 'animate') => void
  onChange: (name: string, value: unknown) => void
}) {
  const isAnimating = animateMode === 'animate'
  return (
    <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]/35 p-3 space-y-2">
      <ToggleGroup
        options={ANIMATE_TOGGLE_OPTIONS}
        value={animateMode}
        onChange={onToggle}
        ariaLabel={`${config.label} preview mode`}
        data-testid={`animate-toggle-${config.name}`}
      />
      <PropField
        config={{ ...config, disabled: isAnimating ? true : config.disabled }}
        value={value}
        onChange={onChange}
      />
      {config.description != null && config.description !== '' && (
        <p className="mt-2 px-1 text-[11px] leading-relaxed text-text-tertiary">
          {config.description}
        </p>
      )}
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

function useInspectorPanel() {
  const {
    selectedAnimation,
    getPropOverrides,
    setPropOverride,
    resetPropOverrides,
    replayAnimation,
    getAnimateMode,
    setAnimateMode,
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

  const handlePropChange = useCallback(
    (name: string, value: unknown) => {
      if (selectedAnimation == null) return
      setPropOverride(selectedAnimation.id, selectedAnimation.props, name, value)
      replayAnimation(selectedAnimation.id)
    },
    [selectedAnimation, setPropOverride, replayAnimation]
  )

  const handleReset = useCallback(() => {
    if (selectedAnimation == null) return
    resetPropOverrides(selectedAnimation.id, selectedAnimation.props)
    replayAnimation(selectedAnimation.id)
  }, [selectedAnimation, resetPropOverrides, replayAnimation])

  const handleReplay = useCallback(() => {
    if (selectedAnimation == null) return
    replayAnimation(selectedAnimation.id)
  }, [selectedAnimation, replayAnimation])

  return {
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
  }
}

function PropRunField({
  run,
  animationId,
  propOverrides,
  getAnimateMode,
  onAnimateToggle,
  onChange,
}: {
  run: PropConfig[]
  animationId: string
  propOverrides: Record<string, unknown> | undefined
  getAnimateMode: (id: string, name: string, def?: 'fixed' | 'animate') => 'fixed' | 'animate'
  onAnimateToggle: (propName: string) => (mode: 'fixed' | 'animate') => void
  onChange: (name: string, value: unknown) => void
}) {
  const first = run[0]
  if (first == null) return null

  if (run.length === 1 && first.type === 'number' && first.animatable === true) {
    const mode = getAnimateMode(animationId, first.name, first.animateDefault)
    return (
      <AnimatableField
        config={first}
        value={propOverrides?.[first.name]}
        animateMode={mode}
        onToggle={onAnimateToggle(first.name)}
        onChange={onChange}
      />
    )
  }

  if (run.length === 1) {
    return <InspectorField config={first} value={propOverrides?.[first.name]} onChange={onChange} />
  }

  return <InspectorGroup configs={run} propOverrides={propOverrides} onChange={onChange} />
}

const FONT_OPTIONS = PREVIEW_FONTS.map((font) => ({ value: font, label: font }))

function GeneralSection() {
  const previewFont = useLayoutStore((s) => s.previewFont)
  const setPreviewFont = useLayoutStore((s) => s.setPreviewFont)
  const reducedMotion = useLayoutStore((s) => s.reducedMotion)
  const setReducedMotion = useLayoutStore((s) => s.setReducedMotion)

  return (
    <ControlGroup title="General" collapsible data-testid="inspector-general">
      <div className="space-y-4">
        <div className="space-y-2" data-testid="inspector-font">
          <label className="text-[10px] font-semibold uppercase tracking-[0.14em] text-text-tertiary">
            Font
          </label>
          <Select
            options={FONT_OPTIONS}
            value={previewFont}
            onChange={setPreviewFont as (value: string) => void}
            data-testid="preview-font-select"
          />
          <p
            className="px-1 text-[11px] leading-relaxed text-text-tertiary"
            style={{ fontFamily: `${previewFont}, sans-serif` }}
          >
            Preview how animations look with {previewFont}.
          </p>
        </div>

        <div className="space-y-2" data-testid="inspector-motion-pref">
          <label className="text-[10px] font-semibold uppercase tracking-[0.14em] text-text-tertiary">
            Motion
          </label>
          <ToggleGroup
            options={MOTION_TOGGLE_OPTIONS}
            value={reducedMotion}
            onChange={setReducedMotion as (value: string) => void}
            ariaLabel="Motion preference"
            data-testid="motion-pref-toggle"
          />
          <p className="px-1 text-[11px] leading-relaxed text-text-tertiary">
            {reducedMotion === 'reduce'
              ? 'Preview what motion-sensitive users see.'
              : 'Full animations — standard experience.'}
          </p>
        </div>
      </div>
    </ControlGroup>
  )
}

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
