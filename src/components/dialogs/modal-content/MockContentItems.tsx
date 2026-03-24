import type { ReactNode } from 'react'

import { DemoButton, DemoFormField, DemoListItem, DemoModalHeader } from '@/components/demo-blocks'

/**
 * Placeholder content for zero-props catalog rendering.
 * Thin wrappers around demo-blocks building blocks, re-exported under
 * the names animation components already import.
 * NOT copied by consumers — exists only for catalog demos.
 */

// ---------------------------------------------------------------------------
// Modal header (shared across all demo modes)
// ---------------------------------------------------------------------------

export function MockModalHeader({ title = 'Sequence Control' }: { title?: string }) {
  return <DemoModalHeader title={title} badge="Modal" />
}

// ---------------------------------------------------------------------------
// Mock buttons
// ---------------------------------------------------------------------------

export function MockButton({
  label,
  variant = 'primary',
}: {
  label: string
  variant?: 'primary' | 'secondary'
}) {
  return <DemoButton label={label} variant={variant} />
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
  return texts.map((text, i) => <DemoListItem key={`mock-item-${String(i)}`}>{text}</DemoListItem>)
}

// ---------------------------------------------------------------------------
// Mock form fields
// ---------------------------------------------------------------------------

export function generateMockFormFields(count: number = 3): ReactNode[] {
  const labels = ['Username', 'Email', 'Password', 'Confirm']
  return Array.from({ length: count }, (_, i) => (
    <DemoFormField key={`mock-field-${String(i)}`} label={labels[i] ?? `Field ${String(i + 1)}`} />
  ))
}
