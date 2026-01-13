'use client'

import { useState, FormEvent } from 'react'
import { FullResults, formatCurrency, formatDueDate } from '@/lib/calculations'

type FormState = 'idle' | 'submitting' | 'success' | 'error'

interface BetaTesterSignupProps {
  results: FullResults
}

export default function BetaTesterSignup({ results }: BetaTesterSignupProps) {
  const [formState, setFormState] = useState<FormState>('idle')
  const [firstName, setFirstName] = useState('')
  const [email, setEmail] = useState('')

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormState('submitting')

    try {
      // Create FormData with ConvertKit field names + enriched data
      const formData = new FormData()

      // User inputs
      formData.append('email_address', email)
      formData.append('fields[first_name]', firstName)

      // Enriched context from calculator
      formData.append('fields[due_date]', formatDueDate(results.dueMonth, results.dueYear))
      formData.append('fields[savings_amount]', formatCurrency(results.savings))
      formData.append('fields[winning_plan]', results.winner.plan.name)
      formData.append('fields[interested_feature]', 'AI PDF Parser')
      formData.append('fields[signup_source]', 'Results Page')

      // POST to ConvertKit endpoint
      await fetch('https://app.kit.com/forms/8914101/subscriptions', {
        method: 'POST',
        body: formData,
        mode: 'no-cors', // ConvertKit may not return CORS headers
      })

      // With no-cors, we can't read the response, so assume success if no error
      setFormState('success')
    } catch (error) {
      console.error('Beta signup error:', error)
      setFormState('error')
    }
  }

  const handleRetry = () => {
    setFormState('idle')
  }

  // Success state - show confirmation message
  if (formState === 'success') {
    return (
      <div className="bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-700 p-6 md:p-8 shadow-sm">
        <div className="flex flex-col items-center text-center">
          <div className="text-primary mb-4">
            <span className="material-symbols-outlined" style={{ fontSize: '48px' }}>
              check_circle
            </span>
          </div>
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            You're in!
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Thanks for signing up! We'll reach out when the AI assistant is ready for testing.
          </p>
        </div>
      </div>
    )
  }

  // Error state - show error message with retry
  if (formState === 'error') {
    return (
      <div className="bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-700 p-6 md:p-8 shadow-sm">
        <div className="flex flex-col items-center text-center">
          <div className="text-red-500 mb-4">
            <span className="material-symbols-outlined" style={{ fontSize: '48px' }}>
              error
            </span>
          </div>
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            Something went wrong
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Please try again or email{' '}
            <a href="mailto:admin@dadops.one" className="text-primary hover:underline">
              admin@dadops.one
            </a>
          </p>
          <button
            onClick={handleRetry}
            className="px-6 py-3 bg-primary hover:bg-green-600 text-white font-semibold rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  // Idle/Submitting state - show form
  return (
    <div className="bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-700 p-6 md:p-8 shadow-sm">
      <div className="flex items-start gap-4 mb-4">
        <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-3xl flex-shrink-0">
          engineering
        </span>
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Want an easier way next time?
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            I'm building an AI assistant that can read your insurance PDF automatically so you don't have to type this stuff in. Want to be a beta tester?
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* First Name (Optional) */}
        <div>
          <label htmlFor="beta-firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            First Name <span className="text-gray-500">(Optional)</span>
          </label>
          <input
            id="beta-firstName"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="John"
            disabled={formState === 'submitting'}
            className="w-full h-12 px-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-surface-dark text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        {/* Email (Required) */}
        <div>
          <label htmlFor="beta-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            id="beta-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john@example.com"
            required
            disabled={formState === 'submitting'}
            className="w-full h-12 px-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-surface-dark text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={formState === 'submitting'}
          className="w-full h-12 bg-primary hover:bg-green-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {formState === 'submitting' ? (
            <>
              <span className="material-symbols-outlined animate-spin">
                progress_activity
              </span>
              Joining...
            </>
          ) : (
            <>
              <span className="material-symbols-outlined">
                rocket_launch
              </span>
              Join Waitlist
            </>
          )}
        </button>
      </form>
    </div>
  )
}
