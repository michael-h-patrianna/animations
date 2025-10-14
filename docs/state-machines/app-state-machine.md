# App State Machine Design

**Status:** Design Complete - Ready for Implementation
**Date:** October 13, 2025
**Related:** Style Guide Audit M1 Violation
**Priority:** HIGH

---

## Problem Statement

App.tsx currently manages state across **5 separate variables**:

```tsx
const [currentGroupId, setCurrentGroupId] = useState<string>('')
const direction = 0  // Unused! Can be removed
const [isDrawerOpen, setIsDrawerOpen] = useState(false)
const dragControls = useDragControls()
const appBarRef = useRef<HTMLDivElement | null>(null)
```

**Issues:**
- Navigation state (currentGroupId) separate from UI state (drawer)
- `direction` variable is unused and can be removed
- No clear relationship between drawer and navigation state
- Difficult to reason about valid state combinations

---

## Proposed Solution

Create **useAppStateMachine** hook consolidating navigation, drawer, and drag state with typed transitions.

### State Structure

```typescript
/**
 * App-level state machine
 */
interface AppMachineState {
  // Navigation state
  navigation: {
    currentGroupId: string
    previousGroupId: string | null
  }

  // UI state
  ui: {
    drawerState: 'closed' | 'open' | 'animating'
  }

  // Refs (not part of reducer state)
  // These will be managed separately as they're not serializable
}
```

### Actions

```typescript
/**
 * All possible actions on App state
 */
type AppAction =
  | { type: 'NAVIGATE_TO_GROUP'; groupId: string }
  | { type: 'OPEN_DRAWER' }
  | { type: 'CLOSE_DRAWER' }
  | { type: 'START_DRAWER_ANIMATION' }
  | { type: 'FINISH_DRAWER_ANIMATION' }
  | { type: 'NAVIGATE_AND_CLOSE_DRAWER'; groupId: string }
```

### State Transitions

```
Navigation Flow:
┌────────────────┐
│ Initial Load   │
└───────┬────────┘
        │ NAVIGATE_TO_GROUP
        ▼
┌────────────────┐
│ Group Loaded   │◄─┐
└───────┬────────┘  │
        │           │
        └───────────┘
         NAVIGATE_TO_GROUP

Drawer Flow:
┌────────┐           ┌────────────┐           ┌──────┐
│ closed │──────────►│ animating  │──────────►│ open │
└───┬────┘           └────────────┘           └───┬──┘
    │  OPEN_DRAWER    START_ANIMATION   FINISH   │
    │                                             │
    └─────────────────────────────────────────────┘
                   CLOSE_DRAWER

Combined Flow (Mobile):
┌────────────────┐
│ Drawer Open    │
└───────┬────────┘
        │ NAVIGATE_AND_CLOSE_DRAWER
        ▼
┌────────────────┐
│ Navigating +   │
│ Drawer Closing │
└───────┬────────┘
        ▼
┌────────────────┐
│ New Group +    │
│ Drawer Closed  │
└────────────────┘
```

### Reducer Implementation

```typescript
function appReducer(
  state: AppMachineState,
  action: AppAction
): AppMachineState {
  switch (action.type) {
    case 'NAVIGATE_TO_GROUP':
      return {
        ...state,
        navigation: {
          currentGroupId: action.groupId,
          previousGroupId: state.navigation.currentGroupId || null,
        },
      }

    case 'OPEN_DRAWER':
      return {
        ...state,
        ui: { drawerState: 'animating' },
      }

    case 'CLOSE_DRAWER':
      return {
        ...state,
        ui: { drawerState: 'closed' },
      }

    case 'START_DRAWER_ANIMATION':
      return {
        ...state,
        ui: { drawerState: 'animating' },
      }

    case 'FINISH_DRAWER_ANIMATION':
      if (state.ui.drawerState === 'animating') {
        return {
          ...state,
          ui: { drawerState: 'open' },
        }
      }
      return state

    case 'NAVIGATE_AND_CLOSE_DRAWER':
      // Combined action for mobile: navigate + close drawer atomically
      return {
        ...state,
        navigation: {
          currentGroupId: action.groupId,
          previousGroupId: state.navigation.currentGroupId || null,
        },
        ui: { drawerState: 'closed' },
      }

    default:
      return state
  }
}
```

---

## Implementation Guide

### Step 1: Create Hook File

