import { EncodedPlan } from '@/lib/encoding'
import { formatCurrency } from '@/lib/calculations'

interface WinnerCardProps {
  plan: EncodedPlan
  effectiveCost: number
  savings: number
  runnerUpName: string | null
}

export default function WinnerCard({ plan, effectiveCost, savings, runnerUpName }: WinnerCardProps) {
  return (
    <div className="rounded-xl border border-[#dce5df] dark:border-gray-700 bg-white dark:bg-surface-dark shadow-lg overflow-hidden">
      {/* Green accent bar on top */}
      <div className="h-2 bg-gradient-to-r from-primary to-green-300" />

      <div className="p-6 md:p-8">
        {/* Badge */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-2 bg-primary/10 dark:bg-primary/20 px-3 py-1.5 rounded-full">
            <span className="material-symbols-outlined text-primary text-sm">
              trophy
            </span>
            <span className="text-sm font-bold text-primary uppercase tracking-wide">
              Recommended Plan
            </span>
          </div>
        </div>

        {/* Plan Name */}
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
          {plan.name}
        </h2>

        {/* Description */}
        <p className="text-base text-gray-600 dark:text-gray-400 mb-6">
          This plan offers the best balance of premiums and out-of-pocket costs for your expected needs.
        </p>

        {/* Savings Badge */}
        {savings > 0 && runnerUpName && (
          <div className="flex items-start gap-3 p-4 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg border border-emerald-200 dark:border-emerald-800 mb-6">
            <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-400 text-xl mt-0.5">
              trending_up
            </span>
            <div>
              <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-200">
                You save <span className="text-lg font-bold">{formatCurrency(savings)}</span> compared to {runnerUpName}.
              </p>
            </div>
          </div>
        )}

        {/* Cost Display */}
        <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
            Estimated Annual Cost
          </div>
          <div className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white tracking-tight">
            {formatCurrency(effectiveCost)}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 grid grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-gray-500 dark:text-gray-400 mb-1">Premium/mo</div>
              <div className="font-semibold text-gray-900 dark:text-white">
                {formatCurrency(plan.monthlyPremium)}
              </div>
            </div>
            <div>
              <div className="text-gray-500 dark:text-gray-400 mb-1">Deductible</div>
              <div className="font-semibold text-gray-900 dark:text-white">
                {formatCurrency(plan.familyDeductible)}
              </div>
            </div>
            <div>
              <div className="text-gray-500 dark:text-gray-400 mb-1">OOP Max</div>
              <div className="font-semibold text-gray-900 dark:text-white">
                {formatCurrency(plan.familyOopMax)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
