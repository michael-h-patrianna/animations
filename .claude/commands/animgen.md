---
description: Autonomous animation generation loop with design, development, and testing
---

# Autonomous Animation Generation Loop

**Purpose:** Autonomously generate, design, develop, and test new animations for gamified/social casino UI contexts.

**When to use:**
- Building out animation library systematically
- Adding animations for common interaction patterns
- Filling gaps in animation coverage
- Continuous animation development sessions

**What this creates:**
- New animation components (both CSS and Framer Motion variants)
- Tests for each animation
- Registry integration
- Documentation updates

**Important:** This command runs autonomously. It will continue until:
- User stops it manually
- Maximum rounds completed (default: 10)
- No viable animation ideas remain

---

## Phase 0: Initialize Session

**MANDATORY: Set up discovery and context before starting autonomous loop.**

### Step 1: Create Session Tracker

Use TodoWrite to create session tracker:
- Session ID: ANIMGEN-[timestamp]
- Animations created counter
- Current round number

### Step 2: Discovery - Understand Existing Animations

**MANDATORY GATE: Complete discovery before generating ideas.**

Use Grep and Read to analyze existing animations:

```bash
# Find all animation components
find src/components -name "*.tsx" -path "*/framer/*" -o -path "*/css/*"

# Examine animation registry
cat src/components/animationRegistry.ts
```

**Analyze and document:**
1. **Existing categories** (from `src/components/` folder structure):
   - What categories exist?
   - Which categories are well-populated?
   - Which are sparse?

2. **Existing groups** (from category subfolders):
   - What animation groups exist in each category?
   - What patterns are repeated?
   - What common UI interactions are covered?

3. **Animation patterns** (from component files):
   - What animation techniques are used?
   - What are common durations/easings?
   - What accessibility patterns exist?

4. **Gaps and opportunities**:
   - What social casino/gamified patterns are missing?
   - What common interactions lack animations?
   - What variants could enhance existing groups?

**Add findings to TodoWrite:**
```
Discovery findings:
- Categories: [list]
- Well-covered: [areas]
- Gaps: [areas]
- Opportunities: [ideas]
```

### Step 3: Read Documentation

**MANDATORY: Read these docs before proceeding:**

```bash
# Animation design principles
cat docs/animation-short.md

# Project structure and registry pattern
cat CLAUDE.md | grep -A 50 "High-Level Data Flow"

# Testing strategy (if exists)
cat docs/testing.md 2>/dev/null || echo "No testing doc found"
```

**Deliverable:** Complete understanding of existing animations, gaps, and design principles.

---

## Phase 1: Autonomous Animation Loop

**For each animation round (max 10 rounds):**

### Step A: Generate Animation Idea

**MANDATORY: Use sequential thinking to generate contextual idea.**

Use mcp__mcp_docker__sequentialthinking to analyze and generate:

**Analysis inputs:**
- Discovery findings from Phase 0
- Social casino/gamified UI patterns
- Existing animations (avoid duplication)
- Common interaction needs
- Performance constraints

**Social Casino Context (focus areas):**
- Win celebrations (coins, level-ups, jackpots)
- Loss feedback (subtle, non-punishing)
- Progress indicators (XP bars, progress tracking)
- Reward reveals (chest opening, card flips, mystery reveals)
- Currency effects (chips/coins flying, collecting)
- Status updates (badges, achievements, rank changes)
- Engagement loops (daily bonuses, streaks, timers)
- Interactive feedback (button presses, spins, taps)
- Loading states (anticipation, excitement)
- Transitions (page changes, modal appearances)

**CONSTRAINTS (MANDATORY):**
- ✅ Motion-based (transform, opacity, scale, rotate)
- ✅ CSS properties only (no SVG paths, no canvas drawing)
- ✅ Reusable across multiple use cases
- ✅ GPU-accelerated (transform/opacity preferred)
- ✅ Accessibility-friendly (prefers-reduced-motion support)
- ❌ NO complex illustrations or drawings
- ❌ NO SVG path animations requiring drawing
- ❌ NO image generation requirements
- ❌ NO complex filter effects (performance issues)
- ❌ NO VH/VW units (React Native incompatibility)

