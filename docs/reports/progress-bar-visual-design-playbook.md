# Progress Bar Visual Design Playbook

A methodology for taking any progress bar animation from "functional but ugly" to "premium dark-theme UI" — applied one bar at a time.

## Design Constraint

All colors in `background`, `border`, `box-shadow`, `text-shadow`, `color` declarations MUST use CSS custom properties. The stylelint `no-hardcoded-colors` rule enforces this. Define all colors as `--` properties on the component root, then reference them with `var()`.

## Step 0: Classify the Container Model

Before any visual work, determine which model the bar follows:

| Model | Description | Has own background? | Examples |
|-|-|-|-|
| **A — Naked track** | Just a track + fill. Sits in consumer's layout. | No | ElasticFill, ProgressThin, ProgressBounce, ProgressSegmented, CelebrationBurst |
| **B — Self-contained card** | Creates its own visual world with bg, border, padding. | Yes | NeonPulse, SciFiLoader, RetroBit, CrystalNodes, QuestlineRoyal, XpAccumulation |
| **C — Labeled composite** | Track + metadata UI (labels, counters, icons). No own bg. | No | Stamina, JourneyMap, FlagPlant, MilestoneUnlock, ProgressMilestones, ChargeSurge |
| **D — Non-bar shape** | Not a horizontal/vertical bar. Circular, tube, etc. | Varies | CircularDash, LiquidTube, ZoomedProgress |

The model determines which CSS recipes apply. A naked track needs depth on the track itself. A card creates depth on its container. A labeled composite needs typography rules.

## Step 1: Identity

Write one sentence: "This bar is a _____ that communicates _____ through _____."

This determines the color family and visual tone. Gaming/achievement bars want luminous, exciting colors. Utility bars want clean, neutral tones. Themed bars define their own world.

## Step 2: Palette

**Rule: ONE primary hue. Derive everything from it.**

All CSS color values are custom properties on the component root. Name them semantically:

```
--{component}-track-bg       — track background
--{component}-track-border   — track edge
--{component}-track-shadow   — track inset shadow
--{component}-fill-from      — fill gradient start (darker end)
--{component}-fill-to        — fill gradient end (lighter end)
--{component}-fill-glow      — fill outer glow shadow
--{component}-fill-highlight  — fill top-edge highlight (always white at low opacity)
--{component}-text-strong    — primary text (white tinted toward primary hue)
--{component}-text-muted     — secondary text (white at 45-60% opacity)
```

**Palette derivation from a single primary hue (e.g., `#38bdf8` sky-blue):**
- Track bg: primary at 8% opacity → `rgb(56 189 248 / 8%)`
- Track border: white at 5% → `rgb(255 255 255 / 5%)`
- Track shadow: black at 25% → `rgb(0 0 0 / 25%)`
- Fill from: primary → `#38bdf8`
- Fill to: primary lightened → `#7dd3fc`
- Fill glow: primary at 30% → `rgb(56 189 248 / 30%)`
- Fill highlight: always `rgb(255 255 255 / 22%)`
- Text strong: `#f0f9ff` (lightest tint of primary family)
- Text muted: `rgb(255 255 255 / 50%)`

**Catalog color assignments (default palette per bar):**

Utility bars share a small set of color families to avoid rainbow chaos on the catalog page:

| Color family | Primary | Bars |
|-|-|-|
| Amber/Gold | `#f59e0b` | ElasticFill, FlagPlant |
| Sky Blue | `#38bdf8` | ProgressThin, ProgressMilestones, ChargeSurge, JourneyMap |
| Emerald | `#34d399` | ProgressBounce, Stamina |
| Violet | `#a78bfa` | ProgressSegmented, MilestoneUnlock, ZoomedProgress |
| Purple | `#a855f7` | CelebrationBurst (kept as-is per user) |
| Cyan | `#22d3ee` | CrystalNodes, SciFiLoader, XpAccumulation |
| Teal | `#14b8a6` | CircularDash |
| Blue | `#3b82f6` | LiquidTube |
| Magenta | `#ec4899` | NeonPulse |
| Terminal Green | `#22c55e` | RetroBit |
| Blue-Cyan-Gold | (multi) | QuestlineRoyal (already good, minimal changes) |
| Blue-Cyan | `#38bdf8` | TimelineProgress |

