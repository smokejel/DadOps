import { CalculatorData, EncodedPlan } from './encoding'
import { NUMBER_TO_MONTH } from './constants'

export interface CalculationResult {
  plan: EncodedPlan
  annualPremium: number
  expectedOop: number
  totalCost: number
  effectiveCost: number
  doubleDeductibleRisk: boolean
}

export interface FullResults {
  results: CalculationResult[]
  winner: CalculationResult
  runnerUp: CalculationResult | null
  savings: number
  doubleDeductibleRisk: boolean
  dueMonth: number
  dueYear: number
}

/**
 * Calculate costs for a single insurance plan
 * @param plan - Insurance plan with numeric values
 * @param dueMonth - Birth month (1-12)
 * @param dueYear - Birth year
 * @returns Calculation result for the plan
 */
export function calculatePlan(
  plan: EncodedPlan,
  dueMonth: number,
  dueYear: number
): CalculationResult {
  // Annual premium (12 months of premiums)
  const annualPremium = plan.monthlyPremium * 12

  // Double deductible detection
  // Triggers when birth is in Jan-Mar (months 1-3)
  // Pregnancy spans two calendar years, hitting deductibles in both years
  const doubleDeductibleRisk = dueMonth <= 3

  // Expected out-of-pocket costs
  let expectedOop: number
  if (doubleDeductibleRisk) {
    // Pregnancy spans two plan years: prenatal care in year one, delivery in year two
    // Deductibles count TOWARD the OOP max (not on top of it)
    // Real risk: hitting OOP max in BOTH plan years
    expectedOop = plan.familyOopMax * 2
  } else {
    // Standard scenario: All care in single calendar year
    // Assume hitting family OOP max (statistically likely for birth costs)
    expectedOop = plan.familyOopMax
  }

  // Total cost before employer contribution
  const totalCost = annualPremium + expectedOop

  // Effective cost after employer HSA/HRA contribution
  const effectiveCost = totalCost - plan.employerHsa

  return {
    plan,
    annualPremium,
    expectedOop,
    totalCost,
    effectiveCost,
    doubleDeductibleRisk,
  }
}

/**
 * Calculate all plans and determine the winner
 * @param data - Decoded calculator data
 * @returns Full results with winner, savings, and all plan calculations
 */
export function calculateAllPlans(data: CalculatorData): FullResults {
  const { dueMonth, dueYear, plans } = data

  // Calculate each plan
  const results = plans.map(plan =>
    calculatePlan(plan, dueMonth, dueYear)
  )

  // Sort by effective cost (lowest = best)
  results.sort((a, b) => a.effectiveCost - b.effectiveCost)

  // Winner is the plan with lowest effective cost
  const winner = results[0]
  const runnerUp = results[1] || null

  // Savings compared to runner-up (second best option)
  const savings = runnerUp ? runnerUp.effectiveCost - winner.effectiveCost : 0

  // Double deductible risk applies if any plan triggered it
  // (In practice, all plans will have same risk based on due date)
  const doubleDeductibleRisk = results.some(r => r.doubleDeductibleRisk)

  return {
    results,
    winner,
    runnerUp,
    savings,
    doubleDeductibleRisk,
    dueMonth,
    dueYear,
  }
}

/**
 * Format a number as currency (USD)
 * @param amount - Numeric amount
 * @returns Formatted currency string (e.g., "$1,234")
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
 * Format the due date for display
 * @param month - Month number (1-12)
 * @param year - Year number
 * @returns Formatted date string (e.g., "February 2026")
 */
export function formatDueDate(month: number, year: number): string {
  const monthName = NUMBER_TO_MONTH[month]
  if (!monthName) {
    throw new Error(`Invalid month number: ${month}`)
  }
  return `${monthName} ${year}`
}

/**
 * Calculate the monthly savings target to be financially ready by due date
 * @param totalLiability - Total expected birth year costs
 * @param dueDate - Object with month (1-12) and year
 * @param currentDate - Current date (defaults to now, injectable for testing)
 * @returns Monthly savings amount needed (rounded up)
 */
export function calculateMonthlySavingsTarget(
  totalLiability: number,
  dueDate: { month: number; year: number },
  currentDate: Date = new Date()
): number {
  // Target the 15th of the due month as a reasonable midpoint
  const dueDateTime = new Date(dueDate.year, dueDate.month - 1, 15)

  // Calculate months remaining (minimum 1 to avoid division by zero)
  const monthsRemaining = Math.max(
    1,
    (dueDateTime.getFullYear() - currentDate.getFullYear()) * 12 +
      (dueDateTime.getMonth() - currentDate.getMonth())
  )

  // Round up to ensure they save enough
  return Math.ceil(totalLiability / monthsRemaining)
}
