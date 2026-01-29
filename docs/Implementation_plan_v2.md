# DadOps Dashboard MVP - Implementation Plan

> **For Claude Code:** This document contains the complete specification for building the DadOps Dashboard MVP. Execute phases in order. Reference the mockup images provided for visual design.

---

## Project Context

**Existing App:** Next.js 14 (App Router) birth cost calculator deployed on Vercel at dadops.one

**What We're Building:** A "Mission Control" dashboard that expands the post-calculator experience with:
- Dashboard (financial overview + countdown)
- War Chest (budget tracking by category)
- Roadmap (task checklist organized by trimester)
- Settings (edit profile, reset data)

**Entry Point:** After calculator completion → redirect to `/dashboard`

**Data Persistence:** localStorage (Supabase migration planned for v2)

---

## Design References

Three mockup files are provided:
1. `Dark_Mode_dadops_mission_control_dashboard.png` - Main dashboard
2. `Dark_Mode_baby_prep_budget_tracker.png` - War Chest/Budget page
3. `Dark_Mode_baby_prep_roadmap___checklist.png` - Roadmap page

**Design System:**
- Dark mode only
- Primary green: `#10B981` (Tailwind `emerald-500`)
- Background: `#111827` (Tailwind `gray-900`)
- Card background: `#1F2937` (Tailwind `gray-800`)
- Font: Inter
- Icons: Material Symbols Outlined

**Category Colors:**
- Medical: `#3B82F6` (blue)
- Gear: `#A855F7` (purple)
- Nursery/Home: `#14B8A6` (teal)
- Childcare: `#F97316` (orange)
- Finance: `#22C55E` (green)
- Admin: `#6B7280` (gray)
- Preparation: `#EC4899` (pink)

---

## File Structure

Create these new files:

```
app/
├── dashboard/
│   ├── page.tsx                    # Main dashboard
│   ├── layout.tsx                  # Dashboard layout with sidebar
│   ├── war-chest/
│   │   └── page.tsx               # Budget tracking
│   ├── roadmap/
│   │   └── page.tsx               # Task roadmap
│   └── settings/
│       └── page.tsx               # Settings page
├── onboarding/
│   └── page.tsx                   # 2-step onboarding form

components/
├── dashboard/
│   ├── Sidebar.tsx                # Desktop sidebar navigation
│   ├── MobileNav.tsx              # Mobile bottom navigation
│   ├── CountdownCard.tsx          # Mission status + countdown
│   ├── StatsCards.tsx             # 3 stat cards row
│   ├── MissionIntelligence.tsx    # Key dates timeline
│   ├── CostBreakdown.tsx          # Cost breakdown panel
│   ├── UpcomingTasks.tsx          # Next 5 tasks preview
│   └── WarChestGauge.tsx          # Cash vs Liability gauge
├── war-chest/
│   ├── SummaryCards.tsx           # Total/Spent/Remaining
│   ├── CategoryCard.tsx           # Expandable category
│   ├── LineItemRow.tsx            # Budget item row
│   └── AddItemModal.tsx           # Add item modal
├── roadmap/
│   ├── ProgressCard.tsx           # Overall progress
│   ├── TrimesterSection.tsx       # Trimester task group
│   ├── CategorySection.tsx        # Category task group
│   ├── TaskRow.tsx                # Individual task row
│   ├── ViewToggle.tsx             # Trimester/Category toggle
│   └── AddTaskModal.tsx           # Add task modal

lib/
├── types.ts                       # TypeScript interfaces
├── storage.ts                     # localStorage constants
├── defaultTasks.ts                # 30 starter tasks with consequences
├── defaultBudget.ts               # 4 budget categories

hooks/
├── useLocalStorage.ts             # Generic localStorage hook
└── useDashboardState.ts           # Main state management
```

---

## Phase 1: Foundation

### 1.1 Create Type Definitions

**File:** `lib/types.ts`

```typescript
// User profile from onboarding
export interface UserData {
  dueDate: {
    month: number  // 1-12
    year: number   // e.g., 2026
    day?: number   // 1-31, optional
  }
  insurance: {
    planName: string
    monthlyPremium: number
    familyDeductible: number
    familyOopMax: number
    employerHsa: number
  }
  cashOnHand?: number  // User-entered savings for War Chest gauge
  createdAt: string
}

// Calculated from UserData (derived, not stored)
export interface CalculatedCosts {
  annualPremium: number
  expectedOop: number
  totalCost: number
  effectiveCost: number
  monthlySavingsTarget: number
  monthsRemaining: number
  doubleDeductibleRisk: boolean
}

// Task for Roadmap
export interface Task {
  id: string
  title: string
  description: string
  category: TaskCategory
  trimester: 1 | 2 | 3
  weekDue: number  // 1-40
  completed: boolean
  userAdded: boolean
  // High-stakes task fields
  deadline?: string       // e.g., "Birth + 30 days"
  consequence?: string    // e.g., "$0 coverage if missed"
  isHighStakes?: boolean
}

export type TaskCategory = 
  | 'Medical' 
  | 'Finance' 
  | 'Gear' 
  | 'Home' 
  | 'Childcare' 
  | 'Admin' 
  | 'Preparation'

// Budget category for War Chest
export interface BudgetCategory {
  id: string
  name: string
  description: string
  icon: string  // Material Symbols icon name
  color: CategoryColor
  items: BudgetItem[]
}

export interface BudgetItem {
  id: string
  name: string
  estimated: number
  actual: number | null
  purchased: boolean
  note?: string
}

export type CategoryColor = 'blue' | 'purple' | 'teal' | 'orange' | 'green' | 'gray' | 'pink'

// Category styling map
export interface CategoryStyle {
  bg: string        // Background class
  text: string      // Text color class
  icon: string      // Material Symbols icon
  border: string    // Border class
  progress: string  // Progress bar class
}
```

