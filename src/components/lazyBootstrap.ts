// Import category modules for their registration side effects.
// Each category registers lazy loaders and lightweight nav metadata at module init.
import '@/components/base'
import '@/components/dialogs'
import '@/components/progress'
import '@/components/realtime'
import '@/components/rewards'

// Kick off the default group fetch as early as possible — before React renders
// and navigates. By the time useDefaultGroupRedirect fires (after first render),
// the chunk is already in-flight or cached.
import { getAllLazyGroups, preloadLazyGroup } from '@/lib/lazyGroupRegistry'
const firstGroupId = getAllLazyGroups()[0]?.id
if (firstGroupId !== undefined) preloadLazyGroup(firstGroupId)

export {}
