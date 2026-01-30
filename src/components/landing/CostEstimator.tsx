'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function CostEstimator() {
  const [deductible, setDeductible] = useState(2500)
  const [oopMax, setOopMax] = useState(6000)
  const [gearBudget, setGearBudget] = useState(1200)

  // Estimate assumes typical birth scenario:
  // - You pay deductible first
  // - Then coinsurance (typically 20%) on remaining costs up to OOP max
  // - Average birth costs ~$18,000 before insurance
  const estimatedBirthCost = 18000
  const afterDeductible = Math.max(0, estimatedBirthCost - deductible)
  const coinsurance = afterDeductible * 0.2
  const medicalEstimate = Math.min(deductible + coinsurance, oopMax)
  const diapersFormula = 2500 // Fixed estimate
  const totalEstimate = medicalEstimate + gearBudget + diapersFormula

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <section id="cost-estimator" className="py-24 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-5 gap-12 rounded-3xl bg-gray-800/40 border border-gray-800 backdrop-blur-sm p-8 lg:p-12 shadow-2xl">
          {/* Controls */}
          <div className="lg:col-span-3 space-y-10">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Quick Deployment Estimate</h2>
              <p className="text-gray-400 text-sm">
                Adjust sliders to simulate your first-year financial impact.
              </p>
            </div>

            {/* Slider 1: Insurance Deductible */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-white font-medium">Insurance Deductible</label>
                <span className="text-primary font-mono font-bold">
                  {formatCurrency(deductible)}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="10000"
                step="100"
                value={deductible}
                onChange={(e) => setDeductible(Number(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-thumb"
              />
              <div className="flex justify-between text-xs text-gray-500 font-mono">
                <span>$0</span>
                <span>$10k</span>
              </div>
            </div>

            {/* Slider 2: Out-of-Pocket Max */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-white font-medium">Out-of-Pocket Max</label>
                <span className="text-primary font-mono font-bold">
                  {formatCurrency(oopMax)}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="15000"
                step="100"
                value={oopMax}
                onChange={(e) => setOopMax(Number(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-thumb"
              />
              <div className="flex justify-between text-xs text-gray-500 font-mono">
                <span>$0</span>
                <span>$15k</span>
              </div>
            </div>

            {/* Slider 3: Baby Gear Budget */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-white font-medium">Baby Gear Budget</label>
                <span className="text-primary font-mono font-bold">
                  {formatCurrency(gearBudget)}
                </span>
              </div>
              <input
                type="range"
                min="500"
                max="5000"
                step="100"
                value={gearBudget}
                onChange={(e) => setGearBudget(Number(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-thumb"
              />
              <div className="flex justify-between text-xs text-gray-500 font-mono">
                <span>$500</span>
                <span>$5k</span>
              </div>
            </div>
          </div>

          {/* Result Card */}
          <div className="lg:col-span-2 flex flex-col justify-center">
            <div className="rounded-2xl bg-gray-900 border border-gray-700 p-8 shadow-inner relative overflow-hidden">
              {/* Background Icon */}
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <span className="material-symbols-outlined text-[120px] text-white">payments</span>
              </div>

              <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">
                Total Estimated 1st Year Cost
              </h3>
              <div className="text-5xl font-black text-white font-mono tracking-tight mb-6">
                {formatCurrency(totalEstimate)}
              </div>

              <div className="space-y-3 pt-6 border-t border-gray-800">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Medical (Est)</span>
                  <span className="text-white font-mono">{formatCurrency(medicalEstimate)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Gear & Supplies</span>
                  <span className="text-white font-mono">{formatCurrency(gearBudget)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Diapers & Formula</span>
                  <span className="text-white font-mono">{formatCurrency(diapersFormula)}</span>
                </div>
              </div>

              <Link
                href="/onboarding"
                className="mt-8 w-full rounded-lg bg-white/5 py-3 text-sm font-bold text-white hover:bg-white/10 border border-white/10 transition-colors flex items-center justify-center"
              >
                Get Detailed Breakdown
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