### 1.2 Create localStorage Hook

**File:** `hooks/useLocalStorage.ts`

```typescript
'use client'

import { useState, useEffect, useCallback } from 'react'

export function useLocalStorage<T>(
  key: string, 
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, boolean] {
  const [storedValue, setStoredValue] = useState<T>(initialValue)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key)
      if (item) {
        setStoredValue(JSON.parse(item))
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
    }
    setIsLoaded(true)
  }, [key])

  // Save to localStorage
  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      if (valueToStore === null) {
        window.localStorage.removeItem(key)
      } else {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }, [key, storedValue])

  return [storedValue, setValue, isLoaded]
}
```

### 1.3 Create Storage Constants

**File:** `lib/storage.ts`

```typescript
export const STORAGE_KEYS = {
  user: 'dadops_user',
  tasks: 'dadops_tasks', 
  budget: 'dadops_budget',
} as const
```

### 1.4 Create Default Tasks

**File:** `lib/defaultTasks.ts`

```typescript
import { Task, TaskCategory, CategoryStyle } from './types'

export const CATEGORY_STYLES: Record<TaskCategory, CategoryStyle> = {
  Medical: {
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
    icon: 'medical_services',
    border: 'border-blue-500/30',
    progress: 'bg-blue-500',
  },
  Finance: {
    bg: 'bg-green-500/10',
    text: 'text-green-400',
    icon: 'attach_money',
    border: 'border-green-500/30',
    progress: 'bg-green-500',
  },
  Gear: {
    bg: 'bg-purple-500/10',
    text: 'text-purple-400',
    icon: 'shopping_bag',
    border: 'border-purple-500/30',
    progress: 'bg-purple-500',
  },
  Home: {
    bg: 'bg-teal-500/10',
    text: 'text-teal-400',
    icon: 'home',
    border: 'border-teal-500/30',
    progress: 'bg-teal-500',
  },
  Childcare: {
    bg: 'bg-orange-500/10',
    text: 'text-orange-400',
    icon: 'child_care',
    border: 'border-orange-500/30',
    progress: 'bg-orange-500',
  },
  Admin: {
    bg: 'bg-gray-500/10',
    text: 'text-gray-400',
    icon: 'description',
    border: 'border-gray-500/30',
    progress: 'bg-gray-500',
  },
  Preparation: {
    bg: 'bg-pink-500/10',
    text: 'text-pink-400',
    icon: 'checklist',
    border: 'border-pink-500/30',
    progress: 'bg-pink-500',
  },
}

export const DEFAULT_TASKS: Task[] = [
  // ============ TRIMESTER 1 (Weeks 1-12) ============
  {
    id: 't1-1',
    title: 'Start prenatal vitamins',
    description: 'Begin taking folic acid and prenatal vitamins daily.',
    category: 'Medical',
    trimester: 1,
    weekDue: 4,
    completed: false,
    userAdded: false,
  },
  {
    id: 't1-2',
    title: 'Schedule first prenatal appointment',
    description: 'Book appointment with OB/GYN or midwife for 8-week visit.',
    category: 'Medical',
    trimester: 1,
    weekDue: 6,
    completed: false,
    userAdded: false,
  },
  {
    id: 't1-3',
    title: 'Review health insurance coverage',
    description: 'Understand deductibles, OOP max, and maternity coverage details.',
    category: 'Finance',
    trimester: 1,
    weekDue: 8,
    completed: false,
    userAdded: false,
    isHighStakes: true,
    deadline: 'Before major medical bills',
    consequence: 'Unexpected $10K+ bills if coverage gaps exist',
  },
  {
    id: 't1-4',
    title: 'Start emergency fund',
    description: 'Begin saving for baby-related expenses. Target: 3-6 months expenses.',
    category: 'Finance',
    trimester: 1,
    weekDue: 8,
    completed: false,
    userAdded: false,
  },
  {
    id: 't1-5',
    title: 'Research hospital vs birthing center',
    description: 'Compare options, costs, and policies for delivery location.',
    category: 'Medical',
    trimester: 1,
    weekDue: 10,
    completed: false,
    userAdded: false,
  },
  {
    id: 't1-6',
    title: 'Review life insurance needs',
    description: 'Consider term life policies for both parents.',
    category: 'Finance',
    trimester: 1,
    weekDue: 10,
    completed: false,
    userAdded: false,
  },
  {
    id: 't1-7',
    title: 'Research parental leave policies',
    description: "Understand your employer's leave policy and FMLA rights.",
    category: 'Admin',
    trimester: 1,
    weekDue: 12,
    completed: false,
    userAdded: false,
    isHighStakes: true,
    deadline: 'Before requesting leave',
    consequence: 'May lose paid leave benefits if not properly requested',
  },

  // ============ TRIMESTER 2 (Weeks 13-26) ============
  {
    id: 't2-1',
    title: 'Research daycare options',
    description: 'Get on waitlists early - some have 12+ month waits.',
    category: 'Childcare',
    trimester: 2,
    weekDue: 16,
    completed: false,
    userAdded: false,
    isHighStakes: true,
    deadline: 'ASAP - waitlists are long',
    consequence: 'No childcare spot when you return to work',
  },
  {
    id: 't2-2',
    title: 'Start baby registry',
    description: 'Create registry and research essential gear.',
    category: 'Gear',
    trimester: 2,
    weekDue: 18,
    completed: false,
    userAdded: false,
  },
  {
    id: 't2-3',
    title: 'Research life insurance',
    description: 'Comparison shop term life policies for both parents.',
    category: 'Finance',
    trimester: 2,
    weekDue: 18,
    completed: false,
    userAdded: false,
  },
  {
    id: 't2-4',
    title: 'Buy crib & mattress',
    description: 'Estimated cost: $300-600. Check CPSC safety standards.',
    category: 'Gear',
    trimester: 2,
    weekDue: 20,
    completed: false,
    userAdded: false,
  },
  {
    id: 't2-5',
    title: 'Anatomy scan (20-week ultrasound)',
    description: 'Major prenatal screening appointment.',
    category: 'Medical',
    trimester: 2,
    weekDue: 20,
    completed: false,
    userAdded: false,
  },
  {
    id: 't2-6',
    title: 'Pre-register at hospital',
    description: 'Complete paperwork before delivery day chaos.',
    category: 'Medical',
    trimester: 2,
    weekDue: 20,
    completed: false,
    userAdded: false,
  },
  {
    id: 't2-7',
    title: 'Paint nursery',
    description: 'Select low-VOC paint. Complete before 3rd trimester.',
    category: 'Home',
    trimester: 2,
    weekDue: 22,
    completed: false,
    userAdded: false,
  },
  {
    id: 't2-8',
    title: 'Sign up for childbirth class',
    description: 'Most classes fill up - book early.',
    category: 'Preparation',
    trimester: 2,
    weekDue: 20,
    completed: false,
    userAdded: false,
  },
  {
    id: 't2-9',
    title: 'Interview pediatricians',
    description: 'Meet with 2-3 pediatricians before choosing.',
    category: 'Medical',
    trimester: 2,
    weekDue: 24,
    completed: false,
    userAdded: false,
  },
  {
    id: 't2-10',
    title: 'Update will and beneficiaries',
    description: 'Legal documents to update for new family member.',
    category: 'Finance',
    trimester: 2,
    weekDue: 22,
    completed: false,
    userAdded: false,
  },
  {
    id: 't2-11',
    title: 'Purchase car seat',
    description: 'Required for hospital discharge. Budget: $200-400.',
    category: 'Gear',
    trimester: 2,
    weekDue: 24,
    completed: false,
    userAdded: false,
  },
  {
    id: 't2-12',
    title: 'Schedule hospital tour',
    description: 'Know where to go and what to expect on delivery day.',
    category: 'Preparation',
    trimester: 2,
    weekDue: 24,
    completed: false,
    userAdded: false,
  },

  // ============ TRIMESTER 3 (Weeks 27-40) ============
  {
    id: 't3-1',
    title: 'Glucose screening test',
    description: 'Standard gestational diabetes screening.',
    category: 'Medical',
    trimester: 3,
    weekDue: 28,
    completed: false,
    userAdded: false,
  },
  {
    id: 't3-2',
    title: 'Submit FMLA paperwork',
    description: 'File required forms with HR.',
    category: 'Admin',
    trimester: 3,
    weekDue: 30,
    completed: false,
    userAdded: false,
    isHighStakes: true,
    deadline: '30 days before leave starts',
    consequence: 'Leave may be denied or unpaid if filed late',
  },
  {
    id: 't3-3',
    title: 'Set up nursery',
    description: 'Assemble furniture, organize supplies.',
    category: 'Home',
    trimester: 3,
    weekDue: 32,
    completed: false,
    userAdded: false,
  },
  {
    id: 't3-4',
    title: 'Wash baby clothes and bedding',
    description: 'Use fragrance-free detergent.',
    category: 'Home',
    trimester: 3,
    weekDue: 34,
    completed: false,
    userAdded: false,
  },
  {
    id: 't3-5',
    title: 'Stock up on diapers and wipes',
    description: "Newborn and Size 1 diapers. Don't overbuy one size.",
    category: 'Gear',
    trimester: 3,
    weekDue: 34,
    completed: false,
    userAdded: false,
  },
  {
    id: 't3-6',
    title: 'Pack hospital bag',
    description: 'Essentials for mom, dad, and baby.',
    category: 'Preparation',
    trimester: 3,
    weekDue: 35,
    completed: false,
    userAdded: false,
  },
  {
    id: 't3-7',
    title: 'Install car seat',
    description: 'Get it inspected at local fire station or hospital.',
    category: 'Gear',
    trimester: 3,
    weekDue: 36,
    completed: false,
    userAdded: false,
    isHighStakes: true,
    deadline: 'Before labor begins',
    consequence: 'Hospital will not discharge baby without installed car seat',
  },
  {
    id: 't3-8',
    title: 'Group B strep test',
    description: 'Standard screening at 36 weeks.',
    category: 'Medical',
    trimester: 3,
    weekDue: 36,
    completed: false,
    userAdded: false,
  },
  {
    id: 't3-9',
    title: 'Prepare freezer meals',
    description: 'Stock up on easy meals for post-baby chaos.',
    category: 'Preparation',
    trimester: 3,
    weekDue: 36,
    completed: false,
    userAdded: false,
  },
  {
    id: 't3-10',
    title: 'Finalize baby name',
    description: 'Final decision time!',
    category: 'Preparation',
    trimester: 3,
    weekDue: 37,
    completed: false,
    userAdded: false,
  },
  {
    id: 't3-11',
    title: 'Review insurance for adding baby',
    description: 'Know the 30-day window to add baby after birth.',
    category: 'Finance',
    trimester: 3,
    weekDue: 34,
    completed: false,
    userAdded: false,
    isHighStakes: true,
    deadline: 'Birth + 30 days',
    consequence: '$0 insurance coverage for baby if window missed',
  },
  {
    id: 't3-12',
    title: 'Create emergency contact list',
    description: 'Phone numbers for pediatrician, hospital, family.',
    category: 'Preparation',
    trimester: 3,
    weekDue: 38,
    completed: false,
    userAdded: false,
  },
  {
    id: 't3-13',
    title: 'Confirm pediatrician for newborn visit',
    description: 'Schedule appointment within 3-5 days of birth.',
    category: 'Medical',
    trimester: 3,
    weekDue: 38,
    completed: false,
    userAdded: false,
  },
]
```

