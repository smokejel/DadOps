import { CalculationResult, formatCurrency } from '@/lib/calculations'

interface ComparisonTableProps {
  results: CalculationResult[]
  isBlurred?: boolean
}

export default function ComparisonTable({ results, isBlurred = false }: ComparisonTableProps) {
  return (
    <div className="relative">
      {/* Desktop: Table View */}
      <div className="hidden md:block">
        <div className="rounded-xl border border-[#dce5df] dark:border-gray-700 bg-white dark:bg-surface-dark shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Plan
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Annual Premium
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Expected OOP
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Employer HSA
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Est. Total Cost
                </th>
              </tr>
            </thead>
            <tbody className={isBlurred ? 'select-none' : ''}>
              {results.map((result, index) => (
                <tr
                  key={result.plan.id}
                  className={`border-b border-gray-200 dark:border-gray-700 last:border-b-0 transition-colors ${
                    index === 0
                      ? 'bg-green-50 dark:bg-green-900/20'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                  }`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`font-bold ${index === 0 ? 'text-primary' : 'text-gray-900 dark:text-white'}`}>
                        {result.plan.name}
                      </span>
                      {index === 0 && (
                        <span className="material-symbols-outlined text-primary text-lg">
                          star
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right text-gray-700 dark:text-gray-300">
                    {formatCurrency(result.annualPremium)}
                  </td>
                  <td className="px-6 py-4 text-right text-gray-700 dark:text-gray-300">
                    {formatCurrency(result.expectedOop)}
                  </td>
                  <td className="px-6 py-4 text-right text-emerald-600 dark:text-emerald-400 font-medium">
                    {result.plan.employerHsa > 0 ? `-${formatCurrency(result.plan.employerHsa)}` : '$0'}
                  </td>
                  <td className={`px-6 py-4 text-right font-bold text-lg ${index === 0 ? 'text-primary' : 'text-gray-900 dark:text-white'}`}>
                    {formatCurrency(result.effectiveCost)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile: Card View */}
      <div className="md:hidden flex flex-col gap-4">
        {results.map((result, index) => (
          <div
            key={result.plan.id}
            className={`p-6 rounded-xl border-2 ${
              index === 0
                ? 'border-primary bg-green-50 dark:bg-green-900/20'
                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-surface-dark'
            } ${isBlurred ? 'select-none' : ''}`}
          >
            {/* Plan Name & Badge */}
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-xl font-bold ${index === 0 ? 'text-primary' : 'text-gray-900 dark:text-white'}`}>
                {result.plan.name}
              </h3>
              {index === 0 && (
                <span className="flex items-center gap-1 text-xs bg-primary text-white px-3 py-1 rounded-full uppercase font-bold">
                  <span className="material-symbols-outlined text-sm">star</span>
                  Winner
                </span>
              )}
            </div>

            {/* Cost Details */}
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Annual Premium</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {formatCurrency(result.annualPremium)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Expected OOP</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {formatCurrency(result.expectedOop)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Employer HSA</span>
                <span className="font-medium text-emerald-600 dark:text-emerald-400">
                  {result.plan.employerHsa > 0 ? `-${formatCurrency(result.plan.employerHsa)}` : '$0'}
                </span>
              </div>
              <div className="flex justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                <span className="font-bold text-gray-900 dark:text-white">Est. Total Cost</span>
                <span className={`font-bold text-xl ${index === 0 ? 'text-primary' : 'text-gray-900 dark:text-white'}`}>
                  {formatCurrency(result.effectiveCost)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Blur Overlay (for teaser mode) */}
      {isBlurred && (
        <div className="absolute inset-0 backdrop-blur-md bg-white/30 dark:bg-black/50 pointer-events-none rounded-xl" />
      )}
    </div>
  )
}
