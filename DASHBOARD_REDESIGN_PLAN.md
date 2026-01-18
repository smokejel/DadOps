# DadOps Dashboard Redesign Plan

## Executive Summary

Transform the existing Results page from a simple "plan comparison table" into a "Mission Control Dashboard" that delivers the feeling of control expecting dads are seeking. This is NOT a new product—it's a presentation layer redesign of existing functionality.

**Key Insight**: The calculator is the input method. The dashboard is the output visualization.

---

## Strategic Context

### The Problem

Reddit feedback on the calculator-only launch:
> "Is the purpose to compare insurance plans, or is the purpose to plan for costs? By the time you're expecting, it may be too late to switch plans."

> "I would try to find more actionable insight for users who already know what insurance they're going with."

### The Validated Solution

Customer interviews (5 conversations) validated the dashboard concept:

> "I love like the immediate dashboard of like here time until deployment right up there... Your immediate priority tasks like, don't forget that you need to do this." — Customer 1

> "It would be very helpful to have a tool where you go in, input the information about your plan... and at least gives you an idea of how much it's going to cost you and maybe start budgeting for that." — Customer 2

> "$19.99... That is a price that I would have gladly paid to at least put that decision to rest." — Customer 2 (price validation)

### The Reframe

| Old Frame | New Frame |
|-----------|-----------|
| "Plan comparison calculator" | "Financial Command Center for the birth year" |
| "Which plan wins?" | "Here's your target and how to hit it" |
| Utility | Identity ("Dad as COO") |

---

## Implementation Scope

### What We're Building

A redesigned Results page that looks like the dashboard mockups, populated ONLY with financial data we already calculate. No new backend, no user auth, no database.

### What We're NOT Building (Yet)

- User accounts / authentication
- Database storage
- Full task management system
- Gear/inventory tracking
- Hospital go-bag checklist logic

These appear as **locked/teaser modules** to validate demand.

---

## Technical Implementation

### Phase 1: Single Plan Mode (2-3 hours)

Add a toggle to the calculator form for users who already have their plan selected.

**File**: `app/page.tsx` (Calculator form section)

**Changes**:
1. Add toggle/radio: "I'm comparing plans" vs "I know my plan"
2. When "I know my plan" selected:
   - Show only Plan 1 inputs
   - Hide Plan 2/3 inputs
   - Change CTA to "Calculate My Costs"

**File**: `lib/calculations.ts`

**Add function**:
```typescript
export function calculateMonthlySavingsTarget(
  totalLiability: number,
  dueDate: { month: number; year: number },
  currentDate: Date = new Date()
): number {
  // Calculate months until due date
  const dueDateTime = new Date(dueDate.year, dueDate.month - 1, 15);
  const monthsRemaining = Math.max(1, 
    (dueDateTime.getFullYear() - currentDate.getFullYear()) * 12 +
    (dueDateTime.getMonth() - currentDate.getMonth())
  );
  
  return Math.ceil(totalLiability / monthsRemaining);
}
```

**File**: `lib/encoding.ts`

**Update token structure** to include:
```typescript
interface CalculatorData {
  dueMonth: number;
  dueYear: number;
  mode: 'compare' | 'single'; // NEW
  plans: PlanData[];
}
```

### Phase 2: Results Page Redesign (4-6 hours)

Transform the Results page into a dashboard layout.

**File**: `components/results/FullResults.tsx`

**Current Structure**:
```
┌─────────────────────────────┐
│ Winner: Plan A              │
│ You save: $1,200            │
│ [Comparison Table]          │
│ [Math Breakdown]            │
└─────────────────────────────┘
```

