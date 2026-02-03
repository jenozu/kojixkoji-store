import { Resend } from 'resend'

export interface OrderNotificationData {
  orderId: string
  customerEmail: string
  items: Array<{
    name: string
    price: number
    quantity: number
    size?: string
  }>
  subtotal: number
  taxes: number
  shipping: number
  total: number
  shippingAddress: {
    firstName: string
    lastName: string
    address1: string
    address2?: string
    city: string
    province: string
    postal: string
    country?: string
    notes?: string
  }
}

/**
 * Send order notification email to the store owner when an order is completed.
 * Requires RESEND_API_KEY and ORDER_NOTIFICATION_EMAIL in environment.
 * Silently skips if not configured (order still completes).
 */
export async function sendOrderNotificationEmail(
  data: OrderNotificationData
): Promise<{ success: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY
  const toEmail = process.env.ORDER_NOTIFICATION_EMAIL

  if (!apiKey || !toEmail) {
    console.warn(
      'Email not sent: Set RESEND_API_KEY and ORDER_NOTIFICATION_EMAIL to receive order notifications'
    )
    return { success: false, error: 'Email not configured' }
  }

  const resend = new Resend(apiKey)
  const fromEmail =
    process.env.RESEND_FROM_EMAIL || 'KojixKoji Store <onboarding@resend.dev>'

  const itemsList = data.items
    .map(
      (item) =>
        `  • ${item.name} x${item.quantity} @ CA$${item.price.toFixed(2)}${item.size ? ` (${item.size})` : ''}`
    )
    .join('\n')

  const shipping = [
    `${data.shippingAddress.firstName} ${data.shippingAddress.lastName}`,
    data.shippingAddress.address1,
    data.shippingAddress.address2,
    `${data.shippingAddress.city}, ${data.shippingAddress.province} ${data.shippingAddress.postal}`,
    data.shippingAddress.country,
    data.shippingAddress.notes,
  ]
    .filter(Boolean)
    .join('\n')

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Order ${data.orderId}</title>
</head>
<body style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
  <h1 style="color: #ec4899;">✨ New Order Received</h1>
  <p>You have a new order on KojixKoji Store.</p>
  
  <div style="background: #fdf2f8; border-radius: 8px; padding: 16px; margin: 16px 0;">
    <p style="margin: 0 0 8px 0;"><strong>Order ID:</strong> ${data.orderId}</p>
    <p style="margin: 0;"><strong>Customer:</strong> ${data.customerEmail}</p>
  </div>

  <h2 style="font-size: 1rem; color: #6b7280;">Items</h2>
  <pre style="background: #f9fafb; padding: 12px; border-radius: 6px; overflow-x: auto;">${itemsList}</pre>

  <h2 style="font-size: 1rem; color: #6b7280;">Totals</h2>
  <table style="width: 100%; border-collapse: collapse;">
    <tr><td style="padding: 4px 0;">Subtotal</td><td style="text-align: right;">CA$${data.subtotal.toFixed(2)}</td></tr>
    <tr><td style="padding: 4px 0;">Taxes</td><td style="text-align: right;">CA$${data.taxes.toFixed(2)}</td></tr>
    <tr><td style="padding: 4px 0;">Shipping</td><td style="text-align: right;">CA$${data.shipping.toFixed(2)}</td></tr>
    <tr><td style="padding: 8px 0; font-weight: bold;">Total</td><td style="text-align: right; font-weight: bold;">CA$${data.total.toFixed(2)}</td></tr>
  </table>

  <h2 style="font-size: 1rem; color: #6b7280;">Shipping Address</h2>
  <pre style="background: #f9fafb; padding: 12px; border-radius: 6px; white-space: pre-wrap;">${shipping}</pre>

  <p style="margin-top: 24px; color: #6b7280; font-size: 0.875rem;">
    View and manage this order in your <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://kojixkoji.vercel.app'}/admin/dashboard">Admin Dashboard</a>.
  </p>
</body>
</html>
  `.trim()

  const text = `
New Order Received

Order ID: ${data.orderId}
Customer: ${data.customerEmail}

Items:
${itemsList}

Totals:
Subtotal: CA$${data.subtotal.toFixed(2)}
Taxes: CA$${data.taxes.toFixed(2)}
Shipping: CA$${data.shipping.toFixed(2)}
Total: CA$${data.total.toFixed(2)}

Shipping Address:
${shipping}
  `.trim()

  try {
    const { data: result, error } = await resend.emails.send({
      from: fromEmail,
      to: [toEmail],
      subject: `🛒 New order ${data.orderId} - CA$${data.total.toFixed(2)}`,
      html,
      text,
    })

    if (error) {
      console.error('Failed to send order notification email:', error)
      return { success: false, error: error.message }
    }

    console.log(`Order notification email sent for ${data.orderId}`, result?.id)
    return { success: true }
  } catch (err: any) {
    console.error('Error sending order notification email:', err)
    return { success: false, error: err?.message || 'Unknown error' }
  }
}

/**
 * Send order confirmation email to the CUSTOMER when their order is completed.
 * Requires RESEND_API_KEY. For production, verify your domain in Resend so you
 * can send to any customer email (onboarding domain can only send to your own).
 */
export async function sendOrderConfirmationEmail(
  data: OrderNotificationData
): Promise<{ success: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY

  if (!apiKey) {
    console.warn('Customer confirmation not sent: Set RESEND_API_KEY')
    return { success: false, error: 'Email not configured' }
  }

  const resend = new Resend(apiKey)
  const fromEmail =
    process.env.RESEND_FROM_EMAIL || 'KojixKoji Store <onboarding@resend.dev>'

  const customerName = data.shippingAddress.firstName || 'there'

  const itemsList = data.items
    .map(
      (item) =>
        `  • ${item.name} x${item.quantity} @ CA$${item.price.toFixed(2)}${item.size ? ` (${item.size})` : ''}`
    )
    .join('\n')

  const shipping = [
    `${data.shippingAddress.firstName} ${data.shippingAddress.lastName}`,
    data.shippingAddress.address1,
    data.shippingAddress.address2,
    `${data.shippingAddress.city}, ${data.shippingAddress.province} ${data.shippingAddress.postal}`,
    data.shippingAddress.country,
    data.shippingAddress.notes,
  ]
    .filter(Boolean)
    .join('\n')

  const shopUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kojixkoji.vercel.app'

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation - ${data.orderId}</title>
</head>
<body style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
  <h1 style="color: #ec4899;">✨ Thank you for your order, ${customerName}!</h1>
  <p>We've received your order and are getting your kawaii goodies ready.</p>
  
  <div style="background: #fdf2f8; border-radius: 8px; padding: 16px; margin: 16px 0;">
    <p style="margin: 0 0 8px 0;"><strong>Order ID:</strong> ${data.orderId}</p>
    <p style="margin: 0; font-size: 0.875rem; color: #6b7280;">Save this for your records and order tracking.</p>
  </div>

  <h2 style="font-size: 1rem; color: #6b7280;">What you ordered</h2>
  <pre style="background: #f9fafb; padding: 12px; border-radius: 6px; overflow-x: auto;">${itemsList}</pre>

  <h2 style="font-size: 1rem; color: #6b7280;">Order total</h2>
  <table style="width: 100%; border-collapse: collapse;">
    <tr><td style="padding: 4px 0;">Subtotal</td><td style="text-align: right;">CA$${data.subtotal.toFixed(2)}</td></tr>
    <tr><td style="padding: 4px 0;">Taxes</td><td style="text-align: right;">CA$${data.taxes.toFixed(2)}</td></tr>
    <tr><td style="padding: 4px 0;">Shipping</td><td style="text-align: right;">CA$${data.shipping.toFixed(2)}</td></tr>
    <tr><td style="padding: 8px 0; font-weight: bold;">Total paid</td><td style="text-align: right; font-weight: bold;">CA$${data.total.toFixed(2)}</td></tr>
  </table>

  <h2 style="font-size: 1rem; color: #6b7280;">Shipping to</h2>
  <pre style="background: #f9fafb; padding: 12px; border-radius: 6px; white-space: pre-wrap;">${shipping}</pre>

  <p style="margin-top: 24px; color: #6b7280; font-size: 0.875rem;">
    You'll receive another email when your order ships. Questions? Reply to this email or visit our <a href="${shopUrl}/contact">contact page</a>.
  </p>
  <p style="margin-top: 16px;">
    <a href="${shopUrl}/shop" style="color: #ec4899; text-decoration: none; font-weight: 600;">Continue shopping →</a>
  </p>
</body>
</html>
  `.trim()

  const text = `
Thank you for your order, ${customerName}!

We've received your order and are getting your kawaii goodies ready.

Order ID: ${data.orderId}
(Save this for your records and order tracking)

What you ordered:
${itemsList}

Order total:
Subtotal: CA$${data.subtotal.toFixed(2)}
Taxes: CA$${data.taxes.toFixed(2)}
Shipping: CA$${data.shipping.toFixed(2)}
Total paid: CA$${data.total.toFixed(2)}

Shipping to:
${shipping}

You'll receive another email when your order ships.
Questions? Visit ${shopUrl}/contact
  `.trim()

  try {
    const { data: result, error } = await resend.emails.send({
      from: fromEmail,
      to: [data.customerEmail],
      subject: `✨ Order confirmed - ${data.orderId} | KojixKoji`,
      html,
      text,
    })

    if (error) {
      console.error('Failed to send customer order confirmation:', error)
      return { success: false, error: error.message }
    }

    console.log(`Customer confirmation email sent for ${data.orderId} to ${data.customerEmail}`, result?.id)
    return { success: true }
  } catch (err: any) {
    console.error('Error sending customer order confirmation:', err)
    return { success: false, error: err?.message || 'Unknown error' }
  }
}