### 1.5 Create Default Budget Categories

**File:** `lib/defaultBudget.ts`

```typescript
import { BudgetCategory } from './types'

// Note: Medical category items are populated dynamically from calculator results
export const DEFAULT_BUDGET_CATEGORIES: BudgetCategory[] = [
  {
    id: 'medical',
    name: 'Medical',
    description: 'Insurance, hospital bills, OOP costs',
    icon: 'medical_services',
    color: 'blue',
    items: [], // Populated from calculator
  },
  {
    id: 'gear',
    name: 'Gear',
    description: 'Strollers, car seats, carriers',
    icon: 'shopping_bag',
    color: 'purple',
    items: [
      { id: 'gear-1', name: 'Car Seat', estimated: 350, actual: null, purchased: false },
      { id: 'gear-2', name: 'Stroller', estimated: 500, actual: null, purchased: false },
      { id: 'gear-3', name: 'Baby Monitor', estimated: 150, actual: null, purchased: false },
      { id: 'gear-4', name: 'Diaper Bag', estimated: 80, actual: null, purchased: false },
      { id: 'gear-5', name: 'Bottles & Feeding', estimated: 100, actual: null, purchased: false },
      { id: 'gear-6', name: 'Breast Pump', estimated: 0, actual: null, purchased: false, note: 'Often covered by insurance' },
    ],
  },
  {
    id: 'nursery',
    name: 'Nursery',
    description: 'Furniture, decor, setup',
    icon: 'crib',
    color: 'teal',
    items: [
      { id: 'nur-1', name: 'Crib', estimated: 350, actual: null, purchased: false },
      { id: 'nur-2', name: 'Crib Mattress', estimated: 150, actual: null, purchased: false },
      { id: 'nur-3', name: 'Dresser/Changing Table', estimated: 400, actual: null, purchased: false },
      { id: 'nur-4', name: 'Glider/Rocker', estimated: 400, actual: null, purchased: false },
      { id: 'nur-5', name: 'Bedding Set', estimated: 100, actual: null, purchased: false },
      { id: 'nur-6', name: 'Blackout Curtains', estimated: 80, actual: null, purchased: false },
      { id: 'nur-7', name: 'Sound Machine', estimated: 40, actual: null, purchased: false },
    ],
  },
  {
    id: 'childcare',
    name: 'Childcare',
    description: 'Daycare deposits, backup care',
    icon: 'child_care',
    color: 'orange',
    items: [
      { id: 'cc-1', name: 'Daycare Deposit', estimated: 500, actual: null, purchased: false },
      { id: 'cc-2', name: 'First Month Daycare', estimated: 1500, actual: null, purchased: false },
      { id: 'cc-3', name: 'Backup Care Fund', estimated: 300, actual: null, purchased: false },
    ],
  },
]

// Color classes for Tailwind
export const CATEGORY_COLOR_CLASSES: Record<string, { bg: string; text: string; progress: string; border: string }> = {
  blue: {
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
    progress: 'bg-blue-500',
    border: 'border-blue-500/30',
  },
  purple: {
    bg: 'bg-purple-500/10',
    text: 'text-purple-400',
    progress: 'bg-purple-500',
    border: 'border-purple-500/30',
  },
  teal: {
    bg: 'bg-teal-500/10',
    text: 'text-teal-400',
    progress: 'bg-teal-500',
    border: 'border-teal-500/30',
  },
  orange: {
    bg: 'bg-orange-500/10',
    text: 'text-orange-400',
    progress: 'bg-orange-500',
    border: 'border-orange-500/30',
  },
  green: {
    bg: 'bg-green-500/10',
    text: 'text-green-400',
    progress: 'bg-green-500',
    border: 'border-green-500/30',
  },
}
```

