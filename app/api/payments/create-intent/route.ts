import { NextRequest, NextResponse } from 'next/server'
import { createPaymentIntent } from '@/lib/stripe'

/**
 * POST /api/payments/create-intent
 * Creates a Stripe PaymentIntent for checkout
 */
export async function POST(request: NextRequest) {
  try {
    // Debug: Check if Stripe key is loaded
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('STRIPE_SECRET_KEY is missing from environment')
      return NextResponse.json(
        { error: 'Stripe configuration error: Secret key not found' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { amount, currency = 'cad', metadata = {} } = body

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      )
    }

    // Create payment intent
    const paymentIntent = await createPaymentIntent({
      amount,
      currency,
      metadata,
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    })
  } catch (error: any) {
    console.error('Error creating payment intent:', error)
    console.error('Error details:', {
      message: error.message,
      type: error.type,
      code: error.code,
      statusCode: error.statusCode,
      raw: error.raw,
    })
    return NextResponse.json(
      { 
        error: error.message || 'Failed to create payment intent',
        details: process.env.NODE_ENV === 'development' ? {
          type: error.type,
          code: error.code,
          statusCode: error.statusCode,
        } : undefined
      },
      { status: 500 }
    )
  }
}
