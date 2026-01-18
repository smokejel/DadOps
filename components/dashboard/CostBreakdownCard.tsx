'use client'

import { EncodedPlan } from '@/lib/encoding'
import { CalculationResult, formatCurrency } from '@/lib/calculations'

interface CostBreakdownCardProps {
  plan: EncodedPlan
  result: CalculationResult
  className?: string
}

export default function CostBreakdownCard({
  plan,
  result,
  className = '',
}: CostBreakdownCardProps) {
  const hasHsaCredit = plan.employerHsa > 0

  return (
    <div className={`bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col ${className}`}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <span className="material-symbols-outlined text-base text-emerald-500">attach_money</span>
          Cost Breakdown
        </h3>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col gap-6 flex-1 justify-center">
        {/* Main Number */}
        <div className="flex items-end justify-between">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">
              Total Liability
            </span>
            <span className="text-3xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(result.effectiveCost)}
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xs text-gray-400 font-medium mb-1">
              {plan.name}
            </span>
            <span className="text-sm font-bold text-gray-500">100%</span>
          </div>
        </div>

        {/* Progress Bar (visual indicator - always full since this is the total) */}
        <div className="relative w-full h-4 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
          <div className="absolute top-0 left-0 h-full bg-primary rounded-full w-full"></div>
          {/* Striped pattern overlay for texture */}
          <div className="absolute top-0 left-0 h-full w-full opacity-20 bg-[linear-gradient(45deg,rgba(255,255,255,.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,.15)_50%,rgba(255,255,255,.15)_75%,transparent_75%,transparent)] bg-[length:1rem_1rem]"></div>
        </div>

        {/* Breakdown Pills */}
        <div className="flex flex-wrap gap-2 mt-2">
          <span className="px-2 py-1 rounded bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-600 dark:text-gray-300">
            <span className="mr-1">💵</span>
            Premiums: {formatCurrency(result.annualPremium)}
          </span>
          <span className="px-2 py-1 rounded bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-600 dark:text-gray-300">
            <span className="mr-1">🏥</span>
            OOP: {formatCurrency(result.expectedOop)}
          </span>
          {hasHsaCredit && (
            <span className="px-2 py-1 rounded bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-xs font-medium text-emerald-700 dark:text-emerald-400">
              <span className="mr-1">💚</span>
              HSA: -{formatCurrency(plan.employerHsa)}
            </span>
          )}
        </div>

        {/* Formula display */}
        <div className="text-xs text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-700">
          <span className="font-mono">
            {formatCurrency(result.annualPremium)} + {formatCurrency(result.expectedOop)}
            {hasHsaCredit && ` - ${formatCurrency(plan.employerHsa)}`}
            {' = '}
            <span className="font-semibold text-gray-600 dark:text-gray-300">
              {formatCurrency(result.effectiveCost)}
            </span>
          </span>
        </div>
      </div>
    </div>
  )
}