### 1.6 Create Main State Hook

**File:** `hooks/useDashboardState.ts`

```typescript
'use client'

import { useLocalStorage } from './useLocalStorage'
import { UserData, Task, BudgetCategory } from '@/lib/types'
import { STORAGE_KEYS } from '@/lib/storage'
import { DEFAULT_TASKS } from '@/lib/defaultTasks'
import { DEFAULT_BUDGET_CATEGORIES } from '@/lib/defaultBudget'

export function useDashboardState() {
  const [userData, setUserData, userLoaded] = useLocalStorage<UserData | null>(
    STORAGE_KEYS.user, 
    null
  )
  const [tasks, setTasks, tasksLoaded] = useLocalStorage<Task[] | null>(
    STORAGE_KEYS.tasks, 
    null
  )
  const [budget, setBudget, budgetLoaded] = useLocalStorage<BudgetCategory[] | null>(
    STORAGE_KEYS.budget, 
    null
  )

  const isLoaded = userLoaded && tasksLoaded && budgetLoaded
  const isOnboarded = userData !== null

  // Initialize with defaults when user completes onboarding
  const initializeUser = (user: UserData, calculatedCosts: { annualPremium: number; expectedOop: number; employerHsa: number }) => {
    setUserData(user)
    
    // Initialize tasks if not already set
    if (!tasks) {
      setTasks(DEFAULT_TASKS)
    }
    
    // Initialize budget with calculated medical costs
    if (!budget) {
      const medicalCategory: BudgetCategory = {
        id: 'medical',
        name: 'Medical',
        description: 'Insurance, hospital bills, OOP costs',
        icon: 'medical_services',
        color: 'blue',
        items: [
          { id: 'med-1', name: 'Annual Premiums', estimated: calculatedCosts.annualPremium, actual: null, purchased: false },
          { id: 'med-2', name: 'Out-of-Pocket Maximum', estimated: calculatedCosts.expectedOop, actual: null, purchased: false },
          { id: 'med-3', name: 'HSA/HRA Offset', estimated: -(calculatedCosts.employerHsa || 0), actual: null, purchased: false, note: 'Reduces your costs' },
        ],
      }
      setBudget([
        medicalCategory,
        ...DEFAULT_BUDGET_CATEGORIES.filter(c => c.id !== 'medical'),
      ])
    }
  }

  // === TASK ACTIONS ===
  
  const toggleTask = (taskId: string) => {
    if (!tasks) return
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ))
  }

  const addTask = (newTask: Omit<Task, 'id' | 'userAdded' | 'completed'>) => {
    if (!tasks) return
    const task: Task = {
      ...newTask,
      id: `custom-${Date.now()}`,
      userAdded: true,
      completed: false,
    }
    setTasks([...tasks, task])
  }

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    if (!tasks) return
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, ...updates } : task
    ))
  }

  const deleteTask = (taskId: string) => {
    if (!tasks) return
    setTasks(tasks.filter(task => task.id !== taskId))
  }

  // === BUDGET ACTIONS ===

  const toggleBudgetItem = (categoryId: string, itemId: string) => {
    if (!budget) return
    setBudget(budget.map(cat => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          items: cat.items.map(item =>
            item.id === itemId ? { ...item, purchased: !item.purchased } : item
          ),
        }
      }
      return cat
    }))
  }

  const updateBudgetItem = (categoryId: string, itemId: string, updates: Partial<BudgetCategory['items'][0]>) => {
    if (!budget) return
    setBudget(budget.map(cat => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          items: cat.items.map(item =>
            item.id === itemId ? { ...item, ...updates } : item
          ),
        }
      }
      return cat
    }))
  }

  const addBudgetItem = (categoryId: string, item: Omit<BudgetCategory['items'][0], 'id'>) => {
    if (!budget) return
    const newItem = {
      ...item,
      id: `${categoryId}-${Date.now()}`,
    }
    setBudget(budget.map(cat => {
      if (cat.id === categoryId) {
        return { ...cat, items: [...cat.items, newItem] }
      }
      return cat
    }))
  }

  const deleteBudgetItem = (categoryId: string, itemId: string) => {
    if (!budget) return
    setBudget(budget.map(cat => {
      if (cat.id === categoryId) {
        return { ...cat, items: cat.items.filter(item => item.id !== itemId) }
      }
      return cat
    }))
  }

  // === USER ACTIONS ===

  const updateCashOnHand = (amount: number) => {
    if (!userData) return
    setUserData({ ...userData, cashOnHand: amount })
  }

  const resetAllData = () => {
    setUserData(null)
    setTasks(null)
    setBudget(null)
  }

  return {
    // State
    userData,
    tasks,
    budget,
    isLoaded,
    isOnboarded,

    // User actions
    initializeUser,
    setUserData,
    updateCashOnHand,
    resetAllData,

    // Task actions
    toggleTask,
    addTask,
    updateTask,
    deleteTask,

    // Budget actions
    toggleBudgetItem,
    updateBudgetItem,
    addBudgetItem,
    deleteBudgetItem,
  }
}
```

