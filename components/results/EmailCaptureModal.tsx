'use client';

import { useState, FormEvent } from 'react';
import { formatCurrency, formatDueDate } from '@/lib/calculations';

type FormState = 'idle' | 'submitting' | 'success' | 'error';

interface EmailCaptureModalProps {
  token: string;
  sessionId: string;
  savings: number;
  winnerPlanName: string;
  dueMonth: number;
  dueYear: number;
}

export default function EmailCaptureModal({
  token,
  sessionId,
  savings,
  winnerPlanName,
  dueMonth,
  dueYear,
}: EmailCaptureModalProps) {
  const [formState, setFormState] = useState<FormState>('idle');
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormState('submitting');

    try {
      // Create FormData with ConvertKit field names + enriched data
      const formData = new FormData();

      // User inputs
      formData.append('fields[first_name]', firstName);
      formData.append('email_address', email);

      // Enriched context from calculator
      formData.append('fields[due_date]', formatDueDate(dueMonth, dueYear));
      formData.append('fields[savings_amount]', formatCurrency(savings));
      formData.append('fields[winning_plan]', winnerPlanName);
      formData.append('fields[stripe_session_id]', sessionId);
      formData.append('fields[purchase_date]', new Date().toISOString());

      // POST to ConvertKit endpoint
      await fetch('https://app.kit.com/forms/8914101/subscriptions', {
        method: 'POST',
        body: formData,
        mode: 'no-cors', // ConvertKit may not return CORS headers
      });

      // With no-cors, we can't read the response, so assume success if no error
      setFormState('success');

      // Redirect to full results after brief success message
      setTimeout(() => {
        window.location.href = `/results?token=${token}&session_id=${sessionId}&email_captured=true`;
      }, 1500);
    } catch (error) {
      console.error('Email capture error:', error);
      setFormState('error');
    }
  };

  // Success state - show checkmark before redirect
  if (formState === 'success') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
        <div className="bg-white dark:bg-surface-dark rounded-xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="text-primary text-6xl mb-4">
            <span className="material-symbols-outlined" style={{ fontSize: '64px' }}>
              check_circle
            </span>
          </div>
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            Success!
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Redirecting to your results...
          </p>
        </div>
      </div>
    );
  }

  // Main form - non-dismissible modal
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
      <div className="bg-white dark:bg-surface-dark rounded-xl shadow-2xl p-8 max-w-md w-full">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary" style={{ fontSize: '40px' }}>
              mail
            </span>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            One More Step...
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Enter your email to unlock your results
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* First Name */}
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
              className="w-full h-12 px-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-surface-dark text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Email Address */}
          <div>
            <label htmlFor="email" className="sr-only">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email_address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
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
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                <span>Submitting...</span>
              </>
            ) : (
              'Unlock My Results'
            )}
          </button>

          {/* Error Message */}
          {formState === 'error' && (
            <div className="text-sm text-red-600 dark:text-red-400 text-center mt-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              Unable to connect. Please check your internet and try again.
            </div>
          )}
        </form>

        {/* Privacy note */}
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
          We'll use this to send your results and helpful tips.
        </p>
      </div>
    </div>
  );
}
