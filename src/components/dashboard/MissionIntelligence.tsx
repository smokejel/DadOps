'use client'

import { UserData } from '@/lib/types'
import { calculateCurrentWeek, calculateTrimesterDates } from '@/lib/dashboardUtils'

interface MissionIntelligenceProps {
  userData: UserData
}

interface TimelineEvent {
  id: string
  label: string
  date: string
  isPast: boolean
  isCurrent: boolean
}

export default function MissionIntelligence({ userData }: MissionIntelligenceProps) {
  const now = new Date()
  const dueDate = new Date(userData.dueDate.year, userData.dueDate.month - 1, userData.dueDate.day || 15)
  const currentWeek = calculateCurrentWeek(userData.dueDate)
  const trimesterDates = calculateTrimesterDates(userData.dueDate)

  // Calculate key dates
  const events: TimelineEvent[] = []

  // 1. Insurance Deductible Reset (Jan 1 of due year or current year)
  const resetYear = userData.dueDate.month <= 3 ? userData.dueDate.year - 1 : userData.dueDate.year
  const resetDate = new Date(resetYear, 0, 1)
  events.push({
    id: 'deductible-reset',
    label: 'Insurance Deductible Reset',
    date: `January 1, ${resetYear}`,
    isPast: now >= resetDate,
    isCurrent: false,
  })

  // 2. 1st Trimester Start (Conception)
  events.push({
    id: 'first-trimester',
    label: '1st Trimester (Conception)',
    date: trimesterDates.firstTrimesterStart.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    isPast: now >= trimesterDates.firstTrimesterStart,
    isCurrent: false,
  })

  // 3. 2nd Trimester Start (Week 13)
  events.push({
    id: 'second-trimester',
    label: '2nd Trimester Begins',
    date: trimesterDates.secondTrimesterStart.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    isPast: now >= trimesterDates.secondTrimesterStart,
    isCurrent: false,
  })

  // 4. Today
  const todayStr = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  events.push({
    id: 'today',
    label: 'Today',
    date: todayStr,
    isPast: false,
    isCurrent: true,
  })

  // 5. 3rd Trimester Begins (Week 27)
  if (currentWeek < 27) {
    events.push({
      id: 'third-trimester',
      label: '3rd Trimester Begins',
      date: trimesterDates.thirdTrimesterStart.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      isPast: false,
      isCurrent: false,
    })
  }

  // 6. Deployment Day (Due Date)
  events.push({
    id: 'deployment',
    label: 'Deployment Day (Due Date)',
    date: dueDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    isPast: now >= dueDate,
    isCurrent: false,
  })

  // Sort events by date (past events first, then current, then future)
  events.sort((a, b) => {
    if (a.isCurrent) return 0
    if (b.isCurrent) return 0
    if (a.isPast && !b.isPast) return -1
    if (!a.isPast && b.isPast) return 1
    return 0
  })

  return (
    <div className="bg-card-dark rounded-xl p-6 border border-gray-800">
      <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
        <span className="material-symbols-outlined text-primary">event_note</span>
        Mission Intelligence
      </h3>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-gray-700" />

        {/* Events */}
        <div className="space-y-6">
          {events.map((event) => (
            <div key={event.id} className="flex items-start gap-4">
              {/* Dot */}
              <div className={`relative z-10 w-4 h-4 rounded-full border-2 ${
                event.isCurrent
                  ? 'bg-primary border-primary'
                  : event.isPast
                    ? 'bg-gray-600 border-gray-600'
                    : 'bg-gray-800 border-gray-600'
              }`} />

              {/* Content */}
              <div className="flex-1 -mt-0.5">
                <p className={`font-medium ${
                  event.isCurrent ? 'text-primary' : event.isPast ? 'text-gray-500' : 'text-white'
                }`}>
                  {event.label}
                </p>
                <p className="text-sm text-gray-500">{event.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
