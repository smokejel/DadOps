'use client'

import { CalculatedCosts, UserData } from '@/lib/types'
import { formatCurrency } from '@/lib/dashboardUtils'

interface CostBreakdownProps {
  costs: CalculatedCosts
  userData: UserData
}

export default function CostBreakdown({ costs, userData }: CostBreakdownProps) {
  const items = [
    {
      label: 'Max Out-of-Pocket',
      icon: 'medical_services',
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      value: costs.expectedOop,
    },
    {
      label: 'Annual Premiums',
      icon: 'payments',
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      value: costs.annualPremium,
    },
    {
      label: 'HSA/HRA Offset',
      icon: 'savings',
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      value: -userData.insurance.employerHsa,
      isNegative: true,
    },
  ]

  return (
    <div className="bg-card-dark rounded-xl p-6 border border-gray-800">
      <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
        <span className="material-symbols-outlined text-primary">receipt_long</span>
        Delivery Cost Breakdown
      </h3>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.label} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg ${item.bgColor} flex items-center justify-center`}>
                <span className={`material-symbols-outlined text-lg ${item.color}`}>
                  {item.icon}
                </span>
              </div>
              <span className="text-gray-300">{item.label}</span>
            </div>
            <span className={`font-medium ${item.isNegative ? 'text-green-400' : 'text-white'}`}>
              {formatCurrency(item.value)}
            </span>
          </div>
        ))}

        {/* Divider */}
        <div className="border-t border-gray-700 pt-4">
          <div className="flex items-center justify-between">
            <span className="text-white font-semibold">Total Liability</span>
            <span className="text-xl font-bold text-white">
              {formatCurrency(costs.effectiveCost)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
