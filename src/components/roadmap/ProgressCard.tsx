'use client'

import { Task } from '@/lib/types'

interface ProgressCardProps {
  tasks: Task[]
}

export default function ProgressCard({ tasks }: ProgressCardProps) {
  const completedCount = tasks.filter(t => t.completed).length
  const totalCount = tasks.length
  const percent = Math.round((completedCount / totalCount) * 100)

  // Find next milestone (first incomplete task)
  const nextTask = tasks
    .filter(t => !t.completed)
    .sort((a, b) => a.weekDue - b.weekDue)[0]

  return (
    <div className="bg-card-dark rounded-xl p-6 border border-gray-800">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-1">Total Progress</h3>
          <p className="text-gray-300 text-sm mb-4">
            You&apos;re crushing it, Dad. Keep the momentum going.
          </p>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${percent}%` }}
              />
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">
                {completedCount} of {totalCount} tasks complete
              </span>
              {nextTask && (
                <span className="text-gray-400">
                  Next milestone: {nextTask.title}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Percentage */}
        <div className="text-right">
          <span className="text-4xl font-bold text-primary">{percent}%</span>
        </div>
      </div>
    </div>
  )
}
