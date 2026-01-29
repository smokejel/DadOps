'use client'

import { UserData, Task } from '@/lib/types'
import { calculateCountdown, formatDueDate } from '@/lib/dashboardUtils'

interface CountdownCardProps {
  userData: UserData
  tasks: Task[]
}

export default function CountdownCard({ userData, tasks }: CountdownCardProps) {
  const countdown = calculateCountdown(userData.dueDate)
  const completedTasks = tasks.filter(t => t.completed).length
  const totalTasks = tasks.length
  const readinessPercent = Math.round((completedTasks / totalTasks) * 100)

  return (
    <div className="bg-card-dark rounded-xl p-6 border border-gray-800">
      {/* Mission Status Badge */}
      <div className="flex items-center gap-2 mb-4">
        <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          MISSION STATUS: ACTIVE
        </span>
      </div>

      {/* Countdown */}
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
        {countdown.isPast ? (
          "Baby has arrived!"
        ) : (
          <>
            {countdown.weeks} Weeks, {countdown.days} Days{' '}
            <span className="text-gray-400 font-normal">until Deployment</span>
          </>
        )}
      </h2>

      {/* Target Date */}
      <p className="text-gray-400 mb-6">
        Target Date: {formatDueDate(userData.dueDate)}
      </p>

      {/* Readiness Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Readiness Level</span>
          <span className="text-primary font-medium">{readinessPercent}%</span>
        </div>
        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${readinessPercent}%` }}
          />
        </div>
      </div>
    </div>
  )
}
