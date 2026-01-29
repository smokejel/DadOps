'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useDashboardState } from '@/hooks/useDashboardState'
import { InsurancePlan, PlanComparison } from '@/lib/types'
import { comparePlans } from '@/lib/compareUtils'
import { MONTH_NAMES } from '@/lib/constants'
import PlanForm from '@/components/compare/PlanForm'
import ComparisonResults from '@/components/compare/ComparisonResults'

const createEmptyPlan = (id: string, nickname: string): InsurancePlan => ({
  id,
  nickname,
  monthlyPremium: 0,
  familyDeductible: 0,
  familyOopMax: 0,
  employerHsa: 0,
})

export default function ComparePage() {
  const router = useRouter()
  const { userData, setUserData } = useDashboardState()

  // Due date state
  const [dueMonth, setDueMonth] = useState(userData?.dueDate.month || 6)
  const [dueYear, setDueYear] = useState(userData?.dueDate.year || new Date().getFullYear() + 1)

  // Create initial plans with user data prefilled
  const initialPlans = useMemo((): InsurancePlan[] => {
    const insurance = userData?.insurance
    const firstPlan = insurance
      ? {
          id: 'plan-1',
          nickname: insurance.planName || 'Current Plan',
          monthlyPremium: insurance.monthlyPremium,
          familyDeductible: insurance.familyDeductible,
          familyOopMax: insurance.familyOopMax,
          employerHsa: insurance.employerHsa,
        }
      : createEmptyPlan('plan-1', 'Plan A')

    return [firstPlan, createEmptyPlan('plan-2', 'Plan B')]
  }, [userData])

  // Plans state
  const [plans, setPlans] = useState<InsurancePlan[]>(initialPlans)
  const [showThirdPlan, setShowThirdPlan] = useState(false)

  // Results state
  const [results, setResults] = useState<PlanComparison[] | null>(null)
  const [hasCalculated, setHasCalculated] = useState(false)

  const updatePlan = (index: number, plan: InsurancePlan) => {
    setPlans(prev => {
      const newPlans = [...prev]
      newPlans[index] = plan
      return newPlans
    })
    setHasCalculated(false)
  }

  const addThirdPlan = () => {
    setPlans(prev => [...prev, createEmptyPlan('plan-3', 'Plan C')])
    setShowThirdPlan(true)
  }

  const removeThirdPlan = () => {
    setPlans(prev => prev.slice(0, 2))
    setShowThirdPlan(false)
    setHasCalculated(false)
  }

  const handleCalculate = () => {
    // Filter out plans with no data
    const validPlans = plans.filter(p => p.monthlyPremium > 0 || p.familyOopMax > 0)

    if (validPlans.length === 0) {
      return
    }

    const comparisons = comparePlans(validPlans, { month: dueMonth, year: dueYear })
    setResults(comparisons)
    setHasCalculated(true)
  }

  const handleSelectPlan = (comparison: PlanComparison) => {
    if (!userData) return

    // Update user data with selected plan
    const updatedUserData = {
      ...userData,
      dueDate: { ...userData.dueDate, month: dueMonth, year: dueYear },
      insurance: {
        planName: comparison.plan.nickname,
        monthlyPremium: comparison.plan.monthlyPremium,
        familyDeductible: comparison.plan.familyDeductible,
        familyOopMax: comparison.plan.familyOopMax,
        employerHsa: comparison.plan.employerHsa,
      },
    }

    setUserData(updatedUserData)
    router.push('/dashboard')
  }

  // Calculate months remaining
  const now = new Date()
  const dueDateTime = new Date(dueYear, dueMonth - 1, 15)
  const monthsRemaining = Math.max(
    1,
    (dueDateTime.getFullYear() - now.getFullYear()) * 12 +
      (dueDateTime.getMonth() - now.getMonth())
  )

  // Generate year options
  const currentYear = new Date().getFullYear()
  const yearOptions = [currentYear, currentYear + 1, currentYear + 2]

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Compare Your Plans</h1>
        <p className="text-gray-400">
          Enter the details for up to 3 insurance plans to find your best option.
          You can find these numbers in your Summary of Benefits and Coverage (SBC) document.
        </p>
      </div>

      {/* Due Date Selection */}
      <div className="bg-card-dark rounded-xl p-6 border border-gray-800">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">calendar_month</span>
          Expected Due Date
        </h3>

        <div className="grid grid-cols-2 gap-4 max-w-md">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Month</label>
            <select
              value={dueMonth}
              onChange={(e) => {
                setDueMonth(parseInt(e.target.value))
                setHasCalculated(false)
              }}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-primary"
            >
              {MONTH_NAMES.map((month, index) => (
                <option key={month} value={index + 1}>
                  {month}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Year</label>
            <select
              value={dueYear}
              onChange={(e) => {
                setDueYear(parseInt(e.target.value))
                setHasCalculated(false)
              }}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-primary"
            >
              {yearOptions.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Plan Forms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PlanForm
          plan={plans[0]}
          onChange={(plan) => updatePlan(0, plan)}
          isPrimary
        />
        <PlanForm
          plan={plans[1]}
          onChange={(plan) => updatePlan(1, plan)}
        />
      </div>

      {/* Third Plan */}
      {showThirdPlan ? (
        <div className="max-w-[calc(50%-12px)]">
          <PlanForm
            plan={plans[2]}
            onChange={(plan) => updatePlan(2, plan)}
            onRemove={removeThirdPlan}
          />
        </div>
      ) : (
        <button
          onClick={addThirdPlan}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <span className="material-symbols-outlined">add_circle</span>
          Add a third plan
        </button>
      )}

      {/* Calculate Button */}
      <div className="flex justify-center pt-4">
        <button
          onClick={handleCalculate}
          className="px-8 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2"
        >
          <span className="material-symbols-outlined">calculate</span>
          Calculate Costs
        </button>
      </div>

      {/* Results */}
      {hasCalculated && results && results.length > 0 && (
        <div className="pt-8 border-t border-gray-800">
          <ComparisonResults
            comparisons={results}
            dueDate={{ month: dueMonth, year: dueYear }}
            monthsRemaining={monthsRemaining}
            onSelectPlan={handleSelectPlan}
          />
        </div>
      )}

      {/* Help Text */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mt-8">
        <div className="flex gap-3">
          <span className="material-symbols-outlined text-blue-400">info</span>
          <div>
            <h4 className="font-semibold text-blue-400">Where to find these numbers</h4>
            <p className="text-sm text-gray-300 mt-1">
              Look for your Summary of Benefits and Coverage (SBC) document from your employer
              or insurance provider. Key numbers to find: monthly premium (your paycheck deduction),
              family deductible, family out-of-pocket maximum, and any employer HSA/HRA contributions.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
