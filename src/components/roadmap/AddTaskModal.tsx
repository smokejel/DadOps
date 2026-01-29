'use client'

import { useState } from 'react'
import { TaskCategory, Task } from '@/lib/types'
import { getIntegerError, hasValidationErrors } from '@/lib/validation'

interface AddTaskModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (task: Omit<Task, 'id' | 'userAdded' | 'completed'>) => void
}

const CATEGORIES: TaskCategory[] = [
  'Medical',
  'Finance',
  'Gear',
  'Home',
  'Childcare',
  'Admin',
  'Preparation',
]

export default function AddTaskModal({ isOpen, onClose, onAdd }: AddTaskModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<TaskCategory>('Preparation')
  const [weekDue, setWeekDue] = useState('20')
  const [weekDueError, setWeekDueError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || weekDueError) return

    const weekDueNum = parseInt(weekDue) || 1
    // Determine trimester from weekDue
    const trimester: 1 | 2 | 3 = weekDueNum <= 12 ? 1 : weekDueNum <= 26 ? 2 : 3

    onAdd({
      title: title.trim(),
      description: description.trim(),
      category,
      trimester,
      weekDue: weekDueNum,
    })

    // Reset form
    setTitle('')
    setDescription('')
    setCategory('Preparation')
    setWeekDue('20')
    setWeekDueError(null)
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
        <h2 className="text-xl font-semibold text-white mb-6">Add New Task</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Buy diapers"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-primary"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional details..."
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-primary"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as TaskCategory)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Week Due */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Week Due (1-40)</label>
            <input
              type="text"
              inputMode="numeric"
              value={weekDue}
              onChange={(e) => {
                const value = e.target.value
                setWeekDue(value)
                setWeekDueError(getIntegerError(value))
              }}
              className={`w-full bg-gray-800 border rounded-lg px-4 py-2 text-white focus:outline-none ${
                weekDueError ? 'border-red-500 focus:border-red-500' : 'border-gray-700 focus:border-primary'
              }`}
            />
            {weekDueError && <p className="text-red-400 text-xs mt-1">{weekDueError}</p>}
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
              disabled={hasValidationErrors(weekDueError)}
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary"
            >
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
