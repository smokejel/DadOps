import { MONTH_TO_NUMBER, DEFAULT_PLAN_NAMES } from './constants'

// Input types (from calculator form - all strings)
export interface FormPlan {
  name: string
  monthlyPremium: string
  familyDeductible: string
  familyOopMax: string
  employerHsa: string
}

// Output types (numeric for calculations)
export interface EncodedPlan {
  id: number
  name: string
  monthlyPremium: number
  familyDeductible: number
  familyOopMax: number
  employerHsa: number
}

export interface CalculatorData {
  dueMonth: number
  dueYear: number
  plans: EncodedPlan[]
}

/**
 * Encodes calculator form data into a URL-safe token
 * @param dueMonth - Month name (e.g., "February")
 * @param dueYear - Year as string (e.g., "2026")
 * @param plans - Array of plan data from form (strings)
 * @returns URL-safe base64 encoded token
 */
export function encodeCalculatorData(
  dueMonth: string,
  dueYear: string,
  plans: FormPlan[]
): string {
  // Convert month name to number
  const monthNum = MONTH_TO_NUMBER[dueMonth]
  if (!monthNum) {
    throw new Error(`Invalid month: ${dueMonth}`)
  }

  // Transform plans from strings to numbers
  const encodedPlans: EncodedPlan[] = plans.map((plan, index) => ({
    id: index + 1,
    name: plan.name || DEFAULT_PLAN_NAMES[index],
    monthlyPremium: parseFloat(plan.monthlyPremium) || 0,
    familyDeductible: parseFloat(plan.familyDeductible) || 0,
    familyOopMax: parseFloat(plan.familyOopMax) || 0,
    employerHsa: plan.employerHsa ? parseFloat(plan.employerHsa) : 0,
  }))

  const data: CalculatorData = {
    dueMonth: monthNum,
    dueYear: parseInt(dueYear),
    plans: encodedPlans,
  }

  // Encode to URL-safe string
  const json = JSON.stringify(data)
  const base64 = btoa(json)
  return encodeURIComponent(base64)
}

/**
 * Decodes a URL token back to calculator data
 * @param token - URL-safe base64 encoded token
 * @returns Decoded calculator data
 * @throws Error if token is invalid
 */
export function decodeCalculatorData(token: string): CalculatorData {
  try {
    const base64 = decodeURIComponent(token)
    const json = atob(base64)
    const data = JSON.parse(json) as CalculatorData

    // Validate required fields (supports single plan mode with 1+ plans)
    if (!data.dueMonth || !data.dueYear || !data.plans || data.plans.length < 1) {
      throw new Error('Invalid calculator data structure')
    }

    return data
  } catch (error) {
    console.error('Token decode error:', error)
    throw new Error('Invalid token')
  }
}
