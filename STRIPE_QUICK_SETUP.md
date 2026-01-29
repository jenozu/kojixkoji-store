# ⚡ Stripe Quick Setup Checklist

## ✅ Step-by-Step Setup

### 1. Get Your Stripe Keys (Test Mode)

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. **Toggle to "Test mode"** (top right corner)
3. Go to **Developers** → **API keys**
4. You'll see:
   - **Publishable key** (starts with `pk_test_`) - Copy this
   - **Secret key** (starts with `sk_test_`) - Click "Reveal" and copy

### 2. Add Keys to `.env.local`

Open your `.env.local` file and add:

```env
# Stripe Configuration (Test Mode)
STRIPE_SECRET_KEY=sk_test_paste_your_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_paste_your_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_you_will_get_this_next
```

**Important**: 
- Replace `paste_your_secret_key_here` with your actual secret key
- Replace `paste_your_publishable_key_here` with your actual publishable key
- The webhook secret comes from Step 3

### 3. Set Up Webhooks (Choose One)

#### Option A: Stripe CLI (Recommended for Local Development)

1. **Install Stripe CLI**:
   ```bash
   # Windows (using Scoop)
   scoop install stripe
   
   # Or download from: https://stripe.com/docs/stripe-cli
   ```

2. **Login**:
   ```bash
   stripe login
   ```
   (This will open a browser to authenticate)

3. **Start webhook forwarding**:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

4. **Copy the webhook secret**:
   - You'll see output like: `Ready! Your webhook signing secret is whsec_...`
   - Copy that `whsec_...` value
   - Add it to `.env.local` as `STRIPE_WEBHOOK_SECRET`

5. **Keep this terminal running** while testing payments

#### Option B: Skip Webhooks (For Initial Testing)

- You can skip webhooks for now if you just want to test the payment form
- **Note**: Orders won't be created automatically without webhooks
- You can manually create orders later or set up webhooks when ready

### 4. Update Database Schema

Run the migration SQL in Supabase:

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Copy contents of `STRIPE_DATABASE_MIGRATION.sql`
3. Paste and run it

This adds payment fields to your orders table.

### 5. Test It!

1. **Restart your dev server**:
   ```bash
   npm run dev
   ```

2. **Go to checkout**:
   - Add items to cart
   - Go to `/checkout`
   - Fill in contact & shipping info
   - Click "Continue to Payment"

3. **Test with Stripe test card**:
   - Card number: `4242 4242 4242 4242`
   - Expiry: Any future date (e.g., `12/34`)
   - CVC: Any 3 digits (e.g., `123`)
   - ZIP: Any 5 digits (e.g., `12345`)

4. **Verify**:
   - Payment should process successfully
   - You should be redirected to thank-you page
   - Check Stripe Dashboard → Payments (should show test payment)
   - Check Admin Dashboard → Orders (should show order if webhook worked)

---

## 🔍 Troubleshooting

### "Payment form doesn't load"
- ✅ Check `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is set correctly
- ✅ Make sure it starts with `pk_test_` (not `pk_live_`)
- ✅ Restart dev server after adding env vars

### "Payment fails"
- ✅ Check `STRIPE_SECRET_KEY` is set correctly
- ✅ Make sure it starts with `sk_test_` (not `sk_live_`)
- ✅ Check server console for errors

### "Orders not created"
- ✅ Webhook must be running (if using Stripe CLI)
- ✅ Check `STRIPE_WEBHOOK_SECRET` is correct
- ✅ Check Stripe Dashboard → Webhooks → Events (should show events)
- ✅ Check server logs for webhook processing errors

---

## 🎯 What You Should See

✅ **In Stripe Dashboard**:
- Test payment appears in Payments section
- Webhook events appear in Developers → Webhooks → Events

✅ **In Your Store**:
- Payment form loads correctly
- Payment processes successfully
- Redirects to thank-you page
- Cart clears after payment

✅ **In Admin Dashboard**:
- Order appears with status "processing"
- Payment details are saved

---

## 🚀 Next Steps

Once test mode works:
1. Test with different test cards (decline, 3D Secure)
2. Set up production webhook when deploying
3. Switch to live keys when going live
4. Add PayPal integration (future)
5. Add Klarna integration (future)

---

**Need help?** Check `STRIPE_SETUP.md` for detailed instructions.
