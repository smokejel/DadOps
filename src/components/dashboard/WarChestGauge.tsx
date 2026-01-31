'use client'

import { useState, useEffect } from 'react'
import { CalculatedCosts } from '@/lib/types'
import { formatCurrency } from '@/lib/dashboardUtils'
import { getIntegerError } from '@/lib/validation'

interface WarChestGaugeProps {
  costs: CalculatedCosts
  cashOnHand: number
  onUpdateCash: (amount: number) => void
}

export default function WarChestGauge({ costs, cashOnHand, onUpdateCash }: WarChestGaugeProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [inputValue, setInputValue] = useState(cashOnHand.toString())
  const [inputError, setInputError] = useState<string | null>(null)

  useEffect(() => {
    setInputValue(cashOnHand.toString())
  }, [cashOnHand])

  const gap = cashOnHand - costs.effectiveCost
  const isShortfall = gap < 0
  const progressPercent = Math.min(100, Math.max(0, (cashOnHand / costs.effectiveCost) * 100))

  const handleSubmit = () => {
    if (inputError) return
    const value = parseFloat(inputValue) || 0
    onUpdateCash(value)
    setIsEditing(false)
    setInputError(null)
  }

  return (
    <div className="bg-card-dark rounded-xl p-6 border border-gray-800">
      <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
        <span className="material-symbols-outlined text-primary">account_balance</span>
        War Chest Status
      </h3>

      <div className="space-y-6">
        {/* Total Liability */}
        <div className="flex justify-between items-center">
          <span className="text-gray-300">Total Liability</span>
          <span className="text-white font-semibold">{formatCurrency(costs.effectiveCost)}</span>
        </div>

        {/* Cash on Hand */}
        <div className="flex justify-between items-center">
          <span className="text-gray-300">Cash on Hand</span>
          {isEditing ? (
            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-2">
                <span className="text-gray-400">$</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={inputValue}
                  onChange={(e) => {
                    const value = e.target.value
                    setInputValue(value)
                    setInputError(getIntegerError(value))
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                  className={`w-24 bg-gray-700 border rounded px-2 py-1 text-white text-right focus:outline-none ${
                    inputError ? 'border-red-500 focus:border-red-500' : 'border-gray-600 focus:border-primary'
                  }`}
                  autoFocus
                />
                <button
                  onClick={handleSubmit}
                  disabled={!!inputError}
                  className="text-primary hover:text-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined text-lg">check</span>
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false)
                    setInputValue(cashOnHand.toString())
                    setInputError(null)
                  }}
                  className="text-gray-400 hover:text-gray-300"
                >
                  <span className="material-symbols-outlined text-lg">close</span>
                </button>
              </div>
              {inputError && <p className="text-red-400 text-xs">{inputError}</p>}
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 text-primary hover:text-primary-dark transition-colors"
            >
              <span className="font-semibold">{formatCurrency(cashOnHand)}</span>
              <span className="material-symbols-outlined text-sm">edit</span>
            </button>
          )}
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isShortfall ? 'bg-orange-500' : 'bg-primary'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">{Math.round(progressPercent)}% funded</span>
          </div>
        </div>

        {/* Gap */}
        <div className={`flex justify-between items-center p-3 rounded-lg ${
          isShortfall ? 'bg-red-500/10' : 'bg-green-500/10'
        }`}>
          <span className={isShortfall ? 'text-red-400' : 'text-green-400'}>
            {isShortfall ? 'Shortfall' : 'Surplus'}
          </span>
          <span className={`font-bold ${isShortfall ? 'text-red-400' : 'text-green-400'}`}>
            {formatCurrency(Math.abs(gap))}
          </span>
        </div>
      </div>
    </div>
  )
}
