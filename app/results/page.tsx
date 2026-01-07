import { decodeCalculatorData } from '@/lib/encoding'
import { calculateAllPlans } from '@/lib/calculations'
import { verifyStripeSession } from '@/lib/stripe'
import TeaserResults from '@/components/results/TeaserResults'
import FullResults from '@/components/results/FullResults'
import EmailCaptureModal from '@/components/results/EmailCaptureModal'

interface ResultsPageProps {
  searchParams: {
    token?: string
    preview?: string
    session_id?: string
    email_captured?: string
  }
}

export default async function ResultsPage({ searchParams }: ResultsPageProps) {
  const { token, session_id, email_captured } = searchParams

  // Validate token exists
  if (!token) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-surface-dark rounded-xl shadow-lg p-8 text-center">
          <span className="material-symbols-outlined text-red-500 text-6xl mb-4">
            error
          </span>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Invalid Link
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            This results link appears to be invalid or expired.
          </p>
          <a
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-green-600 text-white font-bold rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined">home</span>
            Return Home
          </a>
        </div>
      </div>
    )
  }

  // Decode calculator data
  let data
  try {
    data = decodeCalculatorData(token)
  } catch (error) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-surface-dark rounded-xl shadow-lg p-8 text-center">
          <span className="material-symbols-outlined text-red-500 text-6xl mb-4">
            error
          </span>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Invalid Data
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            We couldn't decode your calculator data. Please try starting over.
          </p>
          <a
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-green-600 text-white font-bold rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined">refresh</span>
            Start Over
          </a>
        </div>
      </div>
    )
  }

  // Run calculations
  const results = calculateAllPlans(data)

  // Check payment status
  let isPaid = false
  if (session_id) {
    isPaid = await verifyStripeSession(session_id)
  }

  // Three rendering paths: teaser, email capture modal, or full results
  if (isPaid && !email_captured) {
    // User just paid but hasn't captured email yet
    // session_id is guaranteed to exist because isPaid is only true when session_id exists
    return (
      <EmailCaptureModal
        token={token}
        sessionId={session_id!}
        savings={results.savings}
        winnerPlanName={results.winner.plan.name}
        dueMonth={results.dueMonth}
        dueYear={results.dueYear}
      />
    )
  } else if (isPaid && email_captured === 'true') {
    // User paid AND captured email → Show full results
    return <FullResults results={results} />
  } else {
    // Not paid → Show teaser
    return <TeaserResults results={results} token={token} />
  }
}
