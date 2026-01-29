// Month names array (0-indexed for JavaScript Date compatibility)
export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
] as const

// Month name to number mapping (derived from MONTH_NAMES)
export const MONTH_TO_NUMBER: Record<string, number> = Object.fromEntries(
  MONTH_NAMES.map((month, index) => [month, index + 1])
)

// Number to month name mapping (derived from MONTH_NAMES)
export const NUMBER_TO_MONTH: Record<number, string> = Object.fromEntries(
  MONTH_NAMES.map((month, index) => [index + 1, month])
)

// Default plan names when user doesn't provide custom names
export const DEFAULT_PLAN_NAMES = ['Plan A', 'Plan B', 'Plan C'] as const

// Currency formatting helper
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}