---

## Phase 2: Dashboard Layout & Navigation

### 2.1 Dashboard Layout

**File:** `app/dashboard/layout.tsx`

Create a layout with:
- Desktop: Left sidebar (256px) + main content
- Mobile: Full-width content + bottom nav
- Check `isOnboarded` - redirect to `/onboarding` if false
- Dark background: `bg-gray-900`

```typescript
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useDashboardState } from '@/hooks/useDashboardState'
import Sidebar from '@/components/dashboard/Sidebar'
import MobileNav from '@/components/dashboard/MobileNav'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { isLoaded, isOnboarded } = useDashboardState()

  useEffect(() => {
    if (isLoaded && !isOnboarded) {
      router.push('/onboarding')
    }
  }, [isLoaded, isOnboarded, router])

  if (!isLoaded) {
    return <div className="min-h-screen bg-gray-900" /> // Loading state
  }

  if (!isOnboarded) {
    return null // Will redirect
  }

  return (
    <div className="flex min-h-screen bg-gray-900">
      <Sidebar />
      <main className="flex-1 pb-20 md:pb-0 overflow-y-auto">
        {children}
      </main>
      <MobileNav />
    </div>
  )
}
```

### 2.2 Sidebar Component

**File:** `components/dashboard/Sidebar.tsx`

