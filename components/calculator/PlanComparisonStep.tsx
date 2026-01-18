'use client'

import { useState } from 'react'
import PlanInputCard from './PlanInputCard'
import { CalculatorMode } from './DueDateStep'

interface Plan {
  name: string
  monthlyPremium: string
  familyDeductible: string
  familyOopMax: string
  employerHsa: string
}

interface PlanComparisonStepProps {
  mode: CalculatorMode
  onBack: () => void
  onContinue: (plans: Plan[]) => void
}

export default function PlanComparisonStep({ mode, onBack, onContinue }: PlanComparisonStepProps) {
  const [plan1, setPlan1] = useState<Plan>({
    name: '',
    monthlyPremium: '',
    familyDeductible: '',
    familyOopMax: '',
    employerHsa: '',
  })

  const [plan2, setPlan2] = useState<Plan>({
    name: '',
    monthlyPremium: '',
    familyDeductible: '',
    familyOopMax: '',
    employerHsa: '',
  })

  const [plan3, setPlan3] = useState<Plan | null>(null)

  const isPlanValid = (plan: Plan) => {
    return (
      plan.monthlyPremium !== '' &&
      plan.familyDeductible !== '' &&
      plan.familyOopMax !== ''
    )
  }

  const isFormValid = () => {
    const plan1Valid = isPlanValid(plan1)

    // Single mode only requires Plan 1
    if (mode === 'single') {
      return plan1Valid
    }

    // Compare mode requires Plan 1 and Plan 2
    const plan2Valid = isPlanValid(plan2)
    const plan3Valid = plan3 === null || isPlanValid(plan3)
    return plan1Valid && plan2Valid && plan3Valid
  }

  const handleContinue = () => {
    if (isFormValid()) {
      // Single mode only sends one plan
      if (mode === 'single') {
        onContinue([plan1])
        return
      }

      // Compare mode sends 2-3 plans
      const plans = plan3 ? [plan1, plan2, plan3] : [plan1, plan2]
      onContinue(plans)
    }
  }

  const handleAddThirdPlan = () => {
    setPlan3({
      name: '',
      monthlyPremium: '',
      familyDeductible: '',
      familyOopMax: '',
      employerHsa: '',
    })
  }

  const handleRemoveThirdPlan = () => {
    setPlan3(null)
  }

  return (
    <section id="calculator" className="flex justify-center py-16 md:py-20 bg-white dark:bg-[#1a2c22]">
      <div className="max-w-[1024px] px-4 md:px-10 w-full">
        <div className="flex flex-col gap-8">
          {/* Progress Indicator */}
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
              {mode === 'single' ? 'Step 2 of 3: Plan Details' : 'Step 2 of 3: Compare Plans'}
            </p>
            <div className="w-full h-2 bg-[#dce5df] dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: '66%' }}></div>
            </div>
          </div>

          {/* Heading */}
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl md:text-3xl font-bold text-[#121714] dark:text-white">
              {mode === 'single' ? 'Enter Your Plan Details' : 'Compare Your Plans'}
            </h2>
            <p className="text-base text-gray-600 dark:text-gray-400">
              {mode === 'single'
                ? 'Enter your insurance plan details to calculate your estimated birth costs.'
                : 'Enter the details for up to 3 insurance plans to compare your estimated birth costs.'}
            </p>
          </div>

          {/* Helper Card */}
          <div className="flex flex-col md:flex-row gap-4 bg-primary/5 dark:bg-primary/5 border border-primary/20 rounded-xl p-6">
            <div className="flex-shrink-0 flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-primary/20 rounded-lg">
              <span className="material-symbols-outlined text-primary text-4xl">description</span>
            </div>
            <div className="flex flex-col gap-2">
              <h4 className="text-lg font-bold text-[#121714] dark:text-white">
                Need help finding these numbers?
              </h4>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Look for your <strong>Summary of Benefits and Coverage (SBC)</strong> from your HR portal or insurance website.
                You'll need the "In-Network" amounts for Deductible and Out-of-Pocket Maximum.
              </p>
            </div>
          </div>

          {/* Plan Cards Grid */}
          <div className={`grid grid-cols-1 ${mode === 'compare' ? 'md:grid-cols-2' : ''} gap-6`}>
            {/* Plan 1 */}
            <PlanInputCard
              planNumber={1}
              planName={plan1.name}
              monthlyPremium={plan1.monthlyPremium}
              familyDeductible={plan1.familyDeductible}
              familyOopMax={plan1.familyOopMax}
              employerHsa={plan1.employerHsa}
              onPlanNameChange={(value) => setPlan1({ ...plan1, name: value })}
              onMonthlyPremiumChange={(value) => setPlan1({ ...plan1, monthlyPremium: value })}
              onFamilyDeductibleChange={(value) => setPlan1({ ...plan1, familyDeductible: value })}
              onFamilyOopMaxChange={(value) => setPlan1({ ...plan1, familyOopMax: value })}
              onEmployerHsaChange={(value) => setPlan1({ ...plan1, employerHsa: value })}
              isPrimary={true}
              isDeletable={false}
            />

            {/* Plan 2 - Only shown in compare mode */}
            {mode === 'compare' && (
              <PlanInputCard
                planNumber={2}
                planName={plan2.name}
                monthlyPremium={plan2.monthlyPremium}
                familyDeductible={plan2.familyDeductible}
                familyOopMax={plan2.familyOopMax}
                employerHsa={plan2.employerHsa}
                onPlanNameChange={(value) => setPlan2({ ...plan2, name: value })}
                onMonthlyPremiumChange={(value) => setPlan2({ ...plan2, monthlyPremium: value })}
                onFamilyDeductibleChange={(value) => setPlan2({ ...plan2, familyDeductible: value })}
                onFamilyOopMaxChange={(value) => setPlan2({ ...plan2, familyOopMax: value })}
                onEmployerHsaChange={(value) => setPlan2({ ...plan2, employerHsa: value })}
                isPrimary={false}
                isDeletable={false}
              />
            )}
          </div>

          {/* Plan 3 (Conditional) - Only in compare mode */}
          {mode === 'compare' && plan3 !== null && (
            <div className="max-w-md">
              <PlanInputCard
                planNumber={3}
                planName={plan3.name}
                monthlyPremium={plan3.monthlyPremium}
                familyDeductible={plan3.familyDeductible}
                familyOopMax={plan3.familyOopMax}
                employerHsa={plan3.employerHsa}
                onPlanNameChange={(value) => setPlan3({ ...plan3, name: value })}
                onMonthlyPremiumChange={(value) => setPlan3({ ...plan3, monthlyPremium: value })}
                onFamilyDeductibleChange={(value) => setPlan3({ ...plan3, familyDeductible: value })}
                onFamilyOopMaxChange={(value) => setPlan3({ ...plan3, familyOopMax: value })}
                onEmployerHsaChange={(value) => setPlan3({ ...plan3, employerHsa: value })}
                isPrimary={false}
                isDeletable={true}
                onDelete={handleRemoveThirdPlan}
              />
            </div>
          )}

          {/* Add Third Plan Button - Only in compare mode */}
          {mode === 'compare' && plan3 === null && (
            <div>
              <button
                onClick={handleAddThirdPlan}
                className="flex items-center gap-2 px-6 py-3 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 bg-transparent text-gray-600 dark:text-gray-400 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all"
              >
                <span className="material-symbols-outlined">add_circle</span>
                <span className="font-medium">Add a third plan</span>
              </button>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex flex-col-reverse sm:flex-row gap-4 pt-4">
            <button
              onClick={onBack}
              className="flex h-12 items-center justify-center gap-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-6 text-base font-bold text-[#121714] dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <span className="material-symbols-outlined">arrow_back</span>
              Back
            </button>
            <button
              disabled={!isFormValid()}
              onClick={handleContinue}
              className="flex-1 flex h-12 items-center justify-center gap-2 rounded-lg bg-primary px-6 text-base font-bold text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-600 hover:enabled:-translate-y-0.5 transition-all"
            >
              {mode === 'single' ? 'Calculate My Costs' : 'Calculate Costs'}
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col items-center gap-2">
              <span className="material-symbols-outlined text-primary text-2xl">lock</span>
              <p className="text-xs text-gray-600 dark:text-gray-400">256-bit Secure Encryption</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="material-symbols-outlined text-primary text-2xl">block</span>
              <div className="flex flex-col items-center">
                <p className="text-xs font-semibold text-gray-900 dark:text-white">No Data Stored</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">We can't sell your data because we don't save it</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="material-symbols-outlined text-primary text-2xl">visibility_off</span>
              <p className="text-xs text-gray-600 dark:text-gray-400">No Data Sold</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
