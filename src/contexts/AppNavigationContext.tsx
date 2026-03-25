import { createContext, use, type ReactNode } from 'react'
import { useLazyAppNavigation, type LazyAppNavigationResult } from '@/hooks/useLazyAppNavigation'

const AppNavigationContext = createContext<LazyAppNavigationResult | undefined>(undefined)

/**
 * Provides a single navigation state instance to the entire app shell.
 * Must be rendered inside BrowserRouter + Route (needs useParams).
 */
export const AppNavigationProvider = ({ children }: { children: ReactNode }) => {
  const navigation = useLazyAppNavigation()
  return <AppNavigationContext value={navigation}>{children}</AppNavigationContext>
}

/**
 * Consumes navigation state from the nearest AppNavigationProvider.
 *
 * @returns Navigation state: categories, current group, handlers
 * @throws If called outside AppNavigationProvider
 */
export const useAppNavigation = (): LazyAppNavigationResult => {
  const context = use(AppNavigationContext)
  if (context === undefined) {
    throw new Error('useAppNavigation must be used within an AppNavigationProvider')
  }
  return context
}
