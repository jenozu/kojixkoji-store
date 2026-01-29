import { NextRequest, NextResponse } from 'next/server'
import { createPaymentIntent } from '@/lib/stripe'

/**
 * POST /api/payments/create-intent
 * Creates a Stripe PaymentIntent for checkout
 */
export async function POST(request: NextRequest) {
  try {
    const secretKey = process.env.STRIPE_SECRET_KEY;

    // 1. Check if Stripe key exists
    if (!secretKey) {
      console.error('STRIPE_SECRET_KEY is missing from environment')
      return NextResponse.json(
        { error: 'Stripe configuration error: Secret key not found' },
        { status: 500 }
      )
    }

    // 2. Validate key format to catch common configuration errors
    const trimmedKey = secretKey.trim();
    if (!trimmedKey.startsWith('sk_test_') && !trimmedKey.startsWith('sk_live_')) {
      console.error('STRIPE_SECRET_KEY format is invalid. It should start with sk_test_ or sk_live_');
      return NextResponse.json(
        { error: 'Stripe configuration error: Invalid key format' },
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
    
    // Provide detailed error info in development
    return NextResponse.json(
      { 
        error: error.message || 'Failed to create payment intent',
        details: process.env.NODE_ENV === 'development' ? {
          type: error.type,
          code: error.code,
          statusCode: error.statusCode,
          isAuthError: error.statusCode === 401
        } : undefined
      },
      { status: error.statusCode || 500 }
    )
  }
}
