'use client'

import { useState } from 'react'
import { BudgetCategory, BudgetItem } from '@/lib/types'
import { getIntegerError, hasValidationErrors } from '@/lib/validation'

interface AddItemModalProps {
  isOpen: boolean
  categories: BudgetCategory[]
  onClose: () => void
  onAdd: (categoryId: string, item: Omit<BudgetItem, 'id'>) => void
}

export default function AddItemModal({
  isOpen,
  categories,
  onClose,
  onAdd,
}: AddItemModalProps) {
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '')
  const [name, setName] = useState('')
  const [estimated, setEstimated] = useState('')
  const [estimatedError, setEstimatedError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !categoryId || estimatedError) return

    onAdd(categoryId, {
      name: name.trim(),
      estimated: parseFloat(estimated) || 0,
      actual: null,
      purchased: false,
    })

    setName('')
    setEstimated('')
    setEstimatedError(null)
    setCategoryId(categories[0]?.id || '')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-card-dark rounded-xl border border-gray-800 w-full max-w-md p-6">
        <h2 className="text-xl font-semibold text-white mb-6">Add Budget Item</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Category */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Category</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Item Name */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Item Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Diapers"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-primary"
              required
            />
          </div>

          {/* Estimated Cost */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Estimated Cost *</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
              <input
                type="text"
                inputMode="numeric"
                value={estimated}
                onChange={(e) => {
                  const value = e.target.value
                  setEstimated(value)
                  setEstimatedError(getIntegerError(value))
                }}
                placeholder="0"
                className={`w-full bg-gray-800 border rounded-lg pl-8 pr-4 py-2 text-white placeholder-gray-500 focus:outline-none ${
                  estimatedError ? 'border-red-500 focus:border-red-500' : 'border-gray-700 focus:border-primary'
                }`}
                required
              />
            </div>
            {estimatedError && <p className="text-red-400 text-xs mt-1">{estimatedError}</p>}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={hasValidationErrors(estimatedError)}
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary"
            >
              Add Item
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
