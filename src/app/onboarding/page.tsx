'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useDashboardState } from '@/hooks/useDashboardState'
import { UserData } from '@/lib/types'
import { MONTH_NAMES } from '@/lib/constants'
import { getIntegerError, hasValidationErrors } from '@/lib/validation'

export default function OnboardingPage() {
  const router = useRouter()
  const { initializeUser, isOnboarded, isLoaded } = useDashboardState()
  const [step, setStep] = useState(1)

  // Step 1: Due Date
  const currentYear = new Date().getFullYear()
  const [dueDateMonth, setDueDateMonth] = useState(6)
  const [dueDateYear, setDueDateYear] = useState(currentYear + 1)

  // Step 2: Insurance
  const [planName, setPlanName] = useState('')
  const [monthlyPremium, setMonthlyPremium] = useState('')
  const [familyDeductible, setFamilyDeductible] = useState('')
  const [familyOopMax, setFamilyOopMax] = useState('')
  const [employerHsa, setEmployerHsa] = useState('')

  // Validation errors
  const [premiumError, setPremiumError] = useState<string | null>(null)
  const [deductibleError, setDeductibleError] = useState<string | null>(null)
  const [oopMaxError, setOopMaxError] = useState<string | null>(null)
  const [hsaError, setHsaError] = useState<string | null>(null)

  // Redirect if already onboarded (must be in useEffect to avoid setState-in-render error)
  useEffect(() => {
    if (isLoaded && isOnboarded) {
      router.push('/dashboard')
    }
  }, [isLoaded, isOnboarded, router])

  // Show loading spinner while checking onboarding status or redirecting
  if (!isLoaded || isOnboarded) {
    return (
      <div className="min-h-screen bg-background-dark flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault()
    setStep(2)
  }

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const userData: UserData = {
      dueDate: {
        month: dueDateMonth,
        year: dueDateYear,
        day: 15,
      },
      insurance: {
        planName: planName || 'My Plan',
        monthlyPremium: parseFloat(monthlyPremium) || 0,
        familyDeductible: parseFloat(familyDeductible) || 0,
        familyOopMax: parseFloat(familyOopMax) || 0,
        employerHsa: parseFloat(employerHsa) || 0,
      },
      createdAt: new Date().toISOString(),
    }

    // Calculate costs for budget initialization
    const annualPremium = userData.insurance.monthlyPremium * 12
    const doubleDeductibleRisk = dueDateMonth <= 3
    const expectedOop = doubleDeductibleRisk
      ? userData.insurance.familyOopMax * 2
      : userData.insurance.familyOopMax

    initializeUser(userData, {
      annualPremium,
      expectedOop,
      employerHsa: userData.insurance.employerHsa,
    })

    router.push('/dashboard')
  }

  const years = [currentYear, currentYear + 1, currentYear + 2]
  const doubleDeductibleWarning = dueDateMonth <= 3

  return (
    <div className="min-h-screen bg-background-dark flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-2xl">rocket_launch</span>
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-bold text-white">DadOps</h1>
              <p className="text-gray-400 text-sm">Mission Control</p>
            </div>
          </div>
          <p className="text-gray-400">
            {step === 1 ? "Let's start with your due date" : "Now, tell us about your insurance"}
          </p>
        </div>

        {/* Progress */}
        <div className="flex gap-2 mb-8">
          <div className={`h-1 flex-1 rounded-full ${step >= 1 ? 'bg-primary' : 'bg-gray-700'}`} />
          <div className={`h-1 flex-1 rounded-full ${step >= 2 ? 'bg-primary' : 'bg-gray-700'}`} />
        </div>

        {/* Step 1: Due Date */}
        {step === 1 && (
          <form onSubmit={handleStep1Submit} className="space-y-6">
            <div className="bg-card-dark rounded-xl border border-gray-800 p-6 space-y-4">
              <h2 className="text-lg font-semibold text-white">When is the baby due?</h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Month</label>
                  <select
                    value={dueDateMonth}
                    onChange={(e) => setDueDateMonth(parseInt(e.target.value))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                  >
                    {MONTH_NAMES.map((name, index) => (
                      <option key={name} value={index + 1}>{name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Year</label>
                  <select
                    value={dueDateYear}
                    onChange={(e) => setDueDateYear(parseInt(e.target.value))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                  >
                    {years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Double Deductible Warning */}
              {doubleDeductibleWarning && (
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-orange-400 flex-shrink-0">warning</span>
                    <div>
                      <p className="text-orange-400 font-medium">The Double Deductible Trap</p>
                      <p className="text-gray-300 text-sm mt-1">
                        If your baby arrives early in the year, you might hit your deductible in BOTH plan years.
                        Your total liability will account for this.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors"
            >
              Continue
            </button>
          </form>
        )}

        {/* Step 2: Insurance */}
        {step === 2 && (
          <form onSubmit={handleFinalSubmit} className="space-y-6">
            <div className="bg-card-dark rounded-xl border border-gray-800 p-6 space-y-4">
              <h2 className="text-lg font-semibold text-white">Insurance Details</h2>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Plan Nickname (optional)</label>
                <input
                  type="text"
                  value={planName}
                  onChange={(e) => setPlanName(e.target.value)}
                  placeholder="e.g., Blue Cross PPO"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Monthly Premium *</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={monthlyPremium}
                    onChange={(e) => {
                      const value = e.target.value
                      setMonthlyPremium(value)
                      setPremiumError(getIntegerError(value))
                    }}
                    placeholder="0"
                    required
                    className={`w-full bg-gray-800 border rounded-lg pl-8 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none ${
                      premiumError ? 'border-red-500 focus:border-red-500' : 'border-gray-700 focus:border-primary'
                    }`}
                  />
                </div>
                {premiumError && <p className="text-red-400 text-xs mt-1">{premiumError}</p>}
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Family Deductible *</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={familyDeductible}
                    onChange={(e) => {
                      const value = e.target.value
                      setFamilyDeductible(value)
                      setDeductibleError(getIntegerError(value))
                    }}
                    placeholder="0"
                    required
                    className={`w-full bg-gray-800 border rounded-lg pl-8 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none ${
                      deductibleError ? 'border-red-500 focus:border-red-500' : 'border-gray-700 focus:border-primary'
                    }`}
                  />
                </div>
                {deductibleError && <p className="text-red-400 text-xs mt-1">{deductibleError}</p>}
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Family Out-of-Pocket Max *</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={familyOopMax}
                    onChange={(e) => {
                      const value = e.target.value
                      setFamilyOopMax(value)
                      setOopMaxError(getIntegerError(value))
                    }}
                    placeholder="0"
                    required
                    className={`w-full bg-gray-800 border rounded-lg pl-8 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none ${
                      oopMaxError ? 'border-red-500 focus:border-red-500' : 'border-gray-700 focus:border-primary'
                    }`}
                  />
                </div>
                {oopMaxError && <p className="text-red-400 text-xs mt-1">{oopMaxError}</p>}
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Employer HSA/HRA Contribution (optional)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={employerHsa}
                    onChange={(e) => {
                      const value = e.target.value
                      setEmployerHsa(value)
                      setHsaError(getIntegerError(value))
                    }}
                    placeholder="0"
                    className={`w-full bg-gray-800 border rounded-lg pl-8 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none ${
                      hsaError ? 'border-red-500 focus:border-red-500' : 'border-gray-700 focus:border-primary'
                    }`}
                  />
                </div>
                {hsaError && <p className="text-red-400 text-xs mt-1">{hsaError}</p>}
                <p className="text-xs text-gray-500 mt-1">Annual contribution from your employer to offset costs</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 py-3 border border-gray-700 text-gray-300 font-medium rounded-lg hover:bg-gray-800 transition-colors"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={hasValidationErrors(premiumError, deductibleError, oopMaxError, hsaError)}
                className="flex-1 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary"
              >
                <span className="material-symbols-outlined text-lg">rocket_launch</span>
                Launch Mission Control
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
