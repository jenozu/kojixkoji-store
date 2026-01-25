# Supabase Setup Guide

## Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Choose your organization (or create one)
5. Fill in project details:
   - **Name**: koji-store (or your preferred name)
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free (perfect for getting started)
6. Click "Create new project"
7. Wait ~2 minutes for project to be provisioned

## Step 2: Get API Credentials

1. In Supabase Dashboard, go to **Settings** (gear icon in left sidebar)
2. Click **API** in the settings menu
3. Copy these values (you'll need them for `.env.local`):
   - **Project URL** (under "Project URL")
   - **anon public** key (under "Project API keys")

## Step 3: Create Database Schema

1. In Supabase Dashboard, click **SQL Editor** (left sidebar)
2. Click **New query**
3. Copy and paste the following SQL:

```sql
-- Products table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL,
  cost NUMERIC(10, 2),
  category TEXT NOT NULL,
  image_url TEXT,
  stock INTEGER DEFAULT 0,
  sizes JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  items JSONB NOT NULL,
  subtotal NUMERIC(10, 2) NOT NULL,
  taxes NUMERIC(10, 2) NOT NULL,
  shipping NUMERIC(10, 2) NOT NULL,
  total NUMERIC(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending',
  shipping_address JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_orders_email ON orders(email);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- RLS Policies (public read, admin write handled in API)
CREATE POLICY "Allow public read access to products"
  ON products FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access to orders"
  ON orders FOR SELECT
  USING (true);
```

4. Click **Run** (or press Ctrl/Cmd + Enter)
5. You should see "Success. No rows returned" message

## Step 4: Configure Storage

1. In Supabase Dashboard, click **Storage** (left sidebar)
2. Click **Create a new bucket**
3. Fill in:
   - **Name**: `product-images`
   - **Public bucket**: Toggle ON (check the box)
4. Click **Create bucket**
5. Click on the `product-images` bucket
6. Click **Policies** tab
7. Click **New policy**
8. For INSERT/UPDATE/DELETE, select "Create policy for public access"
9. For SELECT, it should already be public (since bucket is public)

## Step 5: Update Environment Variables

1. Open your `.env.local` file (or create it if it doesn't exist)
2. Add these lines with your actual values:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Keep admin password
ADMIN_PASSWORD=your_admin_password
```

3. Replace `your-project-id` with your actual project ID
4. Replace `your-anon-key-here` with the anon public key you copied
5. Save the file

## Step 6: Verify Setup

Once the code migration is complete, test:
- Products can be created in admin dashboard
- Products appear on shop page
- Images can be uploaded
- Orders are saved (after checkout is implemented)

## Troubleshooting

**"Missing Supabase environment variables" error:**
- Make sure `.env.local` exists in project root
- Check that variable names match exactly (case-sensitive)
- Restart your dev server after adding variables

**Database query errors:**
- Verify you ran all SQL commands in Step 3
- Check Supabase Dashboard > Database > Tables to see if tables exist

**Storage upload errors:**
- Verify bucket is set to public
- Check bucket name is exactly `product-images`
- Verify storage policies allow public access

## Migration from Firebase/Redis

If you have existing products in Redis:
1. The code will create a migration script
2. Run it once to copy products to Supabase
3. Products will continue to work after migration

Your Firebase data will remain untouched during migration (safe rollback).
