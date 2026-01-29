# 🔧 Stripe CLI Setup Guide

## Step 1: Install Stripe CLI

### Windows - Using Scoop (Easiest)

1. **Install Scoop** (if you don't have it):
   ```powershell
   Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
   irm get.scoop.sh | iex
   ```

2. **Install Stripe CLI**:
   ```powershell
   scoop install stripe
   ```

### Windows - Manual Installation

1. **Download Stripe CLI**:
   - Go to: https://github.com/stripe/stripe-cli/releases
   - Download the latest `stripe_X.X.X_windows_x86_64.zip`

2. **Extract**:
   - Unzip to a folder like `C:\stripe-cli`

3. **Add to PATH** (optional but recommended):
   - Open "Environment Variables" in Windows
   - Add `C:\stripe-cli` to your PATH
   - Or just run from that folder

---

## Step 2: Authenticate

1. **Open PowerShell or Command Prompt**

2. **Login to Stripe**:
   ```bash
   stripe login
   ```

3. **Follow the prompts**:
   - It will show a pairing code
   - Open your browser and enter the code
   - This links CLI to your Stripe account

---

## Step 3: Forward Webhooks to Local Server

1. **Make sure your dev server is running**:
   ```bash
   npm run dev
   ```
   (Should be running on `localhost:3000`)

2. **In a NEW terminal window**, run:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

3. **You'll see output like**:
   ```
   > Ready! Your webhook signing secret is whsec_xxxxxxxxxxxxx
   ```

4. **Copy that `whsec_...` secret** and add it to your `.env.local`:
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
   ```

5. **Keep this terminal running** while testing payments!

---

## Step 4: Test It!

1. **Restart your dev server** (to load the webhook secret)

2. **Go through checkout**:
   - Add items to cart
   - Fill in checkout form
   - Use test card: `4242 4242 4242 4242`

3. **Watch both terminals**:
   - Dev server: Should show webhook received
   - Stripe CLI: Should show webhook event

4. **Verify**:
   - Payment succeeds
   - Order created in admin dashboard
   - Webhook events appear in Stripe CLI

---

## Troubleshooting

### "stripe: command not found"
- Make sure Stripe CLI is installed
- Check if it's in your PATH
- Try running from the installation folder

### "Webhook not received"
- Make sure Stripe CLI is running (`stripe listen`)
- Check dev server is running on port 3000
- Verify webhook secret in `.env.local`
- Check both terminal windows for errors

### "Authentication failed"
- Run `stripe login` again
- Make sure you're logged into the correct Stripe account
- Check you're in test mode

---

## Quick Reference

```bash
# Login
stripe login

# Start webhook forwarding
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# View webhook events (in another terminal)
stripe events list

# Trigger test webhook
stripe trigger payment_intent.succeeded
```

---

**That's it!** Once Stripe CLI is forwarding webhooks, your payment integration will be fully functional. 🎉
