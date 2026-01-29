'use client'

import { useState } from 'react'
import { useDashboardState } from '@/hooks/useDashboardState'
import { calculateCurrentWeek } from '@/lib/dashboardUtils'
import { TaskCategory } from '@/lib/types'
import ProgressCard from '@/components/roadmap/ProgressCard'
import ViewToggle from '@/components/roadmap/ViewToggle'
import TrimesterSection from '@/components/roadmap/TrimesterSection'
import CategorySection from '@/components/roadmap/CategorySection'
import AddTaskModal from '@/components/roadmap/AddTaskModal'

const ALL_CATEGORIES: TaskCategory[] = [
  'Medical',
  'Finance',
  'Gear',
  'Home',
  'Childcare',
  'Admin',
  'Preparation',
]

export default function RoadmapPage() {
  const { userData, tasks, toggleTask, addTask, deleteTask } = useDashboardState()
  const [viewMode, setViewMode] = useState<'trimester' | 'category'>('trimester')
  const [showAddModal, setShowAddModal] = useState(false)

  if (!userData || !tasks) {
    return null
  }

  const currentWeek = calculateCurrentWeek(userData.dueDate)

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Roadmap</h1>
          <p className="text-gray-400 mt-1">
            Track your baby prep tasks and budget milestones.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ViewToggle view={viewMode} onChange={setViewMode} />
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            Add Task
          </button>
        </div>
      </div>

      {/* Progress Card */}
      <ProgressCard tasks={tasks} />

      {/* Task Sections */}
      {viewMode === 'trimester' ? (
        <div className="space-y-6">
          {([1, 2, 3] as const).map(trimester => (
            <TrimesterSection
              key={trimester}
              trimester={trimester}
              tasks={tasks}
              currentWeek={currentWeek}
              onToggleTask={toggleTask}
              onDeleteTask={deleteTask}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {ALL_CATEGORIES.map(category => (
            <CategorySection
              key={category}
              category={category}
              tasks={tasks}
              onToggleTask={toggleTask}
              onDeleteTask={deleteTask}
            />
          ))}
        </div>
      )}

      {/* Add Task Modal */}
      <AddTaskModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={addTask}
      />
    </div>
  )
}
