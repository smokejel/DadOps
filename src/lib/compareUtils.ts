import { InsurancePlan, PlanComparison } from './types'

/**
 * Compare multiple insurance plans and calculate costs for each
 */
export function comparePlans(
  plans: InsurancePlan[],
  dueDate: { month: number; year: number }
): PlanComparison[] {
  // Double deductible risk: birth in Jan-Mar means pregnancy spans two calendar years
  const doubleDeductibleRisk = dueDate.month <= 3

  return plans.map(plan => {
    const annualPremium = plan.monthlyPremium * 12
    const expectedOop = doubleDeductibleRisk
      ? plan.familyOopMax * 2
      : plan.familyOopMax
    const totalCost = annualPremium + expectedOop
    const effectiveCost = totalCost - plan.employerHsa

    return {
      plan,
      annualPremium,
      expectedOop,
      totalCost,
      effectiveCost,
    }
  })
}

/**
 * Get the plan with the lowest effective cost
 */
export function getRecommendedPlan(comparisons: PlanComparison[]): PlanComparison | null {
  if (comparisons.length === 0) return null

  return comparisons.reduce((best, curr) =>
    curr.effectiveCost < best.effectiveCost ? curr : best
  )
}

/**
 * Calculate savings compared to the recommended plan
 */
export function calculateSavings(
  comparison: PlanComparison,
  recommended: PlanComparison
): number {
  return comparison.effectiveCost - recommended.effectiveCost
}

/**
 * Check if double deductible risk applies
 */
export function hasDoubleDeductibleRisk(dueMonth: number): boolean {
  return dueMonth <= 3
}
