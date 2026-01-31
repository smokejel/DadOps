'use client'

import { PlanComparison } from '@/lib/types'
import { formatCurrency } from '@/lib/dashboardUtils'
import { getRecommendedPlan, calculateSavings, hasDoubleDeductibleRisk } from '@/lib/compareUtils'

interface ComparisonResultsProps {
  comparisons: PlanComparison[]
  dueDate: { month: number; year: number }
  monthsRemaining: number
  onSelectPlan: (comparison: PlanComparison) => void
}

export default function ComparisonResults({
  comparisons,
  dueDate,
  monthsRemaining,
  onSelectPlan,
}: ComparisonResultsProps) {
  const recommended = getRecommendedPlan(comparisons)
  const doubleDeductibleRisk = hasDoubleDeductibleRisk(dueDate.month)

  if (!recommended || comparisons.length === 0) {
    return null
  }

  // Calculate max cost for bar chart scaling
  const maxCost = Math.max(...comparisons.map(c => c.effectiveCost))

  return (
    <div className="space-y-6">
      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card-dark rounded-xl p-5 border border-gray-800">
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-blue-400">target</span>
            <span className="text-gray-300 text-sm">Your Target</span>
          </div>
          <p className="text-2xl font-bold text-white">
            {formatCurrency(recommended.effectiveCost)}
          </p>
          <p className="text-sm text-gray-400 mt-1">Lowest effective cost</p>
        </div>

        <div className="bg-card-dark rounded-xl p-5 border border-gray-800">
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-primary">savings</span>
            <span className="text-gray-300 text-sm">Monthly Goal</span>
          </div>
          <p className="text-2xl font-bold text-white">
            {formatCurrency(Math.ceil(recommended.effectiveCost / monthsRemaining))}
            <span className="text-base font-normal text-gray-400">/mo</span>
          </p>
          <p className="text-sm text-gray-400 mt-1">To be ready by target date</p>
        </div>

        <div className="bg-card-dark rounded-xl p-5 border border-gray-800">
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-purple-400">schedule</span>
            <span className="text-gray-300 text-sm">Timeline</span>
          </div>
          <p className="text-2xl font-bold text-white">
            {monthsRemaining} Months
          </p>
          <p className="text-sm text-gray-400 mt-1">Remaining to save</p>
        </div>
      </div>

      {/* Double Deductible Alert */}
      {doubleDeductibleRisk && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
          <div className="flex gap-3">
            <span className="material-symbols-outlined text-amber-400">warning</span>
            <div>
              <h4 className="font-semibold text-amber-400">Double Deductible Risk</h4>
              <p className="text-sm text-gray-300 mt-1">
                With a due date in January-March, your pregnancy spans two calendar years.
                You may hit your out-of-pocket maximum twice - once for prenatal care and once for delivery.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Cost Comparison Chart */}
      <div className="bg-card-dark rounded-xl p-6 border border-gray-800">
        <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">bar_chart</span>
          Cost Comparison
        </h3>

        <div className="space-y-4">
          {comparisons.map((comparison) => {
            const isRecommended = comparison.plan.id === recommended.plan.id
            const savings = calculateSavings(comparison, recommended)
            const barWidth = (comparison.effectiveCost / maxCost) * 100

            return (
              <div key={comparison.plan.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium">{comparison.plan.nickname}</span>
                    {isRecommended && (
                      <span className="px-2 py-0.5 text-xs font-medium bg-primary/20 text-primary rounded">
                        BEST VALUE
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="text-white font-semibold">
                      {formatCurrency(comparison.effectiveCost)}
                    </span>
                    {!isRecommended && savings > 0 && (
                      <span className="text-red-400 text-sm ml-2">
                        +{formatCurrency(savings)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      isRecommended ? 'bg-primary' : 'bg-gray-500'
                    }`}
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Detailed Comparison Table */}
      <div className="bg-card-dark rounded-xl p-6 border border-gray-800">
        <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">table_chart</span>
          Detailed Comparison
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="pb-3 text-gray-300 font-medium">Plan</th>
                <th className="pb-3 text-gray-300 font-medium text-right">Annual Premium</th>
                <th className="pb-3 text-gray-300 font-medium text-right">Expected OOP</th>
                <th className="pb-3 text-gray-300 font-medium text-right">HSA Offset</th>
                <th className="pb-3 text-gray-300 font-medium text-right">Effective Cost</th>
                <th className="pb-3 text-gray-300 font-medium text-right"></th>
              </tr>
            </thead>
            <tbody>
              {comparisons.map((comparison) => {
                const isRecommended = comparison.plan.id === recommended.plan.id

                return (
                  <tr key={comparison.plan.id} className="border-b border-gray-800 last:border-0">
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-medium">{comparison.plan.nickname}</span>
                        {isRecommended && (
                          <span className="material-symbols-outlined text-primary text-sm">verified</span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 text-right text-gray-300">
                      {formatCurrency(comparison.annualPremium)}
                    </td>
                    <td className="py-4 text-right text-gray-300">
                      {formatCurrency(comparison.expectedOop)}
                    </td>
                    <td className="py-4 text-right text-green-400">
                      -{formatCurrency(comparison.plan.employerHsa)}
                    </td>
                    <td className="py-4 text-right font-semibold text-white">
                      {formatCurrency(comparison.effectiveCost)}
                    </td>
                    <td className="py-4 text-right">
                      <button
                        onClick={() => onSelectPlan(comparison)}
                        className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                          isRecommended
                            ? 'bg-primary text-white hover:bg-primary-dark'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        Use This Plan
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recommended Plan Card */}
      <div className="bg-gradient-to-r from-primary/20 to-primary-dark/20 rounded-xl p-6 border border-primary/30">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-2xl">recommend</span>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-1">
              Recommended: {recommended.plan.nickname}
            </h3>
            <p className="text-gray-300 text-sm mb-4">
              This plan has the lowest effective cost at {formatCurrency(recommended.effectiveCost)}.
              {comparisons.length > 1 && (
                <> You&apos;ll save up to{' '}
                  {formatCurrency(
                    Math.max(...comparisons.map(c => calculateSavings(c, recommended)))
                  )}{' '}
                  compared to other plans.</>
              )}
            </p>
            <button
              onClick={() => onSelectPlan(recommended)}
              className="px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors"
            >
              Use This Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
