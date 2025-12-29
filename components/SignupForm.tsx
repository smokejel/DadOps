'use client';

import { useState, FormEvent } from 'react';

type FormState = 'idle' | 'submitting' | 'success' | 'error';

export default function SignupForm() {
  const [formState, setFormState] = useState<FormState>('idle');
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormState('submitting');

    try {
      // Create FormData with exact ConvertKit field names
      const formData = new FormData();
      formData.append('fields[first_name]', firstName);
      formData.append('email_address', email);
      if (dueDate) {
        formData.append('fields[due_date]', dueDate);
      }

      // POST to ConvertKit endpoint
      const response = await fetch('https://app.kit.com/forms/8914101/subscriptions', {
        method: 'POST',
        body: formData,
        mode: 'no-cors', // ConvertKit may not return CORS headers
      });

      // With no-cors, we can't read the response, so assume success if no error
      setFormState('success');
    } catch (error) {
      console.error('Form submission error:', error);
      setFormState('error');
    }
  };

  // Success state
  if (formState === 'success') {
    return (
      <div className="text-center py-8 px-6 bg-green-50 rounded-lg border border-green-200">
        <div className="text-green-600 text-4xl mb-3">✓</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          You&apos;re on the list.
        </h3>
        <p className="text-gray-600">
          We&apos;ll be in touch soon.
        </p>
      </div>
    );
  }

  return (
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
          className="form-input"
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
          className="form-input"
        />
      </div>

      {/* Due Date Dropdown */}
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
          className="form-select"
        >
          <option value="">When are you expecting?</option>
          <option value="trimester_1">First Trimester (Weeks 1-12)</option>
          <option value="trimester_2">Second Trimester (Weeks 13-26)</option>
          <option value="trimester_3">Third Trimester (Weeks 27-40)</option>
          <option value="not_expecting">Not expecting — just curious</option>
          <option value="already_dad">Already a dad — just curious</option>
        </select>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={formState === 'submitting'}
        className="btn-primary w-full flex items-center justify-center gap-2"
      >
        {formState === 'submitting' ? (
          <>
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
            <span>Joining...</span>
          </>
        ) : (
          'Join the Waitlist'
        )}
      </button>

      {/* Error Message */}
      {formState === 'error' && (
        <div className="text-sm text-red-600 text-center mt-2">
          Something went wrong. Please try again.
        </div>
      )}
    </form>
  );
}
