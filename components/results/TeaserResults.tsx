'use client'

import { useState } from 'react'
import { FullResults, formatCurrency, formatDueDate } from '@/lib/calculations'
import { trackPaymentInitiated } from '@/lib/analytics'
import WarningBanner from './WarningBanner'
import WinnerCard from './WinnerCard'
import ComparisonTable from './ComparisonTable'

interface TeaserResultsProps {
  results: FullResults
  token: string
}

export default function TeaserResults({ results, token }: TeaserResultsProps) {
  const [loading, setLoading] = useState(false)

  const handleUnlock = async () => {
    setLoading(true)

    // Track payment initiated
    trackPaymentInitiated()

    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })

      if (!res.ok) {
        throw new Error('Failed to create checkout session')
      }

      const { url } = await res.json()
      window.location.href = url
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Failed to start checkout. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark py-12">
      <div className="max-w-5xl mx-auto px-4 md:px-10">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Your Analysis Is Ready
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Based on a due date of {formatDueDate(results.dueMonth, results.dueYear)}
          </p>
        </div>

        {/* Warning Banner (visible in teaser) */}
        {results.doubleDeductibleRisk && (
          <div className="mb-6">
            <WarningBanner
              type="double-deductible"
              title="Double Deductible Risk Detected"
              message="Your pregnancy spans two plan years (prenatal care in one year, delivery in the next), which means you could hit your out-of-pocket maximum twice. We've factored this into our calculations."
            />
          </div>
        )}

        {/* Winner Card (visible - the hook) */}
        <div className="mb-8">
          <WinnerCard
            plan={results.winner.plan}
            effectiveCost={results.winner.effectiveCost}
            savings={results.savings}
            runnerUpName={results.runnerUp?.plan.name || null}
          />
        </div>

        {/* Blurred Comparison Table with Paywall Overlay */}
        <div className="relative mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Detailed Comparison
          </h2>

          {/* Blurred table */}
          <div className="relative min-h-[400px]">
            <ComparisonTable results={results.results} isBlurred={true} />

            {/* Paywall Overlay Card */}
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <div className="bg-white dark:bg-surface-dark rounded-xl shadow-2xl max-w-md w-full p-8 border border-gray-200 dark:border-gray-700">
                {/* Lock Icon */}
                <div className="flex justify-center mb-4">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 dark:bg-primary/20">
                    <span className="material-symbols-outlined text-primary text-4xl">
                      lock_open
                    </span>
                  </div>
                </div>

                {/* Heading */}
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-4">
                  Unlock Full Breakdown
                </h3>

                {/* Feature List */}
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary text-xl mt-0.5">
                      check_circle
                    </span>
                    <span className="text-gray-700 dark:text-gray-300">
                      Detailed line-by-line plan comparison
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary text-xl mt-0.5">
                      check_circle
                    </span>
                    <span className="text-gray-700 dark:text-gray-300">
                      Complete calculation breakdown
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary text-xl mt-0.5">
                      check_circle
                    </span>
                    <span className="text-gray-700 dark:text-gray-300">
                      Printable summary to share
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary text-xl mt-0.5">
                      check_circle
                    </span>
                    <span className="text-gray-700 dark:text-gray-300">
                      Hidden fees and gotchas exposed
                    </span>
                  </li>
                </ul>

                {/* Pricing */}
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                      $19
                    </span>
                    <span className="text-2xl text-gray-400 line-through">
                      $29
                    </span>
                  </div>
                  <span className="inline-block bg-primary/10 dark:bg-primary/20 text-primary text-sm font-semibold px-3 py-1 rounded-full">
                    One-time payment
                  </span>
                </div>

                {/* Unlock Button */}
                <button
                  onClick={handleUnlock}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 h-14 bg-primary hover:bg-green-600 disabled:bg-gray-400 text-white font-bold text-lg rounded-lg shadow-lg shadow-primary/30 transition-all hover:-translate-y-0.5 disabled:translate-y-0 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span>Processing...</span>
                  ) : (
                    <>
                      <span>Unlock My Results</span>
                      <span className="material-symbols-outlined">arrow_forward</span>
                    </>
                  )}
                </button>

                {/* Trust Badges */}
                <div className="flex items-center justify-center gap-4 mt-6 text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">lock</span>
                    <span>Encrypted SSL</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">verified</span>
                    <span>Secure Payment</span>
                  </div>
                </div>

                {/* Money-Back Guarantee */}
                <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
                  <strong>100% Money-back guarantee.</strong>
                  <br />
                  If we don't find you savings, we'll refund you.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="text-center p-6">
            <span className="material-symbols-outlined text-primary text-4xl mb-3">
              block
            </span>
            <h4 className="font-bold text-gray-900 dark:text-white mb-2">
              No Data Stored
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              We can't sell your data because we don't save it.
            </p>
          </div>
          <div className="text-center p-6">
            <span className="material-symbols-outlined text-primary text-4xl mb-3">
              family_restroom
            </span>
            <h4 className="font-bold text-gray-900 dark:text-white mb-2">
              Built by Dads
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Created by fathers who faced the $30k surprise.
            </p>
          </div>
          <div className="text-center p-6">
            <span className="material-symbols-outlined text-primary text-4xl mb-3">
              payments
            </span>
            <h4 className="font-bold text-gray-900 dark:text-white mb-2">
              Risk Free
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Full refund if not satisfied.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