**Generate:**
1. **Animation concept**: What does it do? (1-2 sentences)
2. **Use cases**: Where would this be used? (3+ specific examples)
3. **Category placement**: Which existing category? (or new if justified)
4. **Group placement**: New group or addition to existing?
5. **Variant name**: Descriptive, follows existing naming patterns
6. **Motion characteristics**: Duration, easing, key properties animated

**RED FLAGS (require regeneration):**
- Idea requires drawing/illustration
- Too similar to existing animation
- Too specific (not reusable)
- Performance-heavy (filter, clip-path, backdrop-filter)
- Single use case only

**Add idea to TodoWrite:**
```
Animation Idea [Round N]:
- Concept: [description]
- Category: [category-id]
- Group: [group-id]
- Variant: [variant-name]
- Use cases: [list]
```

### Step B: Design Specification (animation-designer agent)

**MANDATORY: Use animation-designer agent to create formal spec.**

Call animation-designer agent with:
- Animation idea from Step A
- Context from discovery (existing patterns, design principles)
- Reference to `docs/animation-short.md`
- Requirement: BOTH CSS and Framer Motion variants needed

**Prompt template for agent:**
```
Design an animation spec for this animation:

Concept: [from Step A]
Use cases: [from Step A]
Category: [category-id]
Group: [group-id]
Variant: [variant-name]

Requirements:
- Follow motion design principles from docs/animation-short.md
- Design for BOTH CSS-only and Framer Motion implementations
- Motion-based only (no drawing/illustration)
- GPU-accelerated properties (transform, opacity)
- Accessible (prefers-reduced-motion alternative)
- Performance target: 60fps
- React Native compatible (no VH/VW, DOM-only APIs)

Context - Existing animations in this project:
[Paste relevant discovery findings]

Create complete ANIMATION_SPEC following docs/animation-short.md format.
```

**Expected output:** Single ANIMATION_SPEC JSON block

**Validation:**
- [ ] Spec follows docs/animation-short.md format
- [ ] Both CSS and Framer Motion variants specified
- [ ] Accessibility considerations included
- [ ] Performance targets defined
- [ ] No drawing/illustration requirements

**RED FLAG:** If spec requires drawing/SVG paths → STOP → Go back to Step A with different idea.

### Step C: Implementation (animation-developer agent)

**MANDATORY: Use animation-developer agent to implement BOTH variants.**

Call animation-developer agent with:
- ANIMATION_SPEC from Step B
- Animation registry structure from CLAUDE.md
- Existing code patterns (sample from same category)
- Performance requirements

**Prompt template for agent:**
```
Implement this animation following the spec and project structure:

ANIMATION_SPEC:
[Paste spec from Step B]

Project Structure (co-located metadata pattern):
[Paste relevant section from CLAUDE.md]

Category: src/components/[category-id]/
Group: src/components/[category-id]/[group-id]/

Requirements:
1. Implement CSS variant in: [group-id]/css/[ComponentName].tsx
2. Implement Framer Motion variant in: [group-id]/framer/[ComponentName].tsx
3. Export metadata from each component
4. Update group index.ts to include new animations
5. Update category index.ts if new group
6. Ensure prefers-reduced-motion support in both variants
7. Follow existing naming patterns
8. Add shared styles to group root if needed

Reference existing animation in same category:
[Provide file path to similar component as example]

BOTH variants must be implemented. Do not skip either.
```

**Validation:**
- [ ] CSS variant created at correct path
- [ ] Framer Motion variant created at correct path
- [ ] Both export metadata
- [ ] Group index.ts updated
- [ ] Category index.ts updated (if new group)
- [ ] Accessibility implemented
- [ ] No global CSS dependencies
- [ ] Follows registry pattern from CLAUDE.md

**STOP - Verify before proceeding:**

```bash
# Check both files exist
ls src/components/[category-id]/[group-id]/css/[ComponentName].tsx
ls src/components/[category-id]/[group-id]/framer/[ComponentName].tsx

# Check exports
grep "export const metadata" src/components/[category-id]/[group-id]/css/[ComponentName].tsx
grep "export const metadata" src/components/[category-id]/[group-id]/framer/[ComponentName].tsx
```

**RED FLAG:** If only one variant implemented → STOP → Complete missing variant before proceeding.

