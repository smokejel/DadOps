'use client'

import Link from 'next/link'
import { Task } from '@/lib/types'
import { CATEGORY_STYLES } from '@/lib/defaultTasks'

interface UpcomingTasksProps {
  tasks: Task[]
  onToggleTask: (taskId: string) => void
}

export default function UpcomingTasks({ tasks, onToggleTask }: UpcomingTasksProps) {
  // Get next 5 incomplete tasks sorted by weekDue
  const upcomingTasks = tasks
    .filter(t => !t.completed)
    .sort((a, b) => a.weekDue - b.weekDue)
    .slice(0, 5)

  return (
    <div className="bg-card-dark rounded-xl p-6 border border-gray-800">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">task_alt</span>
          Upcoming Tasks
        </h3>
        <Link
          href="/dashboard/roadmap"
          className="text-sm text-primary hover:text-primary-dark transition-colors"
        >
          View All
        </Link>
      </div>

      {upcomingTasks.length === 0 ? (
        <p className="text-gray-300 text-center py-8">
          All tasks complete! Great job, Dad!
        </p>
      ) : (
        <div className="space-y-3">
          {upcomingTasks.map((task) => {
            const style = CATEGORY_STYLES[task.category]

            return (
              <div
                key={task.id}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-800/50 transition-colors"
              >
                {/* Checkbox */}
                <button
                  onClick={() => onToggleTask(task.id)}
                  className="flex-shrink-0 w-5 h-5 mt-0.5 rounded border border-gray-600 hover:border-primary transition-colors flex items-center justify-center"
                >
                  {task.completed && (
                    <span className="material-symbols-outlined text-primary text-sm">check</span>
                  )}
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">{task.title}</p>
                  {task.isHighStakes && task.consequence && (
                    <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">warning</span>
                      {task.consequence}
                    </p>
                  )}
                </div>

                {/* Category & Week */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${style.bg} ${style.text}`}>
                    {task.category}
                  </span>
                  <span className="text-xs text-gray-400 whitespace-nowrap">
                    Week {task.weekDue}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
