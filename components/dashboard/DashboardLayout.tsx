'use client'

import { useState } from 'react'
import { FullResults, formatDueDate } from '@/lib/calculations'
import { trackLockedModuleClick } from '@/lib/analytics'
import FinancialAnalysisModule from './FinancialAnalysisModule'
import LockedModuleCard from './LockedModuleCard'
import ResultsActions from '../results/ResultsActions'
import Toast from './Toast'
import BetaTesterSignup from './BetaTesterSignup'

interface DashboardLayoutProps {
  results: FullResults
}

export default function DashboardLayout({ results }: DashboardLayoutProps) {
  const [toast, setToast] = useState<{ message: string; type: 'info' } | null>(null)

  const handleLockedModuleClick = (moduleName: 'Deployment Timeline' | 'Logistics & Gear' | 'Readiness Score') => {
    // Track the click event
    trackLockedModuleClick(moduleName)

    // Show toast notification
    setToast({
      message: `${moduleName} is coming in Q2 2026! Stay tuned for this exciting feature.`,
      type: 'info',
    })
  }

  const closeToast = () => {
    setToast(null)
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark py-12">
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={closeToast}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 md:px-10">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Your DadOps Dashboard
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Based on a due date of {formatDueDate(results.dueMonth, results.dueYear)}
          </p>
        </div>

        {/* Financial Analysis Module (Active) */}
        <div className="mb-8">
          <FinancialAnalysisModule results={results} />
        </div>

        {/* Beta Tester Signup */}
        <div className="mb-8">
          <BetaTesterSignup results={results} />
        </div>

        {/* Locked Modules Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            More Tools Coming Soon
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Deployment Timeline (Roadmap) */}
            <LockedModuleCard
              title="Deployment Timeline"
              description="Track your journey with a week-by-week roadmap of tasks and milestones."
              icon="calendar_month"
              onClick={() => handleLockedModuleClick('Deployment Timeline')}
            />

            {/* Logistics & Gear (Go-Bag) */}
            <LockedModuleCard
              title="Logistics & Gear"
              description="Complete checklists for hospital bags, nursery setup, and essential gear."
              icon="backpack"
              onClick={() => handleLockedModuleClick('Logistics & Gear')}
            />

            {/* Readiness Score */}
            <LockedModuleCard
              title="Readiness Score"
              description="Assess your preparedness across finances, logistics, and emotional readiness."
              icon="verified"
              onClick={() => handleLockedModuleClick('Readiness Score')}
            />
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="mt-12 py-8 border-t border-gray-200 dark:border-gray-700">
          <ResultsActions />
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            Questions about your results?{' '}
            <a href="/#calculator" className="text-primary hover:underline">
              Run another calculation
            </a>
            {' '}or{' '}
            <a href="mailto:admin@dadops.one" className="text-primary hover:underline">
              contact support
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
