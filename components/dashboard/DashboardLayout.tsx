'use client'

import { useState } from 'react'
import { FullResults, formatDueDate, calculateMonthlySavingsTarget } from '@/lib/calculations'
import { trackLockedModuleClick } from '@/lib/analytics'
import CountdownHeader from './CountdownHeader'
import FinancialStatsRow from './FinancialStatsRow'
import KeyDatesTimeline from './KeyDatesTimeline'
import CostBreakdownCard from './CostBreakdownCard'
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

  // Determine if single plan mode (no comparison needed)
  const singlePlanMode = results.results.length === 1

  // Calculate monthly savings target
  const monthlySavings = calculateMonthlySavingsTarget(
    results.winner.effectiveCost,
    { month: results.dueMonth, year: results.dueYear }
  )

  // Calculate months remaining
  const now = new Date()
  const dueDate = new Date(results.dueYear, results.dueMonth - 1, 15)
  const monthsRemaining = Math.max(1,
    (dueDate.getFullYear() - now.getFullYear()) * 12 +
    (dueDate.getMonth() - now.getMonth())
  )

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

      <div className="max-w-7xl mx-auto px-4 md:px-10 flex flex-col gap-6">
        {/* Row 1: Mission Clock Hero */}
        <CountdownHeader
          dueMonth={results.dueMonth}
          dueYear={results.dueYear}
        />

        {/* Row 2: Financial Stats (3 cards) */}
        <FinancialStatsRow
          totalLiability={results.winner.effectiveCost}
          monthlySavingsGoal={monthlySavings}
          monthsRemaining={monthsRemaining}
          dueMonth={results.dueMonth}
          dueYear={results.dueYear}
          planName={singlePlanMode ? results.winner.plan.name : undefined}
        />

        {/* Row 3: Two-panel layout (Key Dates + Cost Breakdown) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <KeyDatesTimeline
            dueMonth={results.dueMonth}
            dueYear={results.dueYear}
            hasDoubleDeductible={results.doubleDeductibleRisk}
            className="lg:col-span-2"
          />
          <CostBreakdownCard
            plan={results.winner.plan}
            result={results.winner}
            className="lg:col-span-1"
          />
        </div>

        {/* Row 4: Plan Comparison (compare mode only) */}
        {!singlePlanMode && (
          <div>
            <FinancialAnalysisModule results={results} />
          </div>
        )}

        {/* Row 5: Beta Tester Signup */}
        <div>
          <BetaTesterSignup results={results} />
        </div>

        {/* Row 6: Locked Modules Grid */}
        <div>
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
        <div className="mt-6 py-8 border-t border-gray-200 dark:border-gray-700">
          <ResultsActions />
        </div>

        {/* Footer Note */}
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
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
