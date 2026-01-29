'use client'

import { InsurancePlan } from '@/lib/types'

interface PlanFormProps {
  plan: InsurancePlan
  onChange: (plan: InsurancePlan) => void
  isPrimary?: boolean
  onRemove?: () => void
}

export default function PlanForm({ plan, onChange, isPrimary, onRemove }: PlanFormProps) {
  const updateField = (field: keyof InsurancePlan, value: string | number) => {
    onChange({ ...plan, [field]: value })
  }

  return (
    <div className="bg-card-dark rounded-xl p-6 border border-gray-800">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={plan.nickname}
            onChange={(e) => updateField('nickname', e.target.value)}
            className="bg-transparent text-lg font-semibold text-white border-none focus:outline-none focus:ring-0 p-0"
            placeholder="Plan Name"
          />
          {isPrimary && (
            <span className="px-2 py-0.5 text-xs font-medium bg-primary/20 text-primary rounded">
              PRIMARY
            </span>
          )}
        </div>
        {onRemove && (
          <button
            onClick={onRemove}
            className="text-gray-500 hover:text-red-400 transition-colors"
            aria-label="Remove plan"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Monthly Premium</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input
              type="number"
              value={plan.monthlyPremium || ''}
              onChange={(e) => updateField('monthlyPremium', parseFloat(e.target.value) || 0)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 pl-7 text-white placeholder-gray-500 focus:outline-none focus:border-primary"
              placeholder="0"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Family Deductible</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input
              type="number"
              value={plan.familyDeductible || ''}
              onChange={(e) => updateField('familyDeductible', parseFloat(e.target.value) || 0)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 pl-7 text-white placeholder-gray-500 focus:outline-none focus:border-primary"
              placeholder="0"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Family Out-of-Pocket Max</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input
              type="number"
              value={plan.familyOopMax || ''}
              onChange={(e) => updateField('familyOopMax', parseFloat(e.target.value) || 0)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 pl-7 text-white placeholder-gray-500 focus:outline-none focus:border-primary"
              placeholder="0"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Employer HSA/HRA Contribution</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input
              type="number"
              value={plan.employerHsa || ''}
              onChange={(e) => updateField('employerHsa', parseFloat(e.target.value) || 0)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 pl-7 text-white placeholder-gray-500 focus:outline-none focus:border-primary"
              placeholder="0"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
