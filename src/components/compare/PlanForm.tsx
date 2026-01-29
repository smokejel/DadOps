'use client'

import { useState } from 'react'
import { InsurancePlan } from '@/lib/types'
import { getIntegerError } from '@/lib/validation'

interface PlanFormProps {
  plan: InsurancePlan
  onChange: (plan: InsurancePlan) => void
  isPrimary?: boolean
  onRemove?: () => void
}

export default function PlanForm({ plan, onChange, isPrimary, onRemove }: PlanFormProps) {
  const [premiumError, setPremiumError] = useState<string | null>(null)
  const [deductibleError, setDeductibleError] = useState<string | null>(null)
  const [oopMaxError, setOopMaxError] = useState<string | null>(null)
  const [hsaError, setHsaError] = useState<string | null>(null)

  const updateField = (field: keyof InsurancePlan, value: string | number) => {
    onChange({ ...plan, [field]: value })
  }

  const handleNumericChange = (
    field: 'monthlyPremium' | 'familyDeductible' | 'familyOopMax' | 'employerHsa',
    value: string,
    setError: (error: string | null) => void
  ) => {
    const error = getIntegerError(value)
    setError(error)
    // Only update if valid or empty
    if (!error || value === '') {
      updateField(field, parseInt(value) || 0)
    }
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
              type="text"
              inputMode="numeric"
              value={plan.monthlyPremium || ''}
              onChange={(e) => handleNumericChange('monthlyPremium', e.target.value, setPremiumError)}
              className={`w-full bg-gray-800 border rounded-lg px-3 py-2.5 pl-7 text-white placeholder-gray-500 focus:outline-none ${
                premiumError ? 'border-red-500 focus:border-red-500' : 'border-gray-700 focus:border-primary'
              }`}
              placeholder="0"
            />
          </div>
          {premiumError && <p className="text-red-400 text-xs mt-1">{premiumError}</p>}
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Family Deductible</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input
              type="text"
              inputMode="numeric"
              value={plan.familyDeductible || ''}
              onChange={(e) => handleNumericChange('familyDeductible', e.target.value, setDeductibleError)}
              className={`w-full bg-gray-800 border rounded-lg px-3 py-2.5 pl-7 text-white placeholder-gray-500 focus:outline-none ${
                deductibleError ? 'border-red-500 focus:border-red-500' : 'border-gray-700 focus:border-primary'
              }`}
              placeholder="0"
            />
          </div>
          {deductibleError && <p className="text-red-400 text-xs mt-1">{deductibleError}</p>}
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Family Out-of-Pocket Max</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input
              type="text"
              inputMode="numeric"
              value={plan.familyOopMax || ''}
              onChange={(e) => handleNumericChange('familyOopMax', e.target.value, setOopMaxError)}
              className={`w-full bg-gray-800 border rounded-lg px-3 py-2.5 pl-7 text-white placeholder-gray-500 focus:outline-none ${
                oopMaxError ? 'border-red-500 focus:border-red-500' : 'border-gray-700 focus:border-primary'
              }`}
              placeholder="0"
            />
          </div>
          {oopMaxError && <p className="text-red-400 text-xs mt-1">{oopMaxError}</p>}
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Employer HSA/HRA Contribution</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input
              type="text"
              inputMode="numeric"
              value={plan.employerHsa || ''}
              onChange={(e) => handleNumericChange('employerHsa', e.target.value, setHsaError)}
              className={`w-full bg-gray-800 border rounded-lg px-3 py-2.5 pl-7 text-white placeholder-gray-500 focus:outline-none ${
                hsaError ? 'border-red-500 focus:border-red-500' : 'border-gray-700 focus:border-primary'
              }`}
              placeholder="0"
            />
          </div>
          {hsaError && <p className="text-red-400 text-xs mt-1">{hsaError}</p>}
        </div>
      </div>
    </div>
  )
}
