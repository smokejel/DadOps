'use client'

import { useState } from 'react'

export type CalculatorMode = 'compare' | 'single'

interface DueDateStepProps {
  onContinue: (data: { month: string; year: string; mode: CalculatorMode }) => void
}

export default function DueDateStep({ onContinue }: DueDateStepProps) {
  const [month, setMonth] = useState<string>('')
  const [year, setYear] = useState<string>('')
  const [mode, setMode] = useState<CalculatorMode>('compare')

  const isFormValid = month !== '' && year !== ''

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const years = ['2026', '2027']

  const handleContinue = () => {
    if (isFormValid) {
      onContinue({ month, year, mode })
    }
  }

  return (
    <section id="calculator" className="flex justify-center py-16 md:py-20 bg-white dark:bg-[#1a2c22]">
      <div className="max-w-[800px] px-4 md:px-10 w-full">
        <div className="flex flex-col gap-8">
          {/* Progress Indicator */}
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
              Step 1 of 3: Due Date
            </p>
            <div className="w-full h-2 bg-[#dce5df] dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: '33%' }}></div>
            </div>
          </div>

          {/* Form Card */}
          <div className="flex flex-col gap-6 bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-6 md:p-8">
            {/* Heading */}
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl md:text-3xl font-bold text-[#121714] dark:text-white">
                When is the big day?
              </h2>
              <p className="text-base text-gray-600 dark:text-gray-400">
                Your due date determines which insurance plan year applies to your birth costs and deductibles.
              </p>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Month Dropdown */}
              <label className="flex flex-col flex-1">
                <span className="text-[#121714] dark:text-gray-200 text-sm font-medium pb-2">
                  Month
                </span>
                <div className="relative">
                  <select
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    className="appearance-none w-full cursor-pointer rounded-lg text-[#121714] dark:text-white border border-[#dce5df] dark:border-gray-600 bg-white dark:bg-gray-800 h-14 pl-4 pr-10 text-base font-normal focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                  >
                    <option value="">Select month...</option>
                    {months.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#658671]">
                    <span className="material-symbols-outlined">expand_more</span>
                  </div>
                </div>
              </label>

              {/* Year Dropdown */}
              <label className="flex flex-col flex-1">
                <span className="text-[#121714] dark:text-gray-200 text-sm font-medium pb-2">
                  Year
                </span>
                <div className="relative">
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="appearance-none w-full cursor-pointer rounded-lg text-[#121714] dark:text-white border border-[#dce5df] dark:border-gray-600 bg-white dark:bg-gray-800 h-14 pl-4 pr-10 text-base font-normal focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                  >
                    <option value="">Select year...</option>
                    {years.map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#658671]">
                    <span className="material-symbols-outlined">expand_more</span>
                  </div>
                </div>
              </label>
            </div>

            {/* Mode Selection */}
            <div className="flex flex-col gap-3">
              <span className="text-[#121714] dark:text-gray-200 text-sm font-medium">
                What would you like to do?
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Compare Plans Option */}
                <label
                  className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    mode === 'compare'
                      ? 'border-primary bg-primary/5 dark:bg-primary/10'
                      : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  <input
                    type="radio"
                    name="calculatorMode"
                    value="compare"
                    checked={mode === 'compare'}
                    onChange={() => setMode('compare')}
                    className="w-5 h-5 text-primary border-gray-300 focus:ring-primary"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-[#121714] dark:text-white">
                      I'm comparing plans
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Find the best option for your family
                    </span>
                  </div>
                </label>

                {/* Single Plan Option */}
                <label
                  className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    mode === 'single'
                      ? 'border-primary bg-primary/5 dark:bg-primary/10'
                      : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  <input
                    type="radio"
                    name="calculatorMode"
                    value="single"
                    checked={mode === 'single'}
                    onChange={() => setMode('single')}
                    className="w-5 h-5 text-primary border-gray-300 focus:ring-primary"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-[#121714] dark:text-white">
                      I know my plan
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Calculate costs for my current coverage
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* Info Callout */}
            <div className="flex gap-4 p-4 rounded-lg bg-primary/10 dark:bg-primary/5 border border-primary/20">
              <span className="material-symbols-outlined text-primary text-2xl flex-shrink-0">
                lightbulb
              </span>
              <div className="flex flex-col gap-1">
                <h4 className="text-sm font-bold text-[#121714] dark:text-white">
                  The Double Deductible Trap
                </h4>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Did you know? If your baby arrives early in the year, you might have to pay your deductible twice. We help you plan for this.
                </p>
              </div>
            </div>

            {/* CTA Button */}
            <button
              disabled={!isFormValid}
              onClick={handleContinue}
              className="flex h-12 items-center justify-center gap-2 rounded-lg bg-primary px-6 text-base font-bold text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-600 hover:enabled:-translate-y-0.5 transition-all"
            >
              {mode === 'compare' ? 'Continue to Plans' : 'Enter Plan Details'}
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="flex flex-col items-center gap-2">
              <span className="material-symbols-outlined text-primary text-2xl">lock</span>
              <p className="text-xs text-gray-600 dark:text-gray-400">256-bit Secure Encryption</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="material-symbols-outlined text-primary text-2xl">block</span>
              <div className="flex flex-col items-center">
                <p className="text-xs font-semibold text-gray-900 dark:text-white">No Data Stored</p>
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
