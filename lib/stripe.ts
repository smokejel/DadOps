import Stripe from 'stripe'

// Initialize Stripe with secret key from environment
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
})

/**
 * Verify a Stripe checkout session payment status
 * @param sessionId - Stripe checkout session ID
 * @returns True if payment is completed, false otherwise
 */
export async function verifyStripeSession(sessionId: string): Promise<boolean> {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    return session.payment_status === 'paid'
  } catch (error) {
    console.error('Stripe verification error:', error)
    return false
  }
}

export { stripe }