### Step D: Code Review (code-reviewer agent)

**MANDATORY: Review implementation before testing.**

Call code-reviewer agent with:
- Paths to both variant files
- Animation registry integration files
- Performance requirements
- Accessibility requirements

**Review focus areas:**
- Code quality and maintainability
- Performance (GPU-accelerated properties)
- Accessibility (prefers-reduced-motion)
- Registry integration correctness
- Naming consistency
- No global CSS pollution

**If issues found:**
1. Fix issues immediately
2. Re-run code review
3. Iterate until approved

**Validation:**
- [ ] Code review passes
- [ ] No performance anti-patterns
- [ ] Accessibility verified
- [ ] Registry integration correct

### Step E: Tests (testing-architect agent)

**MANDATORY: Write meaningful tests for both variants.**

Call testing-architect agent with:
- Paths to both variant files
- Animation behavior description
- Testing strategy from `docs/testing.md` (if exists)
- Existing test patterns (sample from similar animation)

**Prompt template for agent:**
```
Write tests for these animation components:

CSS variant: [file path]
Framer Motion variant: [file path]

Animation behavior: [description from ANIMATION_SPEC]

Requirements:
1. Tests must be meaningful (test actual functionality, not just rendering)
2. Tests must verify correct animation behavior
3. Tests must be deterministic (no flaky timing issues)
4. Test accessibility (prefers-reduced-motion behavior)
5. Follow existing test patterns in this project
6. Use appropriate testing framework (Vitest/Playwright)

Reference existing test:
[Provide path to similar animation test as example]

Write tests that verify:
- Component renders correctly
- Animation triggers as expected
- Accessibility behavior (reduced motion)
- Performance (no layout thrashing)
- Metadata export is correct
```

**Validation:**
- [ ] Tests written for both variants
- [ ] Tests are meaningful (not just smoke tests)
- [ ] Tests verify animation behavior
- [ ] Tests check accessibility
- [ ] Tests are deterministic

**FORBIDDEN:**
- ❌ Tests that only check rendering
- ❌ Tests with arbitrary delays (use condition polling)
- ❌ Tests that don't verify actual functionality

### Step F: Run Tests & Fix

**MANDATORY: Tests must pass before proceeding.**

**Run tests:**
```bash
# Run all tests
npm run test

# Or run specific test file
npm run test -- [test-file-path]
```

**If tests fail:**
1. Analyze failure output
2. Use sequential thinking to diagnose root cause
3. Fix implementation or tests
4. Re-run tests
5. Iterate until green

**Validation:**
- [ ] All tests pass (0 failures)
- [ ] No test warnings
- [ ] No flaky behavior (run 3x to confirm)

**RED FLAG:** If tests fail after 3 fix attempts → STOP → Use debugging workflow or ask for help.

### Step G: Registry & Documentation

**MANDATORY: Ensure animation is discoverable and documented.**

**Check registry integration:**

```bash
# Verify animation appears in registry
grep -r "[animation-id]" src/components/animationRegistry.ts

# Verify metadata exports
grep -r "export const metadata" src/components/[category-id]/[group-id]/
```

**Update documentation (following CIB-003):**

```
STOP - Do not touch any .md file yet

1. Check: "Is this file in the canonical documentation registry?"
   - docs/architecture.md
   - docs/animation-short.md
   - docs/testing.md

   IF YES → Proceed to update it
   IF NO → Skip documentation update (catalog is self-documenting via metadata)

2. Check: "Does this involve dated/summary/status content?"
   IF YES → STOP → Don't create summary docs
```

**For this command:**
- Animation catalog is self-documenting (metadata exports)
- No summary docs needed
- Only update canonical docs if animation introduces new pattern

**Validation:**
- [ ] Animation registered correctly
- [ ] Metadata exports present
- [ ] No summary/report documents created

### Step H: Full Review & Next Round

**MANDATORY: Review all changes before claiming complete.**

**Review checklist:**
1. **Files created:**
   - [ ] CSS variant at correct path
   - [ ] Framer Motion variant at correct path
   - [ ] Tests written and passing
   - [ ] Registry updated

2. **Quality checks:**
   - [ ] Both variants work correctly
   - [ ] Accessibility implemented (prefers-reduced-motion)
   - [ ] Performance targets met (60fps)
   - [ ] Tests are meaningful
   - [ ] Code review passed

