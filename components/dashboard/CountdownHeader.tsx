'use client'

import { NUMBER_TO_MONTH } from '@/lib/constants'

interface CountdownHeaderProps {
  dueMonth: number  // 1-12
  dueYear: number
}

interface CountdownState {
  weeksRemaining: number
  daysRemainder: number
  trimester: 1 | 2 | 3
  progressPercent: number
  isDeployed: boolean
  targetDateFormatted: string
}

function calculateCountdown(dueMonth: number, dueYear: number): CountdownState {
  const now = new Date()
  const dueDate = new Date(dueYear, dueMonth - 1, 15) // Target 15th of month
  const diffMs = dueDate.getTime() - now.getTime()
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

  const isDeployed = diffDays <= 0
  const totalDaysRemaining = Math.max(0, diffDays)
  const weeksRemaining = Math.floor(totalDaysRemaining / 7)
  const daysRemainder = totalDaysRemaining % 7

  // Estimate trimester based on weeks remaining (40 weeks total pregnancy)
  // If 40 weeks away = trimester 1, if 13 weeks away = trimester 3
  const weeksPregnant = Math.max(0, 40 - weeksRemaining)
  let trimester: 1 | 2 | 3
  if (weeksPregnant <= 13) trimester = 1
  else if (weeksPregnant <= 27) trimester = 2
  else trimester = 3

  // Progress: 0% at conception (40 weeks out), 100% at due date
  const progressPercent = Math.min(100, Math.max(0, (weeksPregnant / 40) * 100))

  // Format target date
  const monthName = NUMBER_TO_MONTH[dueMonth] || 'Unknown'
  const targetDateFormatted = `${monthName} 15, ${dueYear}`

  return {
    weeksRemaining,
    daysRemainder,
    trimester,
    progressPercent,
    isDeployed,
    targetDateFormatted,
  }
}

export default function CountdownHeader({ dueMonth, dueYear }: CountdownHeaderProps) {
  const {
    weeksRemaining,
    daysRemainder,
    trimester,
    progressPercent,
    isDeployed,
    targetDateFormatted,
  } = calculateCountdown(dueMonth, dueYear)

  return (
    <section className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden relative group">
      {/* Background decorative icon */}
      <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
        <span className="material-symbols-outlined text-9xl">schedule</span>
      </div>

      <div className="p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
        <div className="flex flex-col gap-2">
          {/* Mission Status Badge */}
          <div className="flex items-center gap-2 text-primary font-bold tracking-wider text-xs uppercase mb-1">
            <span className="relative flex h-2 w-2">
              {!isDeployed && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              )}
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isDeployed ? 'bg-emerald-500' : 'bg-primary'}`}></span>
            </span>
            Mission Status: {isDeployed ? 'Deployed' : 'Active'}
          </div>

          {/* Time Until Deployment Label */}
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase tracking-wide">
            {isDeployed ? 'Mission Complete' : 'Time Until Deployment'}
          </p>

          {/* Big Countdown */}
          <h2 className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-none font-display">
            {isDeployed ? (
              <span className="text-emerald-500">Congratulations!</span>
            ) : (
              <>
                {weeksRemaining} Week{weeksRemaining !== 1 ? 's' : ''},{' '}
                <span className="text-primary">{daysRemainder} Day{daysRemainder !== 1 ? 's' : ''}</span>
              </>
            )}
          </h2>

          {/* Subtitle with trimester and target date */}
          <p className="text-gray-400 text-sm mt-2">
            Trimester {trimester} &bull; Target Date: {targetDateFormatted}
          </p>
        </div>

        {/* Right side badge (optional readiness indicator) */}
        <div className="flex flex-col items-end gap-2">
          <div className={`px-4 py-2 rounded-lg border ${
            isDeployed
              ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800'
              : 'bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800'
          }`}>
            <span className={`font-semibold text-sm ${
              isDeployed
                ? 'text-emerald-700 dark:text-emerald-400'
                : 'text-green-700 dark:text-green-400'
            }`}>
              {isDeployed ? 'Baby Arrived!' : `${Math.round(progressPercent)}% Complete`}
            </span>
          </div>
        </div>
      </div>

      {/* Progress bar at bottom */}
      <div className="w-full bg-gray-100 dark:bg-gray-800 h-2">
        <div
          className="bg-primary h-2 rounded-r-full transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>
    </section>
  )
}
