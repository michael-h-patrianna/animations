import { PropField } from '@/components/ui/PropField'
import { Select } from '@/demo-ui/components/ui/Select'
import { ToggleGroup } from '@/demo-ui/components/ui/ToggleGroup'
import { ToggleButton } from '@/demo-ui/components/ui/ToggleButton'
import { ControlGroup } from '@/demo-ui/components/ui/ControlGroup'
import { useMediaQuery } from '@/demo-ui/hooks/useMediaQuery'
import {
  PREVIEW_FONTS,
  REDUCED_MOTION_LABELS,
  REDUCED_MOTION_OPTIONS,
  useLayoutStore,
} from '@/demo-ui/stores/layoutStore'
import { isDisabledByCondition } from '@/components/ui/propFieldValue'
import type { NumberPropConfig, PropConfig } from '@/types/animation'

const ANIMATE_TOGGLE_OPTIONS = [
  { value: 'fixed' as const, label: 'Fixed' },
  { value: 'animate' as const, label: 'Animate' },
]

const MOTION_TOGGLE_OPTIONS = REDUCED_MOTION_OPTIONS.map((value) => ({
  value,
  label: REDUCED_MOTION_LABELS[value],
}))

const FONT_OPTIONS = PREVIEW_FONTS.map((font) => ({ value: font, label: font }))

/**
 *
 */
export function ProfilerToggle() {
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

/**
 *
 */
export function CountBadge({ count }: { count: number }) {
  return (
    <span className="inline-flex min-w-5 items-center justify-center rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)]/60 px-1.5 py-0.5 text-[10px] font-semibold text-text-tertiary">
      {count}
    </span>
  )
}

/**
 *
 */
export function EmptyState() {
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
  allValues,
}: {
  config: NumberPropConfig
  value: unknown
  animateMode: 'fixed' | 'animate'
  onToggle: (mode: 'fixed' | 'animate') => void
  onChange: (name: string, value: unknown) => void
  allValues?: Record<string, unknown>
}) {
  const isConditionallyDisabled = isDisabledByCondition(config, allValues)
  const isAnimating = !isConditionallyDisabled && animateMode === 'animate'
  return (
    <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]/35 p-3 space-y-2">
      {!isConditionallyDisabled && (
        <ToggleGroup
          options={ANIMATE_TOGGLE_OPTIONS}
          value={animateMode}
          onChange={onToggle}
          ariaLabel={`${config.label} preview mode`}
          data-testid={`animate-toggle-${config.name}`}
        />
      )}
      <PropField
        config={{ ...config, disabled: isAnimating || isConditionallyDisabled || config.disabled }}
        value={value}
        onChange={onChange}
        allValues={allValues}
      />
      {config.description != null && config.description !== '' && (
        <p className="mt-2 px-1 text-[11px] leading-relaxed text-text-tertiary">
          {config.description}
        </p>
      )}
    </div>
  )
}

/**
 *
 */
export function InspectorField({
  config,
  value,
  onChange,
  allValues,
}: {
  config: PropConfig
  value: unknown
  onChange: (name: string, value: unknown) => void
  allValues?: Record<string, unknown>
}) {
  return (
    <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]/35 p-3">
      <PropField config={config} value={value} onChange={onChange} allValues={allValues} />
      {config.description != null && config.description !== '' && (
        <p className="mt-2 px-1 text-[11px] leading-relaxed text-text-tertiary">
          {config.description}
        </p>
      )}
    </div>
  )
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
          allValues={propOverrides}
        />
      ))}
      {description != null && (
        <p className="px-1 text-[11px] leading-relaxed text-text-tertiary">{description}</p>
      )}
    </div>
  )
}

/**
 *
 */
export function PropRunField({
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
        allValues={propOverrides}
      />
    )
  }

  if (run.length === 1) {
    return (
      <InspectorField
        config={first}
        value={propOverrides?.[first.name]}
        onChange={onChange}
        allValues={propOverrides}
      />
    )
  }

  return <InspectorGroup configs={run} propOverrides={propOverrides} onChange={onChange} />
}

/**
 *
 */
export function GeneralSection() {
  const previewFont = useLayoutStore((s) => s.previewFont)
  const setPreviewFont = useLayoutStore((s) => s.setPreviewFont)
  const reducedMotion = useLayoutStore((s) => s.reducedMotion)
  const setReducedMotion = useLayoutStore((s) => s.setReducedMotion)
  const osReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')

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
            className="px-1 text-[11px] leading-relaxed text-text-tertiary font-[family-name:var(--preview-font)]"
            style={{ '--preview-font': `${previewFont}, sans-serif` } as React.CSSProperties}
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
          {osReducedMotion && (
            <p
              className="rounded-lg bg-amber-500/10 px-2.5 py-2 text-[11px] leading-relaxed text-amber-400"
              data-testid="os-reduced-motion-warning"
            >
              Your OS has reduced motion enabled. Full animation preview requires turning this off
              in your system accessibility settings.
            </p>
          )}
        </div>
      </div>
    </ControlGroup>
  )
}
