import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

/**
 * POST /api/payments/update-intent
 * Updates a Stripe PaymentIntent with metadata
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { paymentIntentId, metadata } = body

    if (!paymentIntentId) {
      return NextResponse.json(
        { error: 'PaymentIntent ID is required' },
        { status: 400 }
      )
    }

    // Extract payment intent ID from client secret if needed
    let intentId = paymentIntentId
    if (paymentIntentId.includes('_secret_')) {
      intentId = paymentIntentId.split('_secret_')[0]
    }
    if (!intentId.startsWith('pi_')) {
      intentId = `pi_${intentId}`
    }

    // Update payment intent with metadata
    const paymentIntent = await stripe.paymentIntents.update(intentId, {
      metadata,
    })

    return NextResponse.json({
      success: true,
      paymentIntentId: paymentIntent.id,
    })
  } catch (error: any) {
    console.error('Error updating payment intent:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update payment intent' },
      { status: 500 }
    )
  }
}
