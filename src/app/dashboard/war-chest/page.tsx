'use client'

import { useState } from 'react'
import { useDashboardState } from '@/hooks/useDashboardState'
import SummaryCards from '@/components/war-chest/SummaryCards'
import CategoryCard from '@/components/war-chest/CategoryCard'
import AddItemModal from '@/components/war-chest/AddItemModal'

export default function WarChestPage() {
  const {
    budget,
    toggleBudgetItem,
    updateBudgetItem,
    addBudgetItem,
    deleteBudgetItem,
  } = useDashboardState()
  const [showAddModal, setShowAddModal] = useState(false)

  if (!budget) {
    return null
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Budget</h1>
          <p className="text-gray-400 mt-1">
            Manage your finances for the new arrival.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          Add Item
        </button>
      </div>

      {/* Summary Cards */}
      <SummaryCards budget={budget} />

      {/* Category Cards */}
      <div className="space-y-4">
        {budget.map(category => (
          <CategoryCard
            key={category.id}
            category={category}
            onToggleItem={(itemId) => toggleBudgetItem(category.id, itemId)}
            onUpdateItemActual={(itemId, actual) =>
              updateBudgetItem(category.id, itemId, { actual })
            }
            onDeleteItem={(itemId) => deleteBudgetItem(category.id, itemId)}
            onAddItem={(item) => addBudgetItem(category.id, item)}
          />
        ))}
      </div>

      {/* Add Item Modal */}
      <AddItemModal
        isOpen={showAddModal}
        categories={budget}
        onClose={() => setShowAddModal(false)}
        onAdd={addBudgetItem}
      />
    </div>
  )
}