**File:** `src/hooks/useAppStateMachine.ts`

```typescript
import { useReducer, useRef } from 'react'
import { useDragControls } from 'framer-motion'
import type { DragControls } from 'framer-motion'

const initialState: AppMachineState = {
  navigation: {
    currentGroupId: '',
    previousGroupId: null,
  },
  ui: {
    drawerState: 'closed',
  },
}

/**
 * App-level state machine hook managing navigation and UI state.
 *
 * Consolidates scattered state variables into a single state machine with
 * typed transitions and clear state relationships.
 *
 * @returns {Object} State machine interface
 * @returns {string} currentGroupId - Currently selected group ID
 * @returns {string | null} previousGroupId - Previously selected group ID
 * @returns {boolean} isDrawerOpen - Whether mobile drawer is open
 * @returns {DragControls} dragControls - Framer Motion drag controls
 * @returns {RefObject<HTMLDivElement>} appBarRef - App bar ref for scroll calculations
 * @returns {Function} navigateToGroup - Navigate to a group
 * @returns {Function} openDrawer - Open mobile drawer
 * @returns {Function} closeDrawer - Close mobile drawer
 * @returns {Function} navigateAndCloseDrawer - Navigate and close drawer atomically
 *
 * @example
 * ```tsx
 * const {
 *   currentGroupId,
 *   isDrawerOpen,
 *   navigateToGroup,
 *   closeDrawer,
 * } = useAppStateMachine()
 *
 * <button onClick={() => navigateToGroup('button-effects-framer')}>
 *   Button Effects
 * </button>
 * ```
 */
export function useAppStateMachine() {
  const [state, dispatch] = useReducer(appReducer, initialState)

  // Refs are managed separately as they're not serializable
  const dragControls = useDragControls()
  const appBarRef = useRef<HTMLDivElement | null>(null)

  return {
    // State
    currentGroupId: state.navigation.currentGroupId,
    previousGroupId: state.navigation.previousGroupId,
    isDrawerOpen: state.ui.drawerState === 'open',

    // Refs
    dragControls,
    appBarRef,

    // Actions
    navigateToGroup: (groupId: string) =>
      dispatch({ type: 'NAVIGATE_TO_GROUP', groupId }),

    openDrawer: () =>
      dispatch({ type: 'OPEN_DRAWER' }),

    closeDrawer: () =>
      dispatch({ type: 'CLOSE_DRAWER' }),

    navigateAndCloseDrawer: (groupId: string) =>
      dispatch({ type: 'NAVIGATE_AND_CLOSE_DRAWER', groupId }),

    // Internal actions (for animation callbacks)
    _startDrawerAnimation: () =>
      dispatch({ type: 'START_DRAWER_ANIMATION' }),

    _finishDrawerAnimation: () =>
      dispatch({ type: 'FINISH_DRAWER_ANIMATION' }),
  }
}
```

### Step 2: Update App.tsx

**Before:**
```tsx
const [currentGroupId, setCurrentGroupId] = useState<string>('')
const direction = 0  // Unused
const [isDrawerOpen, setIsDrawerOpen] = useState(false)
const dragControls = useDragControls()
const appBarRef = useRef<HTMLDivElement | null>(null)
```

**After:**
```tsx
const {
  currentGroupId,
  isDrawerOpen,
  dragControls,
  appBarRef,
  navigateToGroup,
  openDrawer,
  closeDrawer,
  navigateAndCloseDrawer,
} = useAppStateMachine()
```

**Update setCurrentGroupId calls:**
```tsx
// Before
setCurrentGroupId(groupId)

// After
navigateToGroup(groupId)
```

**Update drawer calls:**
```tsx
// Before
setIsDrawerOpen(false)

// After
closeDrawer()
```

**Update mobile handlers:**
```tsx
// Before
const handleGroupSelectMobile = useCallback(
  (groupId: string) => {
    handleGroupSelect(groupId)
    setIsDrawerOpen(false)
  },
  [handleGroupSelect]
)

// After (handled by state machine)
const handleGroupSelectMobile = (groupId: string) => {
  navigateAndCloseDrawer(groupId)
}
```

### Step 3: Clean Up Unused Code

Remove the `direction` variable entirely:
```tsx
const direction = 0  // DELETE THIS LINE
```

It's never used in the codebase!

### Step 4: Add Tests

**File:** `src/hooks/useAppStateMachine.test.ts`

