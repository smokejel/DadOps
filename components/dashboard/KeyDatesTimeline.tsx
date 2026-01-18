'use client'

import { NUMBER_TO_MONTH } from '@/lib/constants'

interface KeyDatesTimelineProps {
  dueMonth: number
  dueYear: number
  hasDoubleDeductible: boolean
  className?: string
}

interface TimelineItem {
  date: string
  label: string
  description: string
  icon: string
  isWarning: boolean
}

function generateTimelineDates(
  dueMonth: number,
  dueYear: number,
  hasDoubleDeductible: boolean
): TimelineItem[] {
  const items: TimelineItem[] = []

  // 1. Jan 1 deductible reset (only if double deductible)
  if (hasDoubleDeductible) {
    items.push({
      date: `Jan 1, ${dueYear}`,
      label: 'Deductible Resets',
      description: 'New deductible year begins - prenatal costs from prior year don\'t count',
      icon: 'warning',
      isWarning: true,
    })
  }

  // 2. Due date
  const monthName = NUMBER_TO_MONTH[dueMonth] || 'Unknown'
  items.push({
    date: `${monthName} 15, ${dueYear}`,
    label: 'Expected Due Date',
    description: 'Birth expenses will likely push you to your out-of-pocket maximum',
    icon: 'child_care',
    isWarning: false,
  })

  // 3. Add baby deadline (30 days after due date)
  const dueDate = new Date(dueYear, dueMonth - 1, 15)
  dueDate.setDate(dueDate.getDate() + 30)
  const addBabyMonth = NUMBER_TO_MONTH[dueDate.getMonth() + 1] || 'Unknown'
  const addBabyDay = dueDate.getDate()
  const addBabyYear = dueDate.getFullYear()

  items.push({
    date: `${addBabyMonth} ${addBabyDay}, ${addBabyYear}`,
    label: 'Insurance Deadline',
    description: 'You have 30 days from birth to add baby to your insurance plan',
    icon: 'assignment_add',
    isWarning: false,
  })

  return items
}

export default function KeyDatesTimeline({
  dueMonth,
  dueYear,
  hasDoubleDeductible,
  className = '',
}: KeyDatesTimelineProps) {
  const timelineItems = generateTimelineDates(dueMonth, dueYear, hasDoubleDeductible)

  return (
    <div className={`bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col ${className}`}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <span className="material-symbols-outlined text-base text-green-500">calendar_month</span>
          Key Financial Dates
        </h3>
      </div>

      {/* Timeline Items */}
      <div className="p-2 flex flex-col">
        {timelineItems.map((item, index) => (
          <div
            key={index}
            className="group flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors border-b border-gray-50 dark:border-gray-800 last:border-0"
          >
            <div className="flex items-center gap-4">
              {/* Icon */}
              <div className={`p-2 rounded-lg ${
                item.isWarning
                  ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400'
                  : 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
              }`}>
                <span className="material-symbols-outlined">{item.icon}</span>
              </div>

              {/* Label and Description */}
              <div className="flex flex-col">
                <span className="text-gray-800 dark:text-gray-200 font-semibold text-sm group-hover:text-primary transition-colors">
                  {item.label}
                </span>
                <span className="text-xs text-gray-400 max-w-md">
                  {item.description}
                </span>
              </div>
            </div>

            {/* Date Badge */}
            <div className="flex items-center gap-3">
              <span className={`px-2 py-1 text-xs font-bold rounded uppercase tracking-wide ${
                item.isWarning
                  ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                  : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
              }`}>
                {item.date}
              </span>
              <span className="material-symbols-outlined text-gray-300 group-hover:text-gray-500">
                chevron_right
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
