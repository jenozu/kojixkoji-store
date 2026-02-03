import { NextRequest, NextResponse } from 'next/server'
import { stripe, verifyWebhookSignature } from '@/lib/stripe'
import { createOrder } from '@/lib/supabase-helpers'
import { sendOrderNotificationEmail, sendOrderConfirmationEmail } from '@/lib/email'
import Stripe from 'stripe'

/**
 * POST /api/webhooks/stripe
 * Handles Stripe webhook events
 */
export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'No signature provided' },
      { status: 400 }
    )
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET is not set')
    return NextResponse.json(
      { error: 'Webhook secret not configured' },
      { status: 500 }
    )
  }

  let event: Stripe.Event

  try {
    // Verify webhook signature
    event = verifyWebhookSignature(body, signature, webhookSecret)
  } catch (error: any) {
    console.error('Webhook signature verification failed:', error.message)
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    )
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent

        // Extract order data from metadata (now split across multiple fields)
        const metadata = paymentIntent.metadata

        if (!metadata.orderId || !metadata.email) {
          console.error('Missing required metadata in payment intent')
          break
        }

        try {
          // Parse items from JSON string
          const items = metadata.items ? JSON.parse(metadata.items) : []

          // Reconstruct shipping address
          const shippingAddress = {
            firstName: metadata.shippingName?.split(' ')[0] || '',
            lastName: metadata.shippingName?.split(' ').slice(1).join(' ') || '',
            address1: metadata.shippingAddress || '',
            address2: '',
            city: metadata.shippingCity || '',
            province: metadata.shippingProvince || '',
            postal: metadata.shippingPostal || '',
            country: metadata.shippingCountry || '',
            notes: metadata.shippingNotes || '',
          }

          // Create order in Supabase
          await createOrder({
            order_id: metadata.orderId,
            email: metadata.email,
            items,
            subtotal: parseFloat(metadata.subtotal || '0'),
            taxes: parseFloat(metadata.taxes || '0'),
            shipping: parseFloat(metadata.shipping || '0'),
            total: parseFloat(metadata.total || '0'),
            status: 'processing', // Payment succeeded, order is processing
            shipping_address: shippingAddress,
            payment_intent_id: paymentIntent.id,
            payment_status: 'succeeded',
            payment_method: paymentIntent.payment_method_types[0] || 'card',
          })

          console.log(`Order ${metadata.orderId} created successfully`)

          const orderData = {
            orderId: metadata.orderId,
            customerEmail: metadata.email,
            items: items.map((i: { name: string; price: number; quantity: number; size?: string }) => ({
              name: i.name,
              price: i.price,
              quantity: i.quantity,
              size: i.size,
            })),
            subtotal: parseFloat(metadata.subtotal || '0'),
            taxes: parseFloat(metadata.taxes || '0'),
            shipping: parseFloat(metadata.shipping || '0'),
            total: parseFloat(metadata.total || '0'),
            shippingAddress,
          }

          // Send order confirmation to customer (primary)
          const customerEmailResult = await sendOrderConfirmationEmail(orderData)
          if (!customerEmailResult.success) {
            console.warn('Customer confirmation email skipped or failed:', customerEmailResult.error)
          }

          // Send notification to store owner (optional)
          const ownerEmailResult = await sendOrderNotificationEmail(orderData)
          if (!ownerEmailResult.success) {
            console.warn('Store owner notification email skipped or failed:', ownerEmailResult.error)
          }
        } catch (error: any) {
          console.error('Error creating order from webhook:', error)
          // Don't return error - webhook will retry
        }

        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.log(`Payment failed for ${paymentIntent.id}`)
        // You could update order status here if order was created before payment
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Error processing webhook:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