## Step 3: Depth (Track)

**For standard tracks (height ≥ 6px) — Model A/C:**
```css
.track {
  background: var(--track-bg);
  border: 1px solid var(--track-border);
  box-shadow: inset 0 1px 3px var(--track-shadow);
  border-radius: 999px;
}
```

**For thin tracks (height ≤ 4px) — e.g., ProgressThin:**
No inset shadow (doesn't render well at this scale). Use fill glow for depth instead:
```css
.track {
  background: var(--track-bg);
  border-radius: 999px;
}
.fill {
  box-shadow: 0 0 8px var(--fill-glow);
}
```

**For self-contained cards — Model B:**
```css
.container {
  background: linear-gradient(150deg, var(--accent-tint) 0%, transparent 42%),
    linear-gradient(0deg, var(--bg-dark) 0%, var(--bg-mid) 58%, var(--bg-light) 100%);
  border: 1px solid var(--edge-color);
  box-shadow:
    inset 0 1px 0 var(--surface-shine),
    0 16px 32px var(--shadow-outer);
  border-radius: 16px;
}
```

## Step 4: Luminosity (Fill)

The fill should feel like it emits light within the track.

```css
.fill {
  background: linear-gradient(90deg, var(--fill-from) 0%, var(--fill-to) 100%);
  border-radius: inherit;
  box-shadow: 0 0 12px var(--fill-glow);
}

/* Glass highlight — makes the fill feel 3D/luminous */
.fill::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(180deg, var(--fill-highlight) 0%, transparent 55%);
  pointer-events: none;
}
```

**For thin fills (2px):** Skip `::after` (not visible at this scale). Rely on `box-shadow` glow alone.

**For vertical fills (LiquidTube):** Rotate the gradient: `linear-gradient(0deg, ...)` and use left-edge highlight.

## Step 5: Typography

Only applies to Model B and C bars.

```
Eyebrow/label:  11px  weight 500-600  letter-spacing 0.04em  color: --text-muted
Title:          14-18px  weight 600-650  color: --text-strong
Value/counter:  16-22px  weight 600-700  font-variant-numeric: tabular-nums  color: --text-strong
Status tag:     10px  weight 700  uppercase  letter-spacing 0.05em  pill bg
```

## Step 6: Detail Polish

- [ ] Border radius is consistent within the bar (track, fill, milestone markers)
- [ ] Inactive/disabled states use reduced opacity (0.3-0.5), not different colors
- [ ] Active states add glow (`box-shadow`) on top of color change
- [ ] No hardcoded color values outside CSS custom property declarations
- [ ] Text colors tint toward the primary hue (not pure `#fff`)
- [ ] Spacing follows 4px grid (4, 8, 12, 16, 20, 24)
- [ ] `::after` highlight uses `pointer-events: none`
- [ ] Fill uses `will-change: transform` and `transform-origin: left center`

## Step 7: TSX Inline Audit

Check the framer TSX file for inline `style` props that reference colors:
- Replace `var(--pf-anim-*)` fallbacks with the bar's own custom property or a hardcoded hex
- Ensure all inline accent colors match the CSS custom property values
- Elements that share CSS class names with the CSS variant need `style={{ animation: 'none' }}`

## Quality Gate

Before marking a bar as done:
1. CSS-only: `npm run lint:css` passes
2. TSX: `npm run type-check` passes
3. Visual: the bar looks like it belongs in a premium mobile game, not a Bootstrap template
4. Both variants: framer/ and css/ CSS files have matching custom property values
