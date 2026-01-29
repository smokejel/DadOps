'use client'

import { useState } from 'react'
import { BudgetItem } from '@/lib/types'
import { formatCurrency } from '@/lib/dashboardUtils'
import { getIntegerError } from '@/lib/validation'

interface LineItemRowProps {
  item: BudgetItem
  onToggle: () => void
  onUpdateActual: (actual: number | null) => void
  onDelete: () => void
}

export default function LineItemRow({
  item,
  onToggle,
  onUpdateActual,
  onDelete,
}: LineItemRowProps) {
  const [isEditingActual, setIsEditingActual] = useState(false)
  const [actualValue, setActualValue] = useState(item.actual?.toString() || '')
  const [actualError, setActualError] = useState<string | null>(null)

  const handleActualSubmit = () => {
    if (actualError) return
    const value = actualValue.trim() ? parseFloat(actualValue) : null
    onUpdateActual(value)
    setIsEditingActual(false)
    setActualError(null)
  }

  return (
    <tr className="group border-b border-gray-800 last:border-0 hover:bg-gray-800/30">
      {/* Status Checkbox */}
      <td className="py-3 px-4">
        <button
          onClick={onToggle}
          className={`w-5 h-5 rounded border-2 transition-colors flex items-center justify-center ${
            item.purchased
              ? 'bg-primary border-primary'
              : 'border-gray-500 hover:border-primary'
          }`}
        >
          {item.purchased && (
            <span className="material-symbols-outlined text-white text-sm">check</span>
          )}
        </button>
      </td>

      {/* Item Name */}
      <td className="py-3 px-4">
        <span className={item.purchased ? 'text-gray-500 line-through' : 'text-white'}>
          {item.name}
        </span>
        {item.note && (
          <p className="text-xs text-gray-500 mt-0.5">{item.note}</p>
        )}
      </td>

      {/* Estimated */}
      <td className="py-3 px-4 text-right">
        <span className={item.purchased ? 'text-gray-500 line-through' : 'text-gray-400'}>
          {formatCurrency(item.estimated)}
        </span>
      </td>

      {/* Actual Cost */}
      <td className="py-3 px-4 text-right">
        {isEditingActual ? (
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-2">
              <span className="text-gray-400">$</span>
              <input
                type="text"
                inputMode="numeric"
                value={actualValue}
                onChange={(e) => {
                  const value = e.target.value
                  setActualValue(value)
                  setActualError(getIntegerError(value))
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleActualSubmit()}
                onBlur={handleActualSubmit}
                className={`w-20 bg-gray-700 border rounded px-2 py-1 text-white text-right focus:outline-none ${
                  actualError ? 'border-red-500 focus:border-red-500' : 'border-gray-600 focus:border-primary'
                }`}
                autoFocus
              />
            </div>
            {actualError && <p className="text-red-400 text-xs">{actualError}</p>}
          </div>
        ) : (
          <button
            onClick={() => {
              setActualValue(item.actual?.toString() || '')
              setIsEditingActual(true)
            }}
            className="text-white font-medium hover:text-primary transition-colors"
          >
            {item.actual !== null ? formatCurrency(item.actual) : '-'}
          </button>
        )}
      </td>

      {/* Delete */}
      <td className="py-3 px-4 w-10">
        <button
          onClick={onDelete}
          className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-all"
        >
          <span className="material-symbols-outlined text-lg">delete</span>
        </button>
      </td>
    </tr>
  )
}
