# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

DadOps Dashboard MVP - A Next.js 14 (App Router) "Mission Control" dashboard for expectant fathers. Expands on an existing birth cost calculator deployed at dadops.one with budget tracking, task roadmap, and financial planning features.

**Current Status:** MVP Complete. Dashboard with budget tracking, task roadmap, insurance comparison, and financial planning features.

## Tech Stack

- **Framework:** Next.js 14 with App Router
- **Styling:** Tailwind CSS (dark mode only)
- **Icons:** Material Symbols Outlined (via Google Fonts)
- **Font:** Inter
- **State:** localStorage (Supabase planned for v2)

## Design System

Colors (Tailwind classes):
- Primary: `emerald-500` (#10B981)
- Background: `gray-900` (#111827)
- Card: `gray-800` (#1F2937)
- Border: `gray-700`

Category colors for tasks/budget:
- Medical: `blue-500`
- Finance: `green-500`
- Gear: `purple-500`
- Home/Nursery: `teal-500`
- Childcare: `orange-500`
- Admin: `gray-500`
- Preparation: `pink-500`

## Key Files

**Documentation:**
- `docs/Implementation_plan_v2.md` - Complete build specification with code examples
- `Staging_Area/Mockups/*.png` - Visual design references
- `Staging_Area/Mockups/*.html` - Interactive HTML prototypes

**Core Library:**
- `src/lib/types.ts` - TypeScript interfaces (UserData, Task, BudgetCategory, InsurancePlan, PlanComparison)
- `src/lib/calculations.ts` - Insurance cost calculation logic
- `src/lib/dashboardUtils.ts` - Dashboard utilities (costs, countdown, budget totals, trimester dates)
- `src/lib/compareUtils.ts` - Plan comparison utilities (comparePlans, getRecommendedPlan)
- `src/lib/constants.ts` - Month names, currency formatting
- `src/lib/encoding.ts` - URL token encoding/decoding for calculator data

**Compare Feature:**
- `src/app/dashboard/compare/page.tsx` - Insurance comparison page
- `src/components/compare/PlanForm.tsx` - Insurance plan input form
- `src/components/compare/ComparisonResults.tsx` - Comparison results display

**Staging (Reference):**
- `Staging_Area/calculations.ts` - Original calculation logic reference
- `Staging_Area/encoding.ts` - Original encoding reference
- `Staging_Area/constants.ts` - Original constants reference

## Architecture Notes

**Data Flow:**
1. User completes onboarding (due date + insurance details)
2. Calculator computes `effectiveCost`, `monthlySavingsTarget`, etc.
3. Data stored in localStorage under `dadops_user`, `dadops_tasks`, `dadops_budget`
4. Dashboard components derive display values from stored data

**Key Calculations:**

From `src/lib/calculations.ts`:
- `calculatePlan()` - Computes annual premium, expected OOP, effective cost
- `calculateAllPlans()` - Calculates and ranks multiple plans
- `calculateMonthlySavingsTarget()` - Divides liability by months remaining
- Double deductible risk triggers when `dueMonth <= 3` (birth spans two plan years)

From `src/lib/dashboardUtils.ts`:
- `calculateCosts()` - Derives costs from user data for dashboard display
- `calculateCountdown()` - Days/weeks until due date
- `calculateCurrentWeek()` - Current pregnancy week (1-40)
- `calculateTotalBudget()` - Sums all budget category items for total liability
- `calculateTrimesterDates()` - Calculates 1st/2nd/3rd trimester start dates from due date

From `src/lib/compareUtils.ts`:
- `comparePlans()` - Compares multiple insurance plans with cost breakdown
- `getRecommendedPlan()` - Returns plan with lowest effective cost
- `calculateSavings()` - Calculates savings vs recommended plan

**State Management:**
- `useDashboardState` hook manages all localStorage interactions
- `useLocalStorage<T>` generic hook handles persistence
- Tasks and budget categories initialized with defaults on first onboarding

## Implemented Features

1. **Dashboard** (`/dashboard`) - Mission Control with countdown, stats, Mission Intelligence timeline
2. **Roadmap** (`/dashboard/roadmap`) - Tasks organized by trimester and category
3. **War Chest** (`/dashboard/war-chest`) - Budget tracking with category breakdown
4. **Compare Plans** (`/dashboard/compare`) - Side-by-side insurance plan comparison
5. **Settings** (`/dashboard/settings`) - Edit due date, insurance, and cash on hand
6. **Onboarding** (`/onboarding`) - Initial setup flow for new users

## Implementation Order (Reference)

Original phases from `docs/Implementation_plan_v2.md`:
1. Foundation (types, hooks, storage, defaults)
2. Dashboard layout with sidebar/mobile nav
3. Main dashboard page with stats and countdown
4. Roadmap page (tasks by trimester/category)
5. War Chest page (budget tracking)
6. Settings and onboarding flow
7. Compare Plans page (insurance comparison)

## Build Commands

```bash
npm run dev      # Development server
npm run build    # Production build
npm run lint     # ESLint
```