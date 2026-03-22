import type { CSSProperties, ReactNode } from 'react'

/**
 * Placeholder content generators for zero-props catalog rendering.
 * Each generator produces styled elements that demonstrate what the
 * stagger animation looks like without requiring consumer content.
 *
 * These are NOT copied by consumers — they exist only so animations
 * produce a meaningful visual when rendered with zero props.
 */

// ---------------------------------------------------------------------------
// Mock buttons
// ---------------------------------------------------------------------------

export function generateMockButtons(count: number): ReactNode[] {
  const labels = ['Accept', 'Later', 'Skip', 'Details']
  return Array.from({ length: count }, (_, i) => (
    <button
      key={`mock-btn-${String(i)}`}
      type="button"
      style={i === 0 ? primaryBtnStyle : secondaryBtnStyle}
    >
      {labels[i] ?? `Action ${String(i + 1)}`}
    </button>
  ))
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
    <div key={`mock-item-${String(i)}`} style={listItemStyle}>
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
    <div key={`mock-field-${String(i)}`} style={fieldStyle}>
      <label style={labelStyle}>{labels[i] ?? `Field ${String(i + 1)}`}</label>
      <input type="text" readOnly style={inputStyle} />
    </div>
  ))
}

// ---------------------------------------------------------------------------
// Inline styles — no external CSS needed by consumer
// ---------------------------------------------------------------------------

const primaryBtnStyle: CSSProperties = {
  padding: '6px 12px',
  borderRadius: '50px',
  fontWeight: 600,
  fontSize: '14px',
  cursor: 'pointer',
  background: 'linear-gradient(180deg, var(--pf-mock-btn-primary-bg-1), var(--pf-mock-btn-primary-bg-2))',
  color: 'var(--pf-mock-btn-primary-color)',
  border: '2px solid var(--pf-mock-btn-primary-border)',
  textShadow: '0 1px 1px var(--pf-mock-btn-primary-text-shadow)',
}

const secondaryBtnStyle: CSSProperties = {
  padding: '6px 12px',
  borderRadius: '50px',
  fontWeight: 600,
  fontSize: '14px',
  cursor: 'pointer',
  color: 'var(--pf-mock-btn-secondary-color)',
  border: '2px solid var(--pf-mock-btn-secondary-color)',
  background: 'transparent',
}

const listItemStyle: CSSProperties = {
  padding: '12px 16px',
  background: 'var(--pf-mock-list-item-bg)',
  borderRadius: '8px',
  borderLeft: '4px solid var(--pf-mock-list-item-border)',
  color: 'var(--pf-mock-list-item-color)',
  fontWeight: 500,
  fontSize: '14px',
}

const fieldStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
}

const labelStyle: CSSProperties = {
  fontWeight: 500,
  color: 'var(--pf-mock-field-label-color)',
  fontSize: '14px',
}

const inputStyle: CSSProperties = {
  padding: '10px 12px',
  border: '1px solid var(--pf-mock-field-input-border)',
  borderRadius: '6px',
  fontSize: '14px',
  background: 'var(--pf-mock-field-input-bg)',
  color: 'var(--pf-mock-field-input-color)',
}
