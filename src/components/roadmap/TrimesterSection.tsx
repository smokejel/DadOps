'use client'

import { useState } from 'react'
import { Task } from '@/lib/types'
import TaskRow from './TaskRow'

interface TrimesterSectionProps {
  trimester: 1 | 2 | 3
  tasks: Task[]
  currentWeek: number
  onToggleTask: (taskId: string) => void
  onDeleteTask: (taskId: string) => void
}

const TRIMESTER_INFO: Record<1 | 2 | 3, { label: string; weeks: string }> = {
  1: { label: 'Trimester 1', weeks: 'Weeks 1-12' },
  2: { label: 'Trimester 2', weeks: 'Weeks 13-26' },
  3: { label: 'Trimester 3', weeks: 'Weeks 27-40' },
}

export default function TrimesterSection({
  trimester,
  tasks,
  currentWeek,
  onToggleTask,
  onDeleteTask,
}: TrimesterSectionProps) {
  const info = TRIMESTER_INFO[trimester]
  const trimesterTasks = tasks
    .filter(t => t.trimester === trimester)
    .sort((a, b) => a.weekDue - b.weekDue)

  const completedCount = trimesterTasks.filter(t => t.completed).length
  const allCompleted = trimesterTasks.length > 0 && completedCount === trimesterTasks.length

  // Determine if we're currently in this trimester
  const isCurrentTrimester =
    (trimester === 1 && currentWeek <= 12) ||
    (trimester === 2 && currentWeek > 12 && currentWeek <= 26) ||
    (trimester === 3 && currentWeek > 26)

  // Default expanded: current trimester expanded, others collapsed
  const [isExpanded, setIsExpanded] = useState(isCurrentTrimester)

  // Status badge
  let statusBadge: { text: string; className: string } | null = null
  if (allCompleted) {
    statusBadge = { text: 'COMPLETED', className: 'bg-gray-700 text-gray-300' }
  } else if (isCurrentTrimester) {
    statusBadge = { text: 'YOU ARE HERE', className: 'bg-primary/20 text-primary' }
  } else if (!allCompleted && trimester > (currentWeek <= 12 ? 1 : currentWeek <= 26 ? 2 : 3)) {
    statusBadge = { text: 'UPCOMING', className: 'bg-gray-700 text-gray-400' }
  }

  return (
    <div className={`rounded-xl border ${
      isCurrentTrimester && !allCompleted
        ? 'border-l-4 border-l-primary border-gray-800'
        : 'border-gray-800'
    }`}>
      {/* Header - Clickable to expand/collapse */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-full flex items-center justify-between p-4 hover:bg-gray-800/50 transition-colors ${
          isExpanded ? 'border-b border-gray-800' : ''
        }`}
      >
        <div className="flex items-center gap-3">
          {allCompleted && (
            <span className="material-symbols-outlined text-primary text-xl">check_circle</span>
          )}
          <h3 className="text-lg font-semibold text-white text-left">
            {info.label} <span className="text-gray-300 font-normal">({info.weeks})</span>
          </h3>
        </div>
        <div className="flex items-center gap-3">
          {statusBadge && (
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusBadge.className}`}>
              {statusBadge.text}
            </span>
          )}
          {isCurrentTrimester && !allCompleted && (
            <span className="text-sm text-gray-300">Week {currentWeek}</span>
          )}
          <span className={`material-symbols-outlined text-gray-400 transition-transform ${
            isExpanded ? 'rotate-180' : ''
          }`}>
            expand_more
          </span>
        </div>
      </button>

      {/* Tasks - Only shown when expanded */}
      {isExpanded && (
        <div className="p-4 space-y-3">
          {trimesterTasks.map(task => (
            <TaskRow
              key={task.id}
              task={task}
              onToggle={onToggleTask}
              onDelete={task.userAdded ? onDeleteTask : undefined}
            />
          ))}
          {trimesterTasks.length === 0 && (
            <p className="text-gray-400 text-center py-4">No tasks for this trimester</p>
          )}
        </div>
      )}
    </div>
  )
}
