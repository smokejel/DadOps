/**
 * Validation utilities for numeric input fields
 */

/**
 * Validate that input is a valid integer (whole number, no decimals)
 * Allows empty strings and standalone minus sign while typing
 */
export function isValidInteger(value: string): boolean {
  if (value === '' || value === '-') return true
  return /^-?\d+$/.test(value)
}

/**
 * Get error message for invalid integer input
 * Returns null if input is valid
 */
export function getIntegerError(value: string): string | null {
  if (value === '' || isValidInteger(value)) return null
  if (/[a-zA-Z]/.test(value)) return 'Letters are not allowed'
  if (/\./.test(value)) return 'Whole numbers only (no decimals)'
  return 'Please enter a valid whole number'
}

/**
 * Check if any errors exist in an array of error states
 */
export function hasValidationErrors(...errors: (string | null)[]): boolean {
  return errors.some(error => error !== null)
}
