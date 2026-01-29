// lib/stripe.ts
// Stripe server-side utilities

import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables')
}

// Initialize Stripe with secret key (server-side only)
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia',
})

/**
 * Create a PaymentIntent for an order
 */
export async function createPaymentIntent(params: {
  amount: number // Amount in cents
  currency?: string
  metadata?: Record<string, string>
}) {
  const { amount, currency = 'cad', metadata = {} } = params

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // Convert to cents
    currency: currency.toLowerCase(),
    metadata,
    // Only use card payment method for local HTTP testing
    // automatic_payment_methods requires HTTPS for Apple Pay/Google Pay
    payment_method_types: ['card'],
  })

  return paymentIntent
}

/**
 * Retrieve a PaymentIntent by ID
 */
export async function getPaymentIntent(paymentIntentId: string) {
  return await stripe.paymentIntents.retrieve(paymentIntentId)
}

/**
 * Verify webhook signature
 */
export function verifyWebhookSignature(
  payload: string | Buffer,
  signature: string,
  secret: string
): Stripe.Event {
  return stripe.webhooks.constructEvent(payload, signature, secret)
}
