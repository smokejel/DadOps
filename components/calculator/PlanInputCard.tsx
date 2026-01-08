'use client'

interface PlanInputCardProps {
  planNumber: number
  planName: string
  monthlyPremium: string
  familyDeductible: string
  familyOopMax: string
  employerHsa: string
  onPlanNameChange: (value: string) => void
  onMonthlyPremiumChange: (value: string) => void
  onFamilyDeductibleChange: (value: string) => void
  onFamilyOopMaxChange: (value: string) => void
  onEmployerHsaChange: (value: string) => void
  onDelete?: () => void
  isPrimary?: boolean
  isDeletable?: boolean
}

export default function PlanInputCard({
  planNumber,
  planName,
  monthlyPremium,
  familyDeductible,
  familyOopMax,
  employerHsa,
  onPlanNameChange,
  onMonthlyPremiumChange,
  onFamilyDeductibleChange,
  onFamilyOopMaxChange,
  onEmployerHsaChange,
  onDelete,
  isPrimary = false,
  isDeletable = false,
}: PlanInputCardProps) {
  const formatCurrency = (value: string) => {
    // Remove non-digits
    const numbers = value.replace(/\D/g, '')
    return numbers
  }

  return (
    <div className="relative flex flex-col gap-5 bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
      {/* Top Accent Bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-primary rounded-t-xl"></div>

      {/* Header */}
      <div className="flex items-center justify-between pt-2 pb-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <h3 className="text-xl font-bold text-[#121714] dark:text-white">
            Plan {planNumber}
          </h3>
          {isPrimary && (
            <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded uppercase">
              Primary
            </span>
          )}
        </div>
        {isDeletable && onDelete && (
          <button
            onClick={onDelete}
            className="text-gray-400 hover:text-red-500 transition-colors"
            aria-label="Delete plan"
          >
            <span className="material-symbols-outlined text-xl">delete</span>
          </button>
        )}
      </div>

      {/* Form Fields */}
      <div className="flex flex-col gap-5">
        {/* Plan Name (Optional) */}
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
            Plan Nickname <span className="text-gray-400">(optional)</span>
          </span>
          <input
            type="text"
            value={planName}
            onChange={(e) => onPlanNameChange(e.target.value)}
            placeholder={`Plan ${String.fromCharCode(64 + planNumber)}`}
            className="w-full h-12 px-4 rounded-lg border border-[#dce5df] dark:border-gray-600 bg-white dark:bg-gray-800 text-[#121714] dark:text-white text-base focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
          />
        </label>

        {/* Monthly Premium (Required) */}
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center gap-1">
            Monthly Premium <span className="text-red-500">*</span>
            <span
              className="material-symbols-outlined text-gray-400 text-[16px] cursor-help"
              title="The amount you pay each month for insurance coverage"
            >
              info
            </span>
          </span>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input
              type="number"
              inputMode="numeric"
              min="0"
              step="1"
              value={monthlyPremium}
              onChange={(e) => onMonthlyPremiumChange(formatCurrency(e.target.value))}
              placeholder="0"
              className="w-full h-12 pl-8 pr-12 rounded-lg border border-[#dce5df] dark:border-gray-600 bg-white dark:bg-gray-800 text-[#121714] dark:text-white text-base focus:border-primary focus:ring-1 focus:ring-primary transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">/mo</span>
          </div>
        </label>

        {/* Family Deductible (Required) */}
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center gap-1">
            Family Deductible <span className="text-red-500">*</span>
            <span
              className="material-symbols-outlined text-gray-400 text-[16px] cursor-help"
              title="The amount you pay before insurance starts covering costs"
            >
              info
            </span>
          </span>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input
              type="number"
              inputMode="numeric"
              min="0"
              step="1"
              value={familyDeductible}
              onChange={(e) => onFamilyDeductibleChange(formatCurrency(e.target.value))}
              placeholder="0"
              className="w-full h-12 pl-8 pr-4 rounded-lg border border-[#dce5df] dark:border-gray-600 bg-white dark:bg-gray-800 text-[#121714] dark:text-white text-base focus:border-primary focus:ring-1 focus:ring-primary transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
        </label>

        {/* Family Out-of-Pocket Max (Required) */}
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center gap-1">
            Family Out-of-Pocket Max <span className="text-red-500">*</span>
            <span
              className="material-symbols-outlined text-gray-400 text-[16px] cursor-help"
              title="The maximum amount you'll pay in a year before insurance covers 100%"
            >
              info
            </span>
          </span>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input
              type="number"
              inputMode="numeric"
              min="0"
              step="1"
              value={familyOopMax}
              onChange={(e) => onFamilyOopMaxChange(formatCurrency(e.target.value))}
              placeholder="0"
              className="w-full h-12 pl-8 pr-4 rounded-lg border border-[#dce5df] dark:border-gray-600 bg-white dark:bg-gray-800 text-[#121714] dark:text-white text-base focus:border-primary focus:ring-1 focus:ring-primary transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
        </label>

        {/* Employer HSA/HRA Contribution (Optional) */}
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center gap-1">
            Employer HSA/HRA Contribution <span className="text-gray-400">(optional)</span>
            <span
              className="material-symbols-outlined text-gray-400 text-[16px] cursor-help"
              title="Annual amount your employer contributes to your HSA or HRA"
            >
              info
            </span>
          </span>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input
              type="number"
              inputMode="numeric"
              min="0"
              step="1"
              value={employerHsa}
              onChange={(e) => onEmployerHsaChange(formatCurrency(e.target.value))}
              placeholder="0"
              className="w-full h-12 pl-8 pr-4 rounded-lg border border-[#dce5df] dark:border-gray-600 bg-white dark:bg-gray-800 text-[#121714] dark:text-white text-base focus:border-primary focus:ring-1 focus:ring-primary transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
        </label>
      </div>
    </div>
  )
}
