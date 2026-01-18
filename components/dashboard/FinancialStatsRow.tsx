'use client'

import { formatCurrency } from '@/lib/calculations'
import { NUMBER_TO_MONTH } from '@/lib/constants'

interface FinancialStatsRowProps {
  totalLiability: number
  monthlySavingsGoal: number
  monthsRemaining: number
  dueMonth: number
  dueYear: number
  planName?: string
}

export default function FinancialStatsRow({
  totalLiability,
  monthlySavingsGoal,
  monthsRemaining,
  dueMonth,
  planName,
}: FinancialStatsRowProps) {
  const monthName = NUMBER_TO_MONTH[dueMonth] || 'your due date'

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Card 1: Your Target */}
      <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col justify-between">
        <div className="flex justify-between items-start mb-4">
          <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg text-green-600 dark:text-green-400">
            <span className="material-symbols-outlined">savings</span>
          </div>
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Your Target
          </span>
        </div>
        <div>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(totalLiability)}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
            {planName ? `${planName} Birth Year Cost` : 'Total Birth Year Cost'}
          </p>
        </div>
      </div>

      {/* Card 2: Monthly Goal */}
      <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col justify-between">
        <div className="flex justify-between items-start mb-4">
          <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg text-green-600 dark:text-green-400">
            <span className="material-symbols-outlined">target</span>
          </div>
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Monthly Goal
          </span>
        </div>
        <div>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(monthlySavingsGoal)}<span className="text-xl">/mo</span>
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
            to be ready by {monthName}
          </p>
        </div>
      </div>

      {/* Card 3: Timeline */}
      <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col justify-between">
        <div className="flex justify-between items-start mb-4">
          <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg text-green-600 dark:text-green-400">
            <span className="material-symbols-outlined">calendar_month</span>
          </div>
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Timeline
          </span>
        </div>
        <div>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
            {monthsRemaining}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
            Month{monthsRemaining !== 1 ? 's' : ''} to Save
          </p>
        </div>
      </div>
    </section>
  )
}
