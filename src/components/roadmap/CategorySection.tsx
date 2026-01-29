'use client'

import { Task, TaskCategory } from '@/lib/types'
import { CATEGORY_STYLES } from '@/lib/defaultTasks'
import TaskRow from './TaskRow'

interface CategorySectionProps {
  category: TaskCategory
  tasks: Task[]
  onToggleTask: (taskId: string) => void
  onDeleteTask: (taskId: string) => void
}

export default function CategorySection({
  category,
  tasks,
  onToggleTask,
  onDeleteTask,
}: CategorySectionProps) {
  const style = CATEGORY_STYLES[category]
  const categoryTasks = tasks
    .filter(t => t.category === category)
    .sort((a, b) => a.weekDue - b.weekDue)

  const completedCount = categoryTasks.filter(t => t.completed).length
  const allCompleted = categoryTasks.length > 0 && completedCount === categoryTasks.length
  const progressPercent = categoryTasks.length > 0
    ? Math.round((completedCount / categoryTasks.length) * 100)
    : 0

  if (categoryTasks.length === 0) return null

  return (
    <div className="rounded-xl border border-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg ${style.bg} flex items-center justify-center`}>
            <span className={`material-symbols-outlined text-lg ${style.text}`}>
              {style.icon}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-white">{category}</h3>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-400">
            {completedCount} / {categoryTasks.length}
          </div>
          <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${style.progress}`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Tasks */}
      <div className="p-4 space-y-3">
        {categoryTasks.map(task => (
          <TaskRow
            key={task.id}
            task={task}
            onToggle={onToggleTask}
            onDelete={task.userAdded ? onDeleteTask : undefined}
          />
        ))}
      </div>
    </div>
  )
}
