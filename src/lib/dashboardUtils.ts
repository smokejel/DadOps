import { UserData, CalculatedCosts, BudgetCategory } from './types'
import { NUMBER_TO_MONTH } from './constants'

/**
 * Calculate costs from user data
 */
export function calculateCosts(userData: UserData): CalculatedCosts {
  const { insurance, dueDate } = userData

  // Annual premium (12 months)
  const annualPremium = insurance.monthlyPremium * 12

  // Double deductible risk: birth in Jan-Mar means pregnancy spans two calendar years
  const doubleDeductibleRisk = dueDate.month <= 3

  // Expected OOP costs
  const expectedOop = doubleDeductibleRisk
    ? insurance.familyOopMax * 2
    : insurance.familyOopMax

  // Total cost before employer contribution
  const totalCost = annualPremium + expectedOop

  // Effective cost after employer HSA/HRA
  const effectiveCost = totalCost - insurance.employerHsa

  // Calculate months remaining
  const now = new Date()
  const dueDateTime = new Date(dueDate.year, dueDate.month - 1, 15)
  const monthsRemaining = Math.max(
    1,
    (dueDateTime.getFullYear() - now.getFullYear()) * 12 +
      (dueDateTime.getMonth() - now.getMonth())
  )

  // Monthly savings target
  const monthlySavingsTarget = Math.ceil(effectiveCost / monthsRemaining)

  return {
    annualPremium,
    expectedOop,
    totalCost,
    effectiveCost,
    monthlySavingsTarget,
    monthsRemaining,
    doubleDeductibleRisk,
  }
}

/**
 * Calculate countdown to due date
 */
export function calculateCountdown(dueDate: { month: number; year: number; day?: number }) {
  const now = new Date()
  const dueDay = dueDate.day || 15
  const due = new Date(dueDate.year, dueDate.month - 1, dueDay)
  const diff = due.getTime() - now.getTime()

  if (diff <= 0) {
    return { weeks: 0, days: 0, totalDays: 0, isPast: true }
  }

  const totalDays = Math.ceil(diff / (1000 * 60 * 60 * 24))
  const weeks = Math.floor(totalDays / 7)
  const days = totalDays % 7

  return { weeks, days, totalDays, isPast: false }
}

/**
 * Calculate current pregnancy week (1-40)
 */
export function calculateCurrentWeek(dueDate: { month: number; year: number; day?: number }) {
  const { totalDays, isPast } = calculateCountdown(dueDate)
  if (isPast) return 40

  // Pregnancy is 40 weeks (280 days), count backwards from due date
  const daysPregnant = 280 - totalDays
  const currentWeek = Math.max(1, Math.min(40, Math.floor(daysPregnant / 7) + 1))
  return currentWeek
}

/**
 * Get trimester from week number
 */
export function getTrimester(week: number): 1 | 2 | 3 {
  if (week <= 12) return 1
  if (week <= 26) return 2
  return 3
}

/**
 * Format due date for display
 */
export function formatDueDate(dueDate: { month: number; year: number; day?: number }) {
  const monthName = NUMBER_TO_MONTH[dueDate.month]
  if (dueDate.day) {
    return `${monthName} ${dueDate.day}, ${dueDate.year}`
  }
  return `${monthName} ${dueDate.year}`
}

/**
 * Format currency
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Calculate total budget from all budget categories
 * This sums estimated costs from gear, nursery, childcare, etc.
 * Note: Medical category already contains insurance costs, so we only count positive items
 */
export function calculateTotalBudget(budgetCategories: BudgetCategory[]): number {
  return budgetCategories.reduce((sum, cat) => {
    const categoryTotal = cat.items.reduce((itemSum, item) => {
      // Only count positive values (exclude HSA offset which is negative)
      return itemSum + Math.max(0, item.estimated)
    }, 0)
    return sum + categoryTotal
  }, 0)
}

/**
 * Calculate trimester start dates based on due date
 */
export function calculateTrimesterDates(dueDate: { month: number; year: number; day?: number }) {
  const dueDay = dueDate.day || 15
  const dueDateObj = new Date(dueDate.year, dueDate.month - 1, dueDay)

  // Pregnancy is 280 days (40 weeks)
  // 1st trimester: weeks 1-12 (conception to ~week 12)
  // 2nd trimester: weeks 13-26
  // 3rd trimester: weeks 27-40

  // Conception date (due date - 280 days)
  const conceptionDate = new Date(dueDateObj.getTime() - 280 * 24 * 60 * 60 * 1000)

  // 2nd trimester starts at week 13 (due date - 196 days, which is 28 weeks before due)
  const secondTrimesterStart = new Date(dueDateObj.getTime() - 196 * 24 * 60 * 60 * 1000)

  // 3rd trimester starts at week 27 (due date - 98 days, which is 14 weeks before due)
  const thirdTrimesterStart = new Date(dueDateObj.getTime() - 98 * 24 * 60 * 60 * 1000)

  return {
    firstTrimesterStart: conceptionDate,
    secondTrimesterStart,
    thirdTrimesterStart,
  }
}