**Reference:** Left sidebar in `Dark_Mode_dadops_mission_control_dashboard.png`

Elements:
- Logo + "DadOps" + "Mission Control" subtitle
- Nav items: Dashboard, Roadmap, War Chest, Settings
- Active state: green background + green text
- Bottom: "Log Expense" button (links to `/dashboard/war-chest`)

### 2.3 Mobile Nav Component

**File:** `components/dashboard/MobileNav.tsx`

**Reference:** Standard mobile bottom nav pattern

- Fixed to bottom
- 4 icons: Dashboard, Roadmap, War Chest, Settings
- Active state: green color

---

## Phase 3: Dashboard Page

### 3.1 Main Dashboard Page

**File:** `app/dashboard/page.tsx`

**Reference:** `Dark_Mode_dadops_mission_control_dashboard.png`

Layout sections (top to bottom):
1. `<CountdownCard />` - Mission status + countdown + progress bar
2. `<StatsCards />` - Target Liability, Monthly Goal, Timeline
3. Two-column grid:
   - Left: `<MissionIntelligence />` - Key dates timeline
   - Right: `<CostBreakdown />` - Cost breakdown
4. `<WarChestGauge />` - Cash on Hand vs Total Liability
5. `<UpcomingTasks />` - Next 5 tasks

### 3.2 CountdownCard Component

**File:** `components/dashboard/CountdownCard.tsx`

Calculate from `userData.dueDate`:
- Weeks and days until due date
- Task completion percentage (completed / total)

Elements:
- "MISSION STATUS: ACTIVE" badge with pulsing green dot
- "12 Weeks, 4 Days until Deployment" (large text)
- "Target Date: June 15, 2026"
- "Readiness Level" progress bar

### 3.3 StatsCards Component

**File:** `components/dashboard/StatsCards.tsx`

Three cards in a row. Use existing `calculations.ts` to compute values.

| Card | Label | Value | Subtext |
|------|-------|-------|---------|
| 1 | Target Liability | `effectiveCost` | "Total estimated cost" |
| 2 | Monthly Goal | `monthlySavingsTarget` | "+ $X above target" or "to be ready by [month]" |
| 3 | Timeline | `monthsRemaining` | "Remaining to save" |

### 3.4 MissionIntelligence Component

**File:** `components/dashboard/MissionIntelligence.tsx`

Vertical timeline with connecting line. Calculate dates from `userData.dueDate`.

Events:
1. Insurance Deductible Reset - Jan 1 of due year
2. Today - Current date (highlighted green)
3. 3rd Trimester Begins - Week 27
4. Deployment Day - Due date

### 3.5 CostBreakdown Component

**File:** `components/dashboard/CostBreakdown.tsx`

List with icons. Values from calculator.

| Item | Icon | Color | Value |
|------|------|-------|-------|
| Max Out-of-Pocket | medical_services | blue | `expectedOop` |
| Annual Premiums | payments | purple | `annualPremium` |
| HSA/HRA Offset | savings | green | `-employerHsa` |
| **Total Liability** | - | white | `effectiveCost` |

### 3.6 WarChestGauge Component

**File:** `components/dashboard/WarChestGauge.tsx`

**NEW COMPONENT** - Based on advisor feedback.

Elements:
- Label: "War Chest Status"
- Total Liability: `effectiveCost` (from calculator)
- Cash on Hand: Editable input field (stored in `userData.cashOnHand`)
- Gap: `cashOnHand - effectiveCost`
  - If negative: Red "Shortfall: $X"
  - If positive: Green "Surplus: $X"
- Visual: Progress bar showing cash as percentage of liability

### 3.7 UpcomingTasks Component

**File:** `components/dashboard/UpcomingTasks.tsx`

- Filter tasks: `!completed`
- Sort by: `weekDue` ascending
- Show first 5
- "View All" link → `/dashboard/roadmap`

Each row shows:
- Checkbox (clickable to toggle)
- Task title
- Category tag (colored)
- Week badge
- If `isHighStakes`: Show consequence in red

---

## Phase 4: Roadmap Page

### 4.1 Roadmap Page

**File:** `app/dashboard/roadmap/page.tsx`

**Reference:** `Dark_Mode_baby_prep_roadmap___checklist.png`

Layout:
1. Header: "Roadmap" + subtitle + view toggle + "Add Task" button
2. `<ProgressCard />` - Overall progress
3. Task sections (conditional on view mode):
   - By Trimester: 3 `<TrimesterSection />` components
   - By Category: Multiple `<CategorySection />` components

State:
- `viewMode: 'trimester' | 'category'`
- `showAddModal: boolean`

### 4.2 ProgressCard Component

