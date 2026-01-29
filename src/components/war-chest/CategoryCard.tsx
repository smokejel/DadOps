'use client'

import { useState } from 'react'
import { BudgetCategory, BudgetItem } from '@/lib/types'
import { CATEGORY_COLOR_CLASSES } from '@/lib/defaultBudget'
import { formatCurrency } from '@/lib/dashboardUtils'
import { getIntegerError, hasValidationErrors } from '@/lib/validation'
import LineItemRow from './LineItemRow'

interface CategoryCardProps {
  category: BudgetCategory
  onToggleItem: (itemId: string) => void
  onUpdateItemActual: (itemId: string, actual: number | null) => void
  onDeleteItem: (itemId: string) => void
  onAddItem: (item: Omit<BudgetItem, 'id'>) => void
}

export default function CategoryCard({
  category,
  onToggleItem,
  onUpdateItemActual,
  onDeleteItem,
  onAddItem,
}: CategoryCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newItemName, setNewItemName] = useState('')
  const [newItemEstimated, setNewItemEstimated] = useState('')
  const [newItemEstimatedError, setNewItemEstimatedError] = useState<string | null>(null)

  const colorClasses = CATEGORY_COLOR_CLASSES[category.color] || CATEGORY_COLOR_CLASSES.blue

  // Calculate totals
  const totalEstimated = category.items.reduce((sum, item) => sum + item.estimated, 0)
  const totalActual = category.items.reduce((sum, item) => sum + (item.actual ?? 0), 0)
  const progressPercent = totalEstimated > 0 ? Math.round((totalActual / totalEstimated) * 100) : 0

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newItemName.trim() || newItemEstimatedError) return

    onAddItem({
      name: newItemName.trim(),
      estimated: parseFloat(newItemEstimated) || 0,
      actual: null,
      purchased: false,
    })

    setNewItemName('')
    setNewItemEstimated('')
    setNewItemEstimatedError(null)
    setShowAddForm(false)
  }

  return (
    <div className="bg-card-dark rounded-xl border border-gray-800 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-800/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg ${colorClasses.bg} flex items-center justify-center`}>
            <span className={`material-symbols-outlined ${colorClasses.text}`}>
              {category.icon}
            </span>
          </div>
          <div className="text-left">
            <h3 className="text-white font-semibold">{category.name}</h3>
            <p className="text-gray-500 text-sm">{category.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-white font-medium">
              {formatCurrency(totalActual)} / {formatCurrency(totalEstimated)}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-sm font-medium ${colorClasses.text}`}>
              {progressPercent}%
            </span>
            <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${colorClasses.progress}`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
          <span className={`material-symbols-outlined text-gray-400 transition-transform ${
            isExpanded ? 'rotate-180' : ''
          }`}>
            expand_more
          </span>
        </div>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-gray-800">
          {category.items.length > 0 ? (
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-gray-500 uppercase tracking-wide">
                  <th className="py-3 px-4 w-10">Status</th>
                  <th className="py-3 px-4">Item Name</th>
                  <th className="py-3 px-4 text-right">Estimated</th>
                  <th className="py-3 px-4 text-right">Actual Cost</th>
                  <th className="py-3 px-4 w-10"></th>
                </tr>
              </thead>
              <tbody>
                {category.items.map(item => (
                  <LineItemRow
                    key={item.id}
                    item={item}
                    onToggle={() => onToggleItem(item.id)}
                    onUpdateActual={(actual) => onUpdateItemActual(item.id, actual)}
                    onDelete={() => onDeleteItem(item.id)}
                  />
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500 text-center py-6">No items yet</p>
          )}

          {/* Add Item */}
          <div className="p-4 border-t border-gray-800">
            {showAddForm ? (
              <form onSubmit={handleAddItem} className="space-y-2">
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    placeholder="Item name"
                    className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                    autoFocus
                  />
                  <div className="flex items-center gap-1">
                    <span className="text-gray-400">$</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={newItemEstimated}
                      onChange={(e) => {
                        const value = e.target.value
                        setNewItemEstimated(value)
                        setNewItemEstimatedError(getIntegerError(value))
                      }}
                      placeholder="0"
                      className={`w-24 bg-gray-800 border rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none ${
                        newItemEstimatedError ? 'border-red-500 focus:border-red-500' : 'border-gray-700 focus:border-primary'
                      }`}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={hasValidationErrors(newItemEstimatedError)}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false)
                      setNewItemName('')
                      setNewItemEstimated('')
                      setNewItemEstimatedError(null)
                    }}
                    className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                </div>
                {newItemEstimatedError && <p className="text-red-400 text-xs">{newItemEstimatedError}</p>}
              </form>
            ) : (
              <button
                onClick={() => setShowAddForm(true)}
                className={`flex items-center gap-2 ${colorClasses.text} hover:opacity-80 transition-opacity`}
              >
                <span className="material-symbols-outlined text-lg">add_circle</span>
                Add item to {category.name}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