**New Structure**:
```
┌─────────────────────────────────────────────────────────┐
│ MISSION STATUS: ACTIVE                                  │
│ ⏱️ 24 Weeks, 3 Days Until Deployment                    │
│    Trimester 2 • Target Date: July 15, 2026            │
│ ════════════════════════════════════════ [progress bar] │
├───────────────┬───────────────┬─────────────────────────┤
│ 💰            │ 🎯            │ 📊                      │
│ YOUR TARGET   │ MONTHLY GOAL  │ FINANCIAL READINESS     │
│ $8,200        │ $1,171/mo     │ On Track ✓              │
│ Total Birth   │ to be ready   │                         │
│ Year Cost     │ by July       │                         │
├───────────────┴───────────────┴─────────────────────────┤
│ 📅 KEY FINANCIAL DATES                                  │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ • Jan 1, 2026: Deductible resets (⚠️ if applicable) │ │
│ │ • Jul 15, 2026: Expected OOP max hit               │ │
│ │ • Aug 14, 2026: Add baby to insurance (30-day deadline) │
│ └─────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────┤
│ 📋 COST BREAKDOWN                     [Expand/Collapse] │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Annual Premiums:        $4,800 ($400 × 12)         │ │
│ │ Expected Out-of-Pocket: $3,400                     │ │
│ │ Employer HSA:          -$0                         │ │
│ │ ─────────────────────────────────────              │ │
│ │ TOTAL LIABILITY:        $8,200                     │ │
│ └─────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────┤
│ [IF COMPARE MODE: Show winner card + comparison table]  │
├─────────────────────────────────────────────────────────┤
│ 🔒 MORE TOOLS COMING SOON                               │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐ │
│ │ 📅 DEPLOYMENT│ │ 🎒 HOSPITAL │ │ ✅ READINESS        │ │
│ │ TIMELINE    │ │ GO-BAG      │ │ SCORE              │ │
│ │ Coming Q2   │ │ Coming Q2   │ │ Coming Q2          │ │
│ │ [Notify Me] │ │ [Notify Me] │ │ [Notify Me]        │ │
│ └─────────────┘ └─────────────┘ └─────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### New/Modified Components

**Create**: `components/dashboard/CountdownHeader.tsx`
```typescript
interface CountdownHeaderProps {
  dueMonth: number;
  dueYear: number;
}

// Displays:
// - "X Weeks, Y Days Until Deployment"
// - Trimester indicator
// - Progress bar
// - Mission Status badge
```

**Create**: `components/dashboard/FinancialTargetCard.tsx`
```typescript
interface FinancialTargetCardProps {
  totalLiability: number;
  monthlySavingsGoal: number;
  dueDate: { month: number; year: number };
}

// Displays the big numbers: total target + monthly savings goal
```

**Create**: `components/dashboard/KeyDatesTimeline.tsx`
```typescript
interface KeyDatesTimelineProps {
  dueMonth: number;
  dueYear: number;
  hasDoubleDeductible: boolean;
}

// Displays:
// - Jan 1 deductible reset (if double deductible scenario)
// - Due date (expected OOP max hit)
// - 30 days after due date (add baby deadline)
```

**Create**: `components/dashboard/CostBreakdownCard.tsx`
```typescript
interface CostBreakdownCardProps {
  plan: PlanResult;
  isExpanded?: boolean;
}

// Collapsible breakdown of the math
```

**Modify**: `components/dashboard/LockedModuleCard.tsx`
- Already exists, but ensure click tracking is working
- Add "Notify Me" button that triggers ConvertKit signup with `interested_feature` tag

**Modify**: `components/results/FullResults.tsx`
- Import and compose all new dashboard components
- Handle both 'single' and 'compare' modes
- Keep existing comparison table for compare mode, but nested within dashboard layout

### Phase 3: Teaser Page Update (1-2 hours)

Update `TeaserResults.tsx` to show a blurred version of the new dashboard layout (not just the comparison table).

**Key elements to show (blurred)**:
- Countdown header (visible, not blurred - this hooks them)
- Financial target card (blurred numbers)
- Key dates (blurred)
- Locked modules (visible - shows product vision)

**Paywall CTA Update**:
- Old: "Unlock Your Full Results"
- New: "Unlock Your Mission Control Dashboard"

---

## File Changes Summary

| File | Action | Priority |
|------|--------|----------|
| `app/page.tsx` | Add single/compare mode toggle | P1 |
| `lib/calculations.ts` | Add `calculateMonthlySavingsTarget()` | P1 |
| `lib/encoding.ts` | Add `mode` to token structure | P1 |
| `components/dashboard/CountdownHeader.tsx` | Create | P1 |
| `components/dashboard/FinancialTargetCard.tsx` | Create | P1 |
| `components/dashboard/KeyDatesTimeline.tsx` | Create | P1 |
| `components/dashboard/CostBreakdownCard.tsx` | Create | P2 |
| `components/results/FullResults.tsx` | Major redesign | P1 |
| `components/results/TeaserResults.tsx` | Update layout | P2 |
| `components/dashboard/LockedModuleCard.tsx` | Add notify button | P2 |

---

## Design Specifications

### Colors (from existing design system)

- Primary Green: `#22C55E` (buttons, accents, progress)
- Warning Amber: `#F59E0B` (double deductible alerts)
- Background Light: `#f6f8f7`
- Background Dark: `#122017`
- Surface Dark: `#1a2c23`