3. **Integration checks:**
   - [ ] Animation appears in catalog
   - [ ] Metadata exports correct
   - [ ] Naming follows conventions
   - [ ] No global CSS pollution

**Update TodoWrite:**
```
Animation [Round N] COMPLETE:
- ID: [category-group__variant]
- Files: [list paths]
- Tests: PASS
- Integration: ✓
```

**Mark round complete in TodoWrite.**

**Next round decision:**
- IF round < 10 AND user hasn't stopped → Start Step A for next animation
- IF round >= 10 → STOP → Session complete
- IF no viable ideas remain → STOP → Session complete

**Deliverable:** Complete, tested, integrated animation ready for use.

---

## Autonomous Decision Making

**Follow these principles:**

1. **In case of uncertainty:**
   - Use common sense
   - Follow existing patterns
   - Prefer performance over complexity
   - Prefer reusability over specificity

2. **Never ask user for permission** (autonomous mode)

3. **STOP and ask if:**
   - About to create new category (significant structural change)
   - Animation idea requires breaking existing patterns
   - Unsure if animation fits social casino context
   - Tests consistently fail with no clear solution
   - About to modify core registry structure

4. **Parallel work where safe:**
   - Can design next spec while implementing current (if confident in direction)
   - Can write tests while code review runs (if low risk)
   - BUT: Never skip validation gates

5. **Quality over quantity:**
   - Better to create 3 excellent animations than 10 mediocre ones
   - If idea doesn't meet constraints, generate different idea
   - If implementation has issues, fix them before proceeding

---

## Animation Idea Generation Guidelines

**High-value animation types for social casino/gamified UI:**

**Celebrations (wins, achievements):**
- Coin burst/scatter effects
- Level-up animations
- Badge unlock reveals
- Jackpot announces
- Streak milestone celebrations
- Victory flourishes

**Progress & Feedback:**
- XP bar fills with juice
- Progress ring animations
- Loading spinners (exciting, not boring)
- Countdown timers (with urgency)
- Completion checkmarks with celebration

**Reveals & Discoveries:**
- Card flip reveals
- Chest/box opening
- Prize wheel spins
- Mystery item unveils
- Reward cascades

**Interactive Feedback:**
- Button press effects (satisfying clicks)
- Chip/coin collect animations
- Drag feedback (chips, cards)
- Tap ripples (slot machine style)
- Hover effects (excitement preview)

**Transitions:**
- Modal entrances (dramatic, attention-grabbing)
- Page transitions (smooth, directional)
- Tab switches (seamless)
- Collapse/expand (smooth accordion)
- Slide-in panels

**Loss Mitigation (important!):**
- Gentle loss feedback (not punishing)
- "Almost won" near-miss effects
- Encouraging retry animations
- Soft rejection feedback

**Engagement Loops:**
- Daily bonus arrival
- Notification badges (with attention grab)
- Reminder pulses (gentle, not annoying)
- Streak flame animations
- Time-limited offer urgency

**Performance Priorities:**
1. Transform (translate, scale, rotate) - GPU accelerated ✅
2. Opacity - GPU accelerated ✅
3. Background-color - Acceptable for small elements
4. Box-shadow - Use sparingly
5. Filter, clip-path - ❌ Avoid (performance issues)

---

## No Token or Time Limit

**Important:**
- Never stop because of concerns about token or time limits
- Sole purpose of this workflow is autonomous animation generation
- There is no token or time limit
- Focus on quality and completeness
- Take time needed for each animation

---

## Session Completion

**Session ends when:**
1. User manually stops (CTRL+C or stop command)
2. Maximum rounds reached (default 10)
3. No viable animation ideas remain (exhausted opportunities)

**Final session summary (update TodoWrite):**
```
ANIMGEN Session Complete:
- Total rounds: [N]
- Animations created: [N]
- Categories touched: [list]
- Groups added/enhanced: [list]
- Tests written: [N]
- All tests passing: ✓
```

**Final statement:**
"Animation generation session complete. Created [N] animations across [N] rounds. All animations tested and integrated. Catalog updated."

Remember: Quality animations that enhance user experience. Evidence before claims. Always.