**File:** `components/roadmap/ProgressCard.tsx`

Elements:
- "Total Progress" label
- Motivational text: "You're crushing it, Dad. Keep the momentum going."
- Large percentage: "27%"
- Progress bar
- "8 of 30 tasks complete"
- "Next milestone: Week 20 Ultrasound"

### 4.3 ViewToggle Component

**File:** `components/roadmap/ViewToggle.tsx`

Segmented control:
- "By Trimester" | "By Category"
- Selected state: white background, bold text
- Unselected: transparent, muted text

### 4.4 TrimesterSection Component

**File:** `components/roadmap/TrimesterSection.tsx`

Props: `trimester: 1 | 2 | 3`, `tasks: Task[]`, `currentWeek: number`

Elements:
- Header: "Trimester 1 (Weeks 1-12)"
- Status badge:
  - If current trimester + has incomplete tasks: "YOU ARE HERE" (green) + current week
  - If all complete: "COMPLETED"
  - If future: "UPCOMING"
- Green left border if current trimester
- List of `<TaskRow />` components

### 4.5 TaskRow Component

**File:** `components/roadmap/TaskRow.tsx`

**Reference:** Task rows in roadmap mockup

Elements:
- Checkbox (styled, green when checked)
- Title (strikethrough if completed)
- Description (smaller, muted)
- Category tag (colored badge with icon)
- Week badge ("Week 18")
- Delete button (only for `userAdded` tasks, hover reveal)

**High-stakes tasks:**
- Show `consequence` text in red below title
- Optionally add warning icon

### 4.6 AddTaskModal Component

**File:** `components/roadmap/AddTaskModal.tsx`

Modal overlay with form:
- Title (text input, required)
- Description (text input, optional)
- Category (dropdown with all categories)
- Week Due (number input 1-40, required)
- Cancel + "Add Task" buttons

---

## Phase 5: War Chest (Budget) Page

### 5.1 War Chest Page

**File:** `app/dashboard/war-chest/page.tsx`

**Reference:** `Dark_Mode_baby_prep_budget_tracker.png`

Layout:
1. Header: "War Chest" + "Add Item" button
2. `<SummaryCards />` - 3 cards
3. List of `<CategoryCard />` components (expandable)

### 5.2 SummaryCards Component

**File:** `components/war-chest/SummaryCards.tsx`

Three cards. Calculate from budget data.

| Card | Label | Value | Visual |
|------|-------|-------|--------|
| Total Budget | Sum of all `estimated` | "$19,900" | Full progress bar |
| Total Spent | Sum of all `actual` (non-null) | "$4,250" (21%) | Partial progress bar |
| Remaining | Budget - Spent | "$15,650" (green) | Green progress bar |

### 5.3 CategoryCard Component

**File:** `components/war-chest/CategoryCard.tsx`

**Reference:** Expandable category cards in budget mockup

Collapsed state:
- Icon (colored circle background)
- Name + description
- Progress: "$425 / $1,700" + percentage
- Progress bar (colored by category)
- Chevron

Expanded state:
- Same header
- Table with columns: Status | Item Name | Estimated | Actual Cost
- List of `<LineItemRow />` components
- "Add item to [Category]" button at bottom

### 5.4 LineItemRow Component

**File:** `components/war-chest/LineItemRow.tsx`

Elements:
- Checkbox (purchased status)
- Item name (strikethrough if purchased)
- Note (if present, smaller text)
- Estimated cost (strikethrough if purchased)
- Actual cost (bold if present, "-" if null, editable on click)
- Delete button (hover reveal)

When clicking actual cost:
- If null: Prompt for actual cost
- If has value: Allow edit

### 5.5 AddItemModal Component

**File:** `components/war-chest/AddItemModal.tsx`

Modal with form:
- Category (dropdown, pre-selected if opened from category)
- Item Name (text input, required)
- Estimated Cost (number input, required)
- Cancel + "Add Item" buttons

---

## Phase 6: Settings & Onboarding

### 6.1 Settings Page

**File:** `app/dashboard/settings/page.tsx`

Sections:

**1. Due Date**
- Display: "June 15, 2026"
- Edit button → inline edit or modal

**2. Insurance Details**
- Display all fields from `userData.insurance`
- Edit button → modal with all fields

**3. Danger Zone**
- "Reset All Data" button
- Confirmation dialog: "This will delete all your data. Are you sure?"
- On confirm: Call `resetAllData()` and redirect to `/onboarding`

### 6.2 Onboarding Page

**File:** `app/onboarding/page.tsx`

Two-step form matching existing calculator flow:

**Step 1: Due Date**
- Month dropdown (1-12)
- Year dropdown (current year + 1-2)
- "Continue" button

**Step 2: Insurance Details**
- Plan nickname (optional, defaults to "My Plan")
- Monthly premium (required)
- Family deductible (required)
- Family OOP max (required)
- Employer HSA/HRA contribution (optional, defaults to 0)
- "Launch Mission Control" button

On submit:
1. Calculate costs using `calculations.ts`
2. Call `initializeUser(userData, calculatedCosts)`
3. Redirect to `/dashboard`

**Double Deductible Warning:**
If `dueMonth <= 3`, show warning box:
> "The Double Deductible Trap: If your baby arrives early in the year, you might hit your deductible in BOTH plan years. Your total liability accounts for this."

---

## Phase 7: Integration & Polish

