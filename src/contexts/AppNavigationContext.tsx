import { createContext, use } from 'react'
import type { LazyAppNavigationResult } from '@/hooks/useLazyAppNavigation'

/**
 * Context for app navigation state. Provided in App.tsx via useLazyAppNavigation.
 *
 * Deliberately has no runtime dependency on useLazyAppNavigation — only a
 * type import — so that HMR updates to animation modules never re-evaluate
 * this module and create a new context object (which would break the
 * provider/consumer identity contract).
 */
export const AppNavigationContext = createContext<LazyAppNavigationResult | undefined>(undefined)

/**
 * Consumes navigation state from the nearest AppNavigationContext provider.
 *
 * @returns Navigation state: categories, current group, handlers
 * @throws If called outside a provider
 */
export const useAppNavigation = (): LazyAppNavigationResult => {
  const context = use(AppNavigationContext)
  if (context === undefined) {
    throw new Error('useAppNavigation must be used within an AppNavigationContext provider')
  }
  return context
}
