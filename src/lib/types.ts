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

// Insurance plan for comparison feature
export interface InsurancePlan {
  id: string
  nickname: string
  monthlyPremium: number
  familyDeductible: number
  familyOopMax: number
  employerHsa: number
}

// Comparison result for a single plan
export interface PlanComparison {
  plan: InsurancePlan
  annualPremium: number
  expectedOop: number
  totalCost: number
  effectiveCost: number
}

// Category styling map
export interface CategoryStyle {
  bg: string        // Background class
  text: string      // Text color class
  icon: string      // Material Symbols icon
  border: string    // Border class
  progress: string  // Progress bar class
}
