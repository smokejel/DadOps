import { FullResults } from '@/lib/calculations'
import WarningBanner from '../results/WarningBanner'
import WinnerCard from '../results/WinnerCard'
import ComparisonTable from '../results/ComparisonTable'
import CalculationExplainer from '../results/CalculationExplainer'

interface FinancialAnalysisModuleProps {
  results: FullResults
}

export default function FinancialAnalysisModule({ results }: FinancialAnalysisModuleProps) {
  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 dark:bg-primary/20">
          <span className="material-symbols-outlined text-primary text-2xl">
            account_balance
          </span>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Financial Analysis
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Your personalized insurance plan comparison
          </p>
        </div>
      </div>

      {/* Warning Banner (if applicable) */}
      {results.doubleDeductibleRisk && (
        <WarningBanner
          type="double-deductible"
          title="Double Deductible Alert"
          message="Your pregnancy spans two calendar years, which means you may hit deductibles in both years. We've factored this into our calculations."
        />
      )}

      {/* Info Banner - Baby Deductible */}
      <WarningBanner
        type="info"
        title="Important: Baby's Coverage"
        message="Your baby gets their own deductible immediately at birth. You have 30 days after birth to add your baby to your insurance plan."
      />

      {/* Winner Card */}
      <WinnerCard
        plan={results.winner.plan}
        effectiveCost={results.winner.effectiveCost}
        savings={results.savings}
        runnerUpName={results.runnerUp?.plan.name || null}
      />

      {/* Detailed Comparison Table */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Detailed Comparison
        </h3>
        <ComparisonTable results={results.results} isBlurred={false} />
      </div>

      {/* The Math Section */}
      <CalculationExplainer results={results} />
    </div>
  )
}
