/**
 * Analytics utility library for tracking user events with Vercel Analytics
 */
import { track } from '@vercel/analytics'

// Event names (centralized for consistency)
export const AnalyticsEvents = {
  // Locked module interactions
  LOCKED_MODULE_CLICK: 'locked_module_click',

  // Calculator flow
  CALCULATOR_STARTED: 'calculator_started',
  CALCULATOR_COMPLETED: 'calculator_completed',

  // Payment flow
  PAYMENT_INITIATED: 'payment_initiated',
  PAYMENT_COMPLETED: 'payment_completed',

  // Results page actions
  RESULTS_PRINTED: 'results_printed',
  RESULTS_SHARED: 'results_shared',
  CALCULATOR_RESTARTED: 'calculator_restarted',
} as const

// Event parameter types
export interface LockedModuleClickParams {
  module_name: 'Deployment Timeline' | 'Logistics & Gear' | 'Readiness Score'
}

export interface CalculatorCompletedParams {
  due_month: number
  due_year: number
  num_plans: number
}

export interface PaymentCompletedParams {
  session_id: string
  amount: number
}

/**
 * Track a locked module click event
 */
export function trackLockedModuleClick(moduleName: LockedModuleClickParams['module_name']) {
  try {
    track(AnalyticsEvents.LOCKED_MODULE_CLICK, {
      module_name: moduleName,
    })
  } catch (error) {
    console.error('Analytics error:', error)
  }
}

/**
 * Track calculator started event (user begins entering due date)
 */
export function trackCalculatorStarted() {
  try {
    track(AnalyticsEvents.CALCULATOR_STARTED)
  } catch (error) {
    console.error('Analytics error:', error)
  }
}

/**
 * Track calculator completed event
 */
export function trackCalculatorCompleted(params: CalculatorCompletedParams) {
  try {
    track(AnalyticsEvents.CALCULATOR_COMPLETED, {
      due_month: params.due_month,
      due_year: params.due_year,
      num_plans: params.num_plans,
    })
  } catch (error) {
    console.error('Analytics error:', error)
  }
}

/**
 * Track payment initiated event (user clicks unlock button)
 */
export function trackPaymentInitiated() {
  try {
    track(AnalyticsEvents.PAYMENT_INITIATED)
  } catch (error) {
    console.error('Analytics error:', error)
  }
}

/**
 * Track payment completed event
 */
export function trackPaymentCompleted(params: PaymentCompletedParams) {
  try {
    track(AnalyticsEvents.PAYMENT_COMPLETED, {
      session_id: params.session_id,
      amount: params.amount,
    })
  } catch (error) {
    console.error('Analytics error:', error)
  }
}

/**
 * Track results printed event
 */
export function trackResultsPrinted() {
  try {
    track(AnalyticsEvents.RESULTS_PRINTED)
  } catch (error) {
    console.error('Analytics error:', error)
  }
}

/**
 * Track results shared event (copy link)
 */
export function trackResultsShared() {
  try {
    track(AnalyticsEvents.RESULTS_SHARED)
  } catch (error) {
    console.error('Analytics error:', error)
  }
}

/**
 * Track calculator restarted event (start over button)
 */
export function trackCalculatorRestarted() {
  try {
    track(AnalyticsEvents.CALCULATOR_RESTARTED)
  } catch (error) {
    console.error('Analytics error:', error)
  }
}
