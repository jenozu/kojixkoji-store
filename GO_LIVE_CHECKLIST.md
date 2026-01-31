# Go Live Checklist – KojixKoji Store

Use this checklist when switching from test mode to live payments.

---

## 1. Stripe Live Keys

- [ ] In **Stripe Dashboard**, switch to **Live mode** (toggle top right).
- [ ] Go to **Developers → API keys** and copy:
  - **Publishable key** (`pk_live_...`) → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
  - **Secret key** (`sk_live_...`) → `STRIPE_SECRET_KEY`
- [ ] **Security:** If your live secret key was ever pasted in chat or shared, go to **Developers → API keys**, open the live secret key, and **Rotate key**. Use the new secret everywhere.

---

## 2. Production Webhook (Stripe)

- [ ] In **Stripe Dashboard** (Live mode), go to **Developers → Webhooks**.
- [ ] Click **Add endpoint**.
- [ ] **Endpoint URL:** `https://your-production-domain.com/api/webhooks/stripe`  
  (Replace with your real domain, e.g. `https://kojixkoji.vercel.app/api/webhooks/stripe`.)
- [ ] Under **Events to send**, add:
  - `payment_intent.succeeded`
  - `payment_intent.payment_failed`
- [ ] Click **Add endpoint**.
- [ ] Open the new endpoint → **Signing secret** → **Reveal** → Copy.
- [ ] Save this as `STRIPE_WEBHOOK_SECRET` in your **production** environment (e.g. Vercel).  
  **Important:** Production webhook secret is different from the one you use with Stripe CLI locally.

---

## 3. Database (Supabase)

- [ ] Open **Supabase Dashboard** → **SQL Editor**.
- [ ] Run the contents of `STRIPE_DATABASE_MIGRATION.sql` (adds payment fields to `orders`).
- [ ] Confirm the `orders` table has columns: `payment_intent_id`, `payment_status`, `payment_method`.

---

## 4. Deploy & Environment Variables

- [ ] Deploy your app (e.g. push to GitHub if Vercel auto-deploys, or run your deploy command).
- [ ] In your **hosting dashboard** (e.g. **Vercel → Project → Settings → Environment Variables**), set for **Production**:

| Variable | Value | Notes |
|----------|--------|--------|
| `STRIPE_SECRET_KEY` | `sk_live_...` | Live secret key |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_live_...` | Live publishable key |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` | From step 2 (production webhook) |

- [ ] Also ensure **Supabase** and **admin** variables are set for production (see `VERCEL_DEPLOYMENT.md`).
- [ ] **Redeploy** after changing env vars so the new values are used.

---

## 5. Local `.env.local` (optional)

- For **local development**, keep **test** keys in `.env.local` so you don’t charge real cards while coding.
- For **testing live** on your machine, you can temporarily put live keys in `.env.local`; switch back to test keys when done.

---

## 6. Test Live Payment

- [ ] Open your **live** site (e.g. `https://your-domain.com`).
- [ ] Add a product to cart and go to checkout.
- [ ] Use a **real card** for a **small amount** (e.g. CA$1).
- [ ] Complete payment and confirm:
  - Redirect to thank-you page.
  - In **Stripe Dashboard (Live)** → **Payments**, the payment appears.
  - In **Supabase** → `orders`, a new row exists with `payment_intent_id` and `payment_status` (e.g. `succeeded`).

---

## 7. Post–Go Live

- [ ] **Rotate** the live secret key if it was ever exposed (see step 1).
- [ ] Consider: email confirmations, order tracking, inventory, and monitoring (see your earlier “what’s next” list).

---

## Quick reference

- **Stripe live keys:** Dashboard → Live mode → Developers → API keys  
- **Production webhook:** Dashboard → Live mode → Developers → Webhooks → Add endpoint  
- **Migration SQL:** `STRIPE_DATABASE_MIGRATION.sql`  
- **Vercel env vars:** Project → Settings → Environment Variables → Production
