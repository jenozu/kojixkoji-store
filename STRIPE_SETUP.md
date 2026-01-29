# 💳 Stripe Payment Integration Setup Guide

This guide will help you set up Stripe payment processing for your KOJI × KOJI store.

## 📋 Prerequisites

- A Stripe account (create one at https://stripe.com)
- Your store is deployed or accessible via a public URL (for webhooks)

---

## 🔑 Step 1: Get Your Stripe API Keys

### Test Mode (Development)

1. Log in to your [Stripe Dashboard](https://dashboard.stripe.com)
2. Make sure you're in **Test mode** (toggle in the top right)
3. Go to **Developers** → **API keys**
4. Copy your keys:
   - **Publishable key** (starts with `pk_test_`) → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - **Secret key** (starts with `sk_test_`) → `STRIPE_SECRET_KEY`

### Production Mode

1. Switch to **Live mode** in Stripe Dashboard
2. Go to **Developers** → **API keys**
3. Copy your **Live** keys:
   - **Publishable key** (starts with `pk_live_`) → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - **Secret key** (starts with `sk_live_`) → `STRIPE_SECRET_KEY`

⚠️ **Important**: Never expose your secret key (`sk_*`) in client-side code or commit it to git!

---

## 🔔 Step 2: Set Up Webhooks

Webhooks allow Stripe to notify your server when payments succeed or fail.

### Local Development (using Stripe CLI)

1. Install Stripe CLI:
   ```bash
   # macOS
   brew install stripe/stripe-cli/stripe
   
   # Windows (using Scoop)
   scoop install stripe
   
   # Or download from https://stripe.com/docs/stripe-cli
   ```

2. Login to Stripe CLI:
   ```bash
   stripe login
   ```

3. Forward webhooks to your local server:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

4. Copy the webhook signing secret (starts with `whsec_`) → `STRIPE_WEBHOOK_SECRET`

### Production (Deployed Site)

1. In Stripe Dashboard, go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Enter your endpoint URL:
   ```
   https://yourdomain.com/api/webhooks/stripe
   ```
4. Select events to listen for:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Click **Add endpoint**
6. Click on the endpoint → **Signing secret** → **Reveal** → Copy → `STRIPE_WEBHOOK_SECRET`

---

## ⚙️ Step 3: Configure Environment Variables

Add these to your `.env.local` file:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

### For Production (Vercel)

1. Go to your Vercel project → **Settings** → **Environment Variables**
2. Add each variable:
   - `STRIPE_SECRET_KEY` (use `sk_live_...` for production)
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (use `pk_live_...` for production)
   - `STRIPE_WEBHOOK_SECRET` (from production webhook endpoint)
3. Set for: **Production**, **Preview**, and **Development**
4. Redeploy your application

---

## 🧪 Step 4: Test the Integration

### Test Cards

Use these test card numbers in Stripe test mode:

- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **3D Secure**: `4000 0025 0000 3155`

Use any:
- Future expiry date (e.g., `12/34`)
- Any 3-digit CVC
- Any ZIP/postal code

### Testing Flow

1. Start your dev server: `npm run dev`
2. Add items to cart
3. Go to checkout
4. Fill in shipping information
5. Click "Continue to Payment"
6. Enter test card: `4242 4242 4242 4242`
7. Complete payment
8. Verify:
   - Redirects to thank-you page
   - Order appears in admin dashboard
   - Webhook logs show `payment_intent.succeeded`

---

## 📊 Step 5: Update Database Schema

Before processing payments, you need to add payment fields to your orders table:

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Run the migration SQL from `STRIPE_DATABASE_MIGRATION.sql`:

```sql
-- Add payment fields to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS payment_intent_id TEXT,
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS payment_method TEXT;

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_orders_payment_intent_id ON orders(payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
```

Or copy the entire contents of `STRIPE_DATABASE_MIGRATION.sql` and run it.

## 📊 Step 6: Verify Orders Are Created

After a successful payment:

1. Check **Stripe Dashboard** → **Payments** → Should show the payment
2. Check **Admin Dashboard** → **Orders** → Should show the order with status "processing"
3. Check **Supabase** → `orders` table → Should have a new order record with payment fields populated

---

## 🔍 Troubleshooting

### Payment form doesn't load

- ✅ Check `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is set correctly
- ✅ Check browser console for errors
- ✅ Verify Stripe publishable key starts with `pk_test_` or `pk_live_`

### Payment fails

- ✅ Check `STRIPE_SECRET_KEY` is set correctly
- ✅ Check server logs for errors
- ✅ Verify you're using test keys in test mode

### Webhook not working

- ✅ Verify `STRIPE_WEBHOOK_SECRET` is correct
- ✅ Check webhook endpoint URL is accessible
- ✅ Check Stripe Dashboard → Webhooks → See event logs
- ✅ For local: Make sure `stripe listen` is running

### Orders not created

- ✅ Check webhook is receiving events (Stripe Dashboard → Webhooks → Events)
- ✅ Check server logs for webhook processing errors
- ✅ Verify Supabase connection is working
- ✅ Check `orders` table schema matches expected format

---

## 🚀 Going Live

When ready for production:

1. **Switch to Live Mode**:
   - Update environment variables with `pk_live_` and `sk_live_` keys
   - Create production webhook endpoint
   - Update `STRIPE_WEBHOOK_SECRET` with production webhook secret

2. **Test with real card**:
   - Use a real card with a small amount
   - Verify payment processes correctly
   - Check order is created

3. **Monitor**:
   - Set up Stripe email alerts for failed payments
   - Monitor webhook delivery in Stripe Dashboard
   - Check order creation in admin dashboard

---

## 📚 Additional Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Testing](https://stripe.com/docs/testing)
- [Stripe Webhooks Guide](https://stripe.com/docs/webhooks)
- [Stripe Payment Intents](https://stripe.com/docs/payments/payment-intents)

---

## ✅ Checklist

- [ ] Stripe account created
- [ ] API keys obtained (test mode)
- [ ] Webhook endpoint configured
- [ ] Environment variables set in `.env.local`
- [ ] Test payment successful
- [ ] Order created in database
- [ ] Admin dashboard shows order
- [ ] Production keys configured (when going live)
- [ ] Production webhook configured (when going live)

---

## 🎉 Next Steps

After Stripe is set up, you can:

1. **Add PayPal** (see future guide)
2. **Add Klarna** (see future guide)
3. **Set up email notifications** for order confirmations
4. **Add refund functionality** in admin dashboard
5. **Configure tax calculation** (currently set to 0%)

---

**Need help?** Check the troubleshooting section or refer to Stripe's documentation.
