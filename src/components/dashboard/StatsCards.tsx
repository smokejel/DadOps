'use client'

import { CalculatedCosts } from '@/lib/types'
import { formatCurrency } from '@/lib/dashboardUtils'

interface StatsCardsProps {
  costs: CalculatedCosts
  totalBudget: number
}

export default function StatsCards({ costs, totalBudget }: StatsCardsProps) {
  // Calculate monthly goal based on total budget
  const monthlyGoal = Math.ceil(totalBudget / costs.monthsRemaining)

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Target Liability */}
      <div className="bg-card-dark rounded-xl p-5 border border-gray-800">
        <div className="flex items-center gap-2 mb-3">
          <span className="material-symbols-outlined text-blue-400">target</span>
          <span className="text-gray-400 text-sm">Target Liability</span>
        </div>
        <p className="text-2xl font-bold text-white">
          {formatCurrency(totalBudget)}
        </p>
        <p className="text-sm text-gray-500 mt-1">Total estimated cost</p>
      </div>

      {/* Monthly Goal */}
      <div className="bg-card-dark rounded-xl p-5 border border-gray-800">
        <div className="flex items-center gap-2 mb-3">
          <span className="material-symbols-outlined text-primary">savings</span>
          <span className="text-gray-400 text-sm">Monthly Goal</span>
        </div>
        <p className="text-2xl font-bold text-white">
          {formatCurrency(monthlyGoal)}
          <span className="text-base font-normal text-gray-400">/mo</span>
        </p>
        <p className="text-sm text-gray-500 mt-1">To be ready by target date</p>
      </div>

      {/* Timeline */}
      <div className="bg-card-dark rounded-xl p-5 border border-gray-800">
        <div className="flex items-center gap-2 mb-3">
          <span className="material-symbols-outlined text-purple-400">schedule</span>
          <span className="text-gray-400 text-sm">Timeline</span>
        </div>
        <p className="text-2xl font-bold text-white">
          {costs.monthsRemaining} Months
        </p>
        <p className="text-sm text-gray-500 mt-1">Remaining to save</p>
      </div>
    </div>
  )
}
