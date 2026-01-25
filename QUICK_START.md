# 🚀 Quick Start Guide - KOJI × KOJI Store

Get your store running in **15 minutes** with Supabase!

---

## Prerequisites

- Node.js 18+
- Free Supabase account
- Code editor

---

## Step 1: Install Dependencies (2 min)

```bash
npm install
```

---

## Step 2: Set Up Supabase (5 min)

### 2.1 Create Project
1. Go to [supabase.com](https://supabase.com)
2. Sign up/login
3. **New Project** → Name it → Choose region → Create

### 2.2 Run SQL Schema
1. In Supabase Dashboard → **SQL Editor**
2. **New query**
3. Copy SQL from `SUPABASE_SETUP.md` (lines 42-90)
4. **Run** (Ctrl/Cmd + Enter)

### 2.3 Create Storage Bucket
1. **Storage** tab
2. **New bucket** → Name: `product-images`
3. Check **Public bucket** → Create

### 2.4 Get Credentials
1. **Settings** → **API**
2. Copy:
   - **Project URL**
   - **anon public key**

---

## Step 3: Configure Environment (2 min)

1. Copy `.env.local.example` to `.env.local`
2. Add your Supabase credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
ADMIN_PASSWORD=choose_secure_password
```

---

## Step 4: Start Development Server (1 min)

```bash
npm run dev
```

Open: http://localhost:3000

---

## Step 5: Test Admin Dashboard (3 min)

1. Go to: http://localhost:3000/admin/login
2. Enter your `ADMIN_PASSWORD`
3. **Add a product**:
   - Fill in name, price, category
   - Upload an image
   - Set stock
   - Save

4. **Check shop page**: http://localhost:3000/shop
   - Your product should appear!

---

## Step 6: Deploy to Vercel (2 min)

1. Push to GitHub
2. Go to [vercel.com](https://vercel.com)
3. **Import** your repo
4. **Add environment variables**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `ADMIN_PASSWORD`
5. **Deploy**

Done! Your store is live! 🎉

---

## What You Get

✅ Product catalog with images
✅ Shopping cart (localStorage)
✅ Guest checkout
✅ Admin dashboard with analytics
✅ Order management
✅ Sales charts
✅ Inventory tracking

---

## Next Steps

### Add Products
- Use admin dashboard at `/admin/login`
- Bulk upload via CSV (future feature)
- Import from existing store (see migration script)

### Customize Design
- Edit `app/globals.css` for colors
- Modify components in `components/`
- Update logo and branding

### Add Features
- Payment integration (Stripe)
- Email notifications
- Product reviews
- Search functionality
- Discount codes

### Production Ready
- Change admin password from default
- Set up Supabase backups
- Enable RLS policies for production
- Add domain to Vercel
- Configure email for order confirmations

---

## Troubleshooting

### "Missing Supabase environment variables"
→ Check `.env.local` exists and has correct values
→ Restart dev server

### Products not showing
→ Verify SQL schema ran successfully
→ Check products exist in Supabase Dashboard → Database → products

### Image upload fails
→ Verify `product-images` bucket exists and is public
→ Check storage policies in Supabase

### Can't login to admin
→ Verify `ADMIN_PASSWORD` in `.env.local`
→ Clear browser cache

---

## Resources

- **Full Setup**: `SUPABASE_SETUP.md`
- **Migration**: `MIGRATION_COMPLETE.md`
- **Deployment**: `VERCEL_DEPLOYMENT.md`
- **Features**: `ADMIN_DASHBOARD_FEATURES.md`

---

## Support

Questions? Check the docs in this repo or:
- Supabase Docs: https://supabase.com/docs
- Next.js Docs: https://nextjs.org/docs

---

**Happy selling!** 🛍️✨
