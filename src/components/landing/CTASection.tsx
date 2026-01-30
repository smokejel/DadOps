'use client'

import { useState, FormEvent } from 'react'
import Link from 'next/link'

type FormState = 'idle' | 'submitting' | 'success' | 'error'

export default function CTASection() {
  const [formState, setFormState] = useState<FormState>('idle')
  const [firstName, setFirstName] = useState('')
  const [email, setEmail] = useState('')
  const [dueDate, setDueDate] = useState('')

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormState('submitting')

    try {
      const formData = new FormData()
      formData.append('fields[first_name]', firstName)
      formData.append('email_address', email)
      if (dueDate) {
        formData.append('fields[due_date]', dueDate)
      }

      await fetch('https://app.kit.com/forms/8914101/subscriptions', {
        method: 'POST',
        body: formData,
        mode: 'no-cors',
      })

      setFormState('success')
    } catch (error) {
      console.error('Form submission error:', error)
      setFormState('error')
    }
  }

  return (
    <section id="cta" className="relative isolate overflow-hidden py-16 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Don't Go In Unprepared
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-300">
            Get the playbook other dads wish they had. No spam, just intel.
          </p>

          {formState === 'success' ? (
            <div className="mt-8 rounded-xl bg-primary/10 border border-primary/20 p-8">
              <div className="flex items-center justify-center gap-3 text-primary mb-3">
                <span className="material-symbols-outlined text-3xl">check_circle</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">You&apos;re on the list.</h3>
              <p className="text-gray-400">We&apos;ll be in touch soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 space-y-4 max-w-md mx-auto">
              <div>
                <label htmlFor="firstName" className="sr-only">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="fields[first_name]"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First Name"
                  required
                  disabled={formState === 'submitting'}
                  className="w-full rounded-lg border-0 bg-white/5 px-4 py-3 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm placeholder:text-gray-500 disabled:opacity-50"
                />
              </div>

              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email_address"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={formState === 'submitting'}
                  className="w-full rounded-lg border-0 bg-white/5 px-4 py-3 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm placeholder:text-gray-500 disabled:opacity-50"
                  placeholder="Email Address"
                />
              </div>

              <div>
                <label htmlFor="dueDate" className="sr-only">
                  When are you expecting?
                </label>
                <select
                  id="dueDate"
                  name="fields[due_date]"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  disabled={formState === 'submitting'}
                  className="w-full rounded-lg border-0 bg-white/5 px-4 py-3 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm disabled:opacity-50"
                >
                  <option value="" className="bg-gray-900">
                    When are you expecting?
                  </option>
                  <option value="trimester_1" className="bg-gray-900">
                    First Trimester (Weeks 1-12)
                  </option>
                  <option value="trimester_2" className="bg-gray-900">
                    Second Trimester (Weeks 13-26)
                  </option>
                  <option value="trimester_3" className="bg-gray-900">
                    Third Trimester (Weeks 27-40)
                  </option>
                  <option value="not_expecting" className="bg-gray-900">
                    Not expecting — just curious
                  </option>
                  <option value="already_dad" className="bg-gray-900">
                    Already a dad — just curious
                  </option>
                </select>
              </div>

              <button
                type="submit"
                disabled={formState === 'submitting'}
                className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-bold text-gray-900 shadow-sm hover:bg-primary-dark hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {formState === 'submitting' ? (
                  <>
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-gray-900 border-t-transparent"></span>
                    <span>Joining...</span>
                  </>
                ) : (
                  'Join the Mission'
                )}
              </button>

              {formState === 'error' && (
                <div className="text-sm text-red-400 text-center">
                  Something went wrong. Please try again.
                </div>
              )}
            </form>
          )}

          <p className="mt-6 text-xs text-gray-500">
            We care about your data. Read our{' '}
            <Link href="#" className="font-semibold text-primary hover:text-primary/80">
              privacy policy
            </Link>
            .
          </p>
        </div>
      </div>
    </section>
  )
}
