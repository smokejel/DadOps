'use client'

import { Task } from '@/lib/types'
import { CATEGORY_STYLES } from '@/lib/defaultTasks'

interface TaskRowProps {
  task: Task
  onToggle: (taskId: string) => void
  onDelete?: (taskId: string) => void
}

export default function TaskRow({ task, onToggle, onDelete }: TaskRowProps) {
  const style = CATEGORY_STYLES[task.category]

  return (
    <div className={`group flex items-start gap-4 p-4 rounded-lg border transition-colors ${
      task.completed ? 'bg-gray-800/30 border-gray-800' : 'bg-card-dark border-gray-800 hover:border-gray-700'
    }`}>
      {/* Checkbox */}
      <button
        onClick={() => onToggle(task.id)}
        className={`flex-shrink-0 w-5 h-5 mt-0.5 rounded border-2 transition-colors flex items-center justify-center ${
          task.completed
            ? 'bg-primary border-primary'
            : 'border-gray-500 hover:border-primary'
        }`}
      >
        {task.completed && (
          <span className="material-symbols-outlined text-white text-sm">check</span>
        )}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={`font-medium ${task.completed ? 'text-gray-500 line-through' : 'text-white'}`}>
          {task.title}
        </p>
        <p className={`text-sm mt-1 ${task.completed ? 'text-gray-600' : 'text-gray-400'}`}>
          {task.description}
        </p>
        {task.isHighStakes && task.consequence && !task.completed && (
          <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
            <span className="material-symbols-outlined text-xs">warning</span>
            {task.consequence}
          </p>
        )}
      </div>

      {/* Category & Week */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <span className={`px-2 py-1 rounded text-xs font-medium flex items-center gap-1 ${style.bg} ${style.text}`}>
          <span className="material-symbols-outlined text-sm">{style.icon}</span>
          {task.category}
        </span>
        <span className="px-2 py-1 rounded bg-gray-700 text-gray-300 text-xs font-medium">
          Week {task.weekDue}
        </span>

        {/* Delete button for user-added tasks */}
        {task.userAdded && onDelete && (
          <button
            onClick={() => onDelete(task.id)}
            className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-all"
          >
            <span className="material-symbols-outlined text-lg">delete</span>
          </button>
        )}
      </div>
    </div>
  )
}