### 7.1 Wire Existing Calculator (Optional)

If you want to use the existing landing page calculator:

**Modify:** `app/results/page.tsx` or calculator submit handler

After calculation:
1. Create `UserData` object from form data
2. Call `initializeUser()`
3. Redirect to `/dashboard`

### 7.2 Loading States

Add skeleton loaders for:
- Dashboard cards
- Task list
- Budget categories

Pattern:
```typescript
if (!isLoaded) {
  return <DashboardSkeleton />
}
```

### 7.3 Empty States

Handle edge cases:
- No tasks completed yet: "Start checking off tasks to track your progress!"
- No budget items in category: "No items yet. Add your first item."
- Cash on hand not set: Prompt to enter it

### 7.4 Responsive Testing

Test at breakpoints:
- 375px (mobile)
- 768px (tablet)
- 1024px (small desktop)
- 1440px (large desktop)

Key responsive behaviors:
- Sidebar hidden on mobile
- Bottom nav visible on mobile
- Cards stack vertically on mobile
- Tables become card lists on mobile

---

## Calculation Integration

**Existing file:** `lib/calculations.ts`

You already have this logic. Key functions to use:

```typescript
// Calculate costs for a plan
calculatePlan(plan, dueMonth, dueYear) => {
  annualPremium,
  expectedOop,
  totalCost,
  effectiveCost,
  doubleDeductibleRisk,
}

// Calculate monthly savings target
calculateMonthlySavingsTarget(totalLiability, dueDate) => {
  monthlySavings,
  monthsRemaining,
}

// Calculate countdown
calculateCountdown(dueDate) => {
  weeks,
  days,
  totalDays,
}

// Calculate current pregnancy week
calculateCurrentWeek(dueDate) => number (1-40)

// Get trimester from week
getTrimester(week) => 1 | 2 | 3
```

---

## Execution Order for Claude Code

Give these instructions one at a time:

1. **"Create the type definitions in `lib/types.ts`"**

2. **"Create the localStorage hooks: `hooks/useLocalStorage.ts`"**

3. **"Create the storage constants: `lib/storage.ts`"**

4. **"Create the default tasks data: `lib/defaultTasks.ts` with 30 tasks including high-stakes tasks with consequences"**

5. **"Create the default budget categories: `lib/defaultBudget.ts`"**

6. **"Create the main state hook: `hooks/useDashboardState.ts`"**

7. **"Create the dashboard layout with sidebar at `app/dashboard/layout.tsx` and `components/dashboard/Sidebar.tsx`"**

8. **"Create the mobile navigation: `components/dashboard/MobileNav.tsx`"**

9. **"Create the dashboard page: `app/dashboard/page.tsx` with CountdownCard, StatsCards, MissionIntelligence, CostBreakdown, WarChestGauge, and UpcomingTasks components"**

10. **"Create the roadmap page: `app/dashboard/roadmap/page.tsx` with ProgressCard, ViewToggle, TrimesterSection, TaskRow, and AddTaskModal components"**

11. **"Create the war chest page: `app/dashboard/war-chest/page.tsx` with SummaryCards, CategoryCard, LineItemRow, and AddItemModal components"**

12. **"Create the settings page: `app/dashboard/settings/page.tsx` with edit functionality and reset data option"**

13. **"Create the onboarding flow: `app/onboarding/page.tsx` with 2-step form"**

14. **"Add loading states and empty states throughout"**

15. **"Test responsive design and fix any mobile issues"**

---

## Future: Supabase Migration Notes

When ready to add backend persistence:

**Tables needed:**
```sql
-- Users (handled by Supabase Auth)
-- Profiles
create table profiles (
  id uuid references auth.users primary key,
  due_date jsonb,
  insurance jsonb,
  cash_on_hand numeric,
  created_at timestamp default now()
);

-- Tasks
create table tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  title text,
  description text,
  category text,
  trimester int,
  week_due int,
  completed boolean default false,
  user_added boolean default false,
  deadline text,
  consequence text,
  is_high_stakes boolean default false
);

-- Budget Items
create table budget_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  category_id text,
  name text,
  estimated numeric,
  actual numeric,
  purchased boolean default false,
  note text
);
```

**Migration path:**
1. Add Supabase client
2. Create auth flow (magic link or OAuth)
3. On first auth, check localStorage
4. If data exists, offer to migrate to cloud
5. Replace `useLocalStorage` with Supabase queries
6. Clear localStorage after migration

---

## Quick Reference

**Colors (Tailwind):**
- Primary green: `emerald-500` (#10B981)
- Background: `gray-900` (#111827)
- Card: `gray-800` (#1F2937)
- Border: `gray-700` (#374151)
- Text primary: `white`
- Text muted: `gray-400`

**Category colors:**
- Medical: `blue-500`
- Finance: `green-500`
- Gear: `purple-500`
- Home: `teal-500`
- Childcare: `orange-500`
- Admin: `gray-500`
- Preparation: `pink-500`

**Icons:** Material Symbols Outlined
- Add via Google Fonts link in layout
- Usage: `<span className="material-symbols-outlined">icon_name</span>`

**Mockup files:**
- Dashboard: `Dark_Mode_dadops_mission_control_dashboard.png`
- Budget: `Dark_Mode_baby_prep_budget_tracker.png`
- Roadmap: `Dark_Mode_baby_prep_roadmap___checklist.png`
