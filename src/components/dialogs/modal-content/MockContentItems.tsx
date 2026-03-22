import type { ReactNode } from 'react'

/**
 * Placeholder content for zero-props catalog rendering.
 * Each generator produces styled elements using pf-mc-* classes from shared.css.
 * These are NOT copied by consumers — they exist only so animations
 * produce a meaningful visual when rendered with zero props.
 */

// ---------------------------------------------------------------------------
// Modal header (shared across all demo modes)
// ---------------------------------------------------------------------------

export function MockModalHeader({ title = 'Sequence Control' }: { title?: string }) {
  return (
    <div className="pf-mc-header">
      <h4 className="pf-mc-title">{title}</h4>
      <span className="pf-mc-badge">Modal</span>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Mock buttons
// ---------------------------------------------------------------------------

export function MockButton({ label, variant = 'primary' }: { label: string; variant?: 'primary' | 'secondary' }) {
  return (
    <button type="button" className={`pf-mc-btn pf-mc-btn--${variant}`}>
      {label}
    </button>
  )
}

// ---------------------------------------------------------------------------
// Mock list items
// ---------------------------------------------------------------------------

const DEFAULT_LIST_TEXTS = [
  'Privacy settings updated',
  'Two-factor authentication enabled',
  'Email notifications configured',
  'Profile picture updated',
  'Timezone set to UTC',
]

export function generateMockListItems(count?: number): ReactNode[] {
  const texts = DEFAULT_LIST_TEXTS.slice(0, count ?? DEFAULT_LIST_TEXTS.length)
  return texts.map((text, i) => (
    <div key={`mock-item-${String(i)}`} className="pf-mc-list-item">
      {text}
    </div>
  ))
}

// ---------------------------------------------------------------------------
// Mock form fields
// ---------------------------------------------------------------------------

export function generateMockFormFields(count: number = 3): ReactNode[] {
  const labels = ['Username', 'Email', 'Password', 'Confirm']
  return Array.from({ length: count }, (_, i) => (
    <div key={`mock-field-${String(i)}`} className="pf-mc-field">
      <label>{labels[i] ?? `Field ${String(i + 1)}`}</label>
      <input type="text" readOnly />
    </div>
  ))
}