```typescript
import { renderHook, act } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { useAppStateMachine } from './useAppStateMachine'

describe('useAppStateMachine', () => {
  it('starts with empty currentGroupId', () => {
    const { result } = renderHook(() => useAppStateMachine())

    expect(result.current.currentGroupId).toBe('')
    expect(result.current.previousGroupId).toBeNull()
  })

  it('navigates to group', () => {
    const { result } = renderHook(() => useAppStateMachine())

    act(() => {
      result.current.navigateToGroup('button-effects-framer')
    })

    expect(result.current.currentGroupId).toBe('button-effects-framer')
  })

  it('tracks previous group on navigation', () => {
    const { result } = renderHook(() => useAppStateMachine())

    act(() => {
      result.current.navigateToGroup('button-effects-framer')
    })

    act(() => {
      result.current.navigateToGroup('text-effects-framer')
    })

    expect(result.current.currentGroupId).toBe('text-effects-framer')
    expect(result.current.previousGroupId).toBe('button-effects-framer')
  })

  it('opens and closes drawer', () => {
    const { result } = renderHook(() => useAppStateMachine())

    expect(result.current.isDrawerOpen).toBe(false)

    act(() => {
      result.current.openDrawer()
    })

    // Note: drawer needs animation to complete
    act(() => {
      result.current._finishDrawerAnimation()
    })

    expect(result.current.isDrawerOpen).toBe(true)

    act(() => {
      result.current.closeDrawer()
    })

    expect(result.current.isDrawerOpen).toBe(false)
  })

  it('navigates and closes drawer atomically', () => {
    const { result } = renderHook(() => useAppStateMachine())

    act(() => {
      result.current.openDrawer()
      result.current._finishDrawerAnimation()
    })

    expect(result.current.isDrawerOpen).toBe(true)

    act(() => {
      result.current.navigateAndCloseDrawer('button-effects-framer')
    })

    expect(result.current.currentGroupId).toBe('button-effects-framer')
    expect(result.current.isDrawerOpen).toBe(false)
  })

  it('provides drag controls and app bar ref', () => {
    const { result } = renderHook(() => useAppStateMachine())

    expect(result.current.dragControls).toBeDefined()
    expect(result.current.appBarRef).toBeDefined()
    expect(result.current.appBarRef.current).toBeNull() // Not attached yet
  })
})
```

---

## Benefits

### Before (5 scattered state variables)
❌ State spread across multiple variables
❌ No clear state relationships
❌ `direction` variable unused (dead code)
❌ setState calls can happen in wrong order
❌ Mobile handlers manually coordinate state

### After (1 useReducer + refs)
✅ Centralized state management
✅ Clear navigation + UI state relationship
✅ Unused code removed
✅ Atomic state transitions (navigate + close drawer)
✅ Type-safe state transitions

---

## Migration Checklist

- [ ] Create `src/hooks/useAppStateMachine.ts` with types and reducer
- [ ] Add comprehensive tests in `src/hooks/useAppStateMachine.test.ts`
- [ ] Update App.tsx to use new hook
- [ ] Replace all setState calls with state machine actions
- [ ] Remove unused `direction` variable
- [ ] Simplify mobile handlers using `navigateAndCloseDrawer`
- [ ] Run full test suite to verify no regressions
- [ ] Update App.test.tsx for state machine
- [ ] Create ADR documenting the approach

---

## Risks & Mitigation

### Risk: Breaking Navigation Behavior
**Mitigation:** Comprehensive integration tests for navigation flows

### Risk: Drawer Animation Timing Issues
**Mitigation:** Keep drawer animation callbacks, test with delays

### Risk: useGroupInitialization Hook Integration
**Mitigation:** Hook will call `navigateToGroup` instead of `setCurrentGroupId`

---

## Future Enhancements

1. **Add Navigation History:** Implement back/forward navigation
2. **Add Transition Animations:** Animate between groups based on direction
3. **Add State Persistence:** Save navigation state to sessionStorage
4. **Add Analytics:** Track navigation patterns

---

## Code Removal Opportunity

The `direction` constant can be **completely removed**:

```bash
# Search for usage
git grep "direction" src/App.tsx

# Result: Only declaration, no usage!
const direction = 0
```

This was likely intended for slide animations but never implemented. Safe to delete! 🎉

---

*This design is ready for implementation. Follow the migration checklist to safely refactor App state.*
