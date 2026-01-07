import { FullResults, formatCurrency } from '@/lib/calculations'

interface CalculationExplainerProps {
  results: FullResults
}

export default function CalculationExplainer({ results }: CalculationExplainerProps) {
  const { winner } = results

  return (
    <div className="rounded-xl border border-[#dce5df] dark:border-gray-700 bg-white dark:bg-surface-dark p-6 md:p-8">
      {/* Section Title */}
      <div className="flex items-center gap-3 mb-6">
        <span className="material-symbols-outlined text-primary text-3xl">
          calculate
        </span>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          The Math: How We Calculated This
        </h2>
      </div>

      {/* Formula Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Step 1: Fixed Costs */}
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 text-xs font-bold text-gray-600 dark:text-gray-400">
              1
            </span>
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Fixed Costs
            </h3>
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {formatCurrency(winner.annualPremium)}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Monthly Premium ({formatCurrency(winner.plan.monthlyPremium)}) × 12 months. This is what you pay regardless of doctor visits.
          </p>
        </div>

        {/* Operator */}
        <div className="hidden md:flex items-center justify-center">
          <span className="text-4xl font-light text-gray-400 dark:text-gray-600">+</span>
        </div>

        {/* Step 2: Medical Costs */}
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 text-xs font-bold text-gray-600 dark:text-gray-400">
              2
            </span>
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Medical Costs
            </h3>
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {formatCurrency(winner.expectedOop)}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {winner.doubleDeductibleRisk
              ? `Deductible (${formatCurrency(winner.plan.familyDeductible)}) + OOP Max (${formatCurrency(winner.plan.familyOopMax)}) due to double deductible scenario.`
              : `Estimated out-of-pocket costs for prenatal visits, delivery, and postnatal care (up to your OOP maximum of ${formatCurrency(winner.plan.familyOopMax)}).`
            }
          </p>
        </div>
      </div>

      {/* Step 3: Tax Savings (if applicable) */}
      {winner.plan.employerHsa > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="md:col-start-1">
            <div className="hidden md:flex items-center justify-center mb-4">
              <span className="text-4xl font-light text-gray-400 dark:text-gray-600">−</span>
            </div>
          </div>

          <div className="md:col-start-2">
            {/* Operator on mobile */}
            <div className="md:hidden flex items-center justify-center mb-4">
              <span className="text-4xl font-light text-gray-400 dark:text-gray-600">−</span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                3
              </span>
              <h3 className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
                Employer HSA
              </h3>
            </div>
            <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">
              {formatCurrency(winner.plan.employerHsa)}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Your employer's HSA/HRA contribution reduces your out-of-pocket costs.
            </p>
          </div>
        </div>
      )}

      {/* Equals Line */}
      <div className="border-t-2 border-gray-200 dark:border-gray-700 mb-6" />

      {/* Final Result */}
      <div className="flex items-center justify-between p-4 bg-primary/5 dark:bg-primary/10 rounded-lg">
        <div>
          <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">
            Estimated Total Annual Cost
          </div>
          <div className="text-4xl font-bold text-primary">
            {formatCurrency(winner.effectiveCost)}
          </div>
        </div>
        <span className="material-symbols-outlined text-primary text-5xl">
          equal
        </span>
      </div>

      {/* Disclaimer */}
      <p className="mt-6 text-sm italic text-gray-500 dark:text-gray-400">
        *Estimates assume in-network providers and hitting your family out-of-pocket maximum during the birth year, which is statistically likely for families with pregnancy and birth costs.
        {winner.plan.employerHsa > 0 && ' Tax savings based on employer HSA contribution.'}
      </p>
    </div>
  )
}
