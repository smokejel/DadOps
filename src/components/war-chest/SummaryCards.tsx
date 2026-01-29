'use client'

import { BudgetCategory } from '@/lib/types'
import { formatCurrency } from '@/lib/dashboardUtils'

interface SummaryCardsProps {
  budget: BudgetCategory[]
}

export default function SummaryCards({ budget }: SummaryCardsProps) {
  // Calculate totals
  const totalEstimated = budget.reduce((sum, cat) =>
    sum + cat.items.reduce((itemSum, item) => itemSum + item.estimated, 0), 0
  )

  const totalActual = budget.reduce((sum, cat) =>
    sum + cat.items.reduce((itemSum, item) => itemSum + (item.actual ?? 0), 0), 0
  )

  const remaining = totalEstimated - totalActual
  const spentPercent = totalEstimated > 0 ? Math.round((totalActual / totalEstimated) * 100) : 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Total Budget */}
      <div className="bg-card-dark rounded-xl p-5 border border-gray-800">
        <div className="flex items-center justify-between mb-3">
          <span className="text-gray-400 text-sm uppercase tracking-wide">Total Budget</span>
          <div className="w-10 h-10 rounded-lg bg-gray-700 flex items-center justify-center">
            <span className="material-symbols-outlined text-gray-400">account_balance_wallet</span>
          </div>
        </div>
        <p className="text-3xl font-bold text-white mb-3">
          {formatCurrency(totalEstimated)}
        </p>
        <div className="h-1.5 bg-gray-700 rounded-full">
          <div className="h-full bg-gray-500 rounded-full w-full" />
        </div>
      </div>

      {/* Total Spent */}
      <div className="bg-card-dark rounded-xl p-5 border border-gray-800">
        <div className="flex items-center justify-between mb-3">
          <span className="text-gray-400 text-sm uppercase tracking-wide">Total Spent</span>
          <div className="w-10 h-10 rounded-lg bg-teal-500/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-teal-400">shopping_cart</span>
          </div>
        </div>
        <p className="text-3xl font-bold text-white mb-1">
          {formatCurrency(totalActual)}
          <span className="text-lg font-normal text-gray-400 ml-2">{spentPercent}%</span>
        </p>
        <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-teal-500 rounded-full transition-all duration-500"
            style={{ width: `${spentPercent}%` }}
          />
        </div>
      </div>

      {/* Remaining */}
      <div className="bg-card-dark rounded-xl p-5 border border-gray-800">
        <div className="flex items-center justify-between mb-3">
          <span className="text-gray-400 text-sm uppercase tracking-wide">Remaining</span>
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary">savings</span>
          </div>
        </div>
        <p className="text-3xl font-bold text-primary">
          {formatCurrency(remaining)}
        </p>
        <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${100 - spentPercent}%` }}
          />
        </div>
      </div>
    </div>
  )
}