### Typography

- Countdown number: `text-5xl font-black` (like "24 Weeks, 3 Days")
- Card headers: `text-sm font-semibold uppercase tracking-wide text-gray-500`
- Big numbers: `text-3xl font-bold`
- Body: `text-base`

### Component Patterns

- Cards: `rounded-xl border border-gray-200 bg-white p-6 shadow-sm`
- Dark mode: Full support (already in design system)
- Progress bar: Green fill, gray background, rounded ends
- Locked modules: Green-tinted icons, dashed border, "Coming Q2" badge

### Responsive Behavior

- Desktop: 3-column grid for stat cards, 3-column for locked modules
- Tablet: 2-column grid
- Mobile: Single column stack

---

## Analytics Events to Add

Track these events via existing Vercel Analytics integration:

| Event | Trigger | Parameters |
|-------|---------|------------|
| `mode_selected` | User picks single/compare mode | `mode: 'single' \| 'compare'` |
| `savings_goal_viewed` | Dashboard renders with savings goal | `monthly_goal`, `total_liability` |
| `key_dates_viewed` | Key dates section renders | `has_double_deductible` |
| `locked_module_notify` | User clicks "Notify Me" on locked module | `module_name` |

---

## Testing Scenarios

### Single Plan Mode
1. Select "I know my plan" toggle
2. Enter single plan details + due date
3. Submit calculator
4. Verify: Dashboard shows liability + monthly savings goal (no comparison)

### Compare Mode (Existing + Enhanced)
1. Select "I'm comparing plans" toggle
2. Enter 2-3 plans + due date
3. Submit calculator
4. Verify: Dashboard shows winner + comparison + savings goal for winning plan

### Double Deductible Scenario
1. Enter due date in January-March
2. Verify: Warning banner appears
3. Verify: Key dates timeline shows Jan 1 deductible reset prominently
4. Verify: Liability calculation includes deductible + OOP max

### Countdown Accuracy
1. Enter various due dates
2. Verify: Weeks/days countdown is accurate
3. Verify: Trimester indicator is correct
4. Verify: Progress bar reflects time elapsed

### Locked Module Clicks
1. Click each locked module
2. Verify: Toast notification appears
3. Verify: Analytics event fires
4. Click "Notify Me" button
5. Verify: ConvertKit modal or inline signup appears

---

## Success Metrics

After launch, track:

1. **Conversion rate**: Does dashboard layout improve teaser → paid conversion?
2. **Time on page**: Do users spend more time on dashboard results?
3. **Locked module clicks**: Which features have highest demand?
4. **Single vs Compare mode split**: What % use single plan mode?
5. **Reddit/social feedback**: Does "command center" framing resonate?

---

## Post-Launch: Reddit Response Template

After shipping, respond to the Reddit feedback:

> "Thanks for this feedback - you were right. I just shipped an update that reframes this as a 'Financial Command Center' rather than just a plan comparison tool.
>
> **New features:**
> - 'Single plan mode' for those who already have their coverage locked in
> - Monthly savings target based on your due date ('Save $X/month to be ready by July')
> - Key dates timeline (deductible reset, add-baby deadline)
> - Dashboard-style results that give you the full picture
>
> Would love your thoughts on v2: [dadops.one](https://dadops.one)"

---

## Reference Files

- Original mockups: `/mnt/user-data/uploads/Screen1_Web.png`, `Screen2_Web.png`, `Screen3_Web.png`
- Current codebase docs: `CLAUDE.md`, `README.md`
- Calculation logic: `lib/calculations.ts`
- Results components: `components/results/`, `components/dashboard/`
