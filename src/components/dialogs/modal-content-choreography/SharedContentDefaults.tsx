import type { ReactNode } from 'react'

import { DemoFormField, DemoListItem } from '@/components/demo-blocks'

/**
 * Placeholder content for zero-props catalog rendering.
 * Thin wrappers around demo-blocks building blocks.
 * NOT copied by consumers — exists only for catalog demos.
 */

// ---------------------------------------------------------------------------
// Default list items
// ---------------------------------------------------------------------------

const DEFAULT_LIST_TEXTS = [
  'Privacy settings updated',
  'Two-factor authentication enabled',
  'Email notifications configured',
  'Profile picture updated',
  'Timezone set to UTC',
]

/** Generate placeholder list items from demo-blocks for zero-props rendering. */
export function generateDefaultListItems(count?: number): ReactNode[] {
  const texts = DEFAULT_LIST_TEXTS.slice(0, count ?? DEFAULT_LIST_TEXTS.length)
  return texts.map((text, i) => <DemoListItem key={`mock-item-${String(i)}`}>{text}</DemoListItem>)
}

// ---------------------------------------------------------------------------
// Default form fields
// ---------------------------------------------------------------------------

/** Generate placeholder form fields from demo-blocks for zero-props rendering. */
export function generateDefaultFormFields(count: number = 3): ReactNode[] {
  const labels = ['Username', 'Email', 'Password', 'Confirm']
  return Array.from({ length: count }, (_, i) => (
    <DemoFormField key={`mock-field-${String(i)}`} label={labels[i] ?? `Field ${String(i + 1)}`} />
  ))
}
