# Koji Shop - Setup Guide

## Supabase Configuration

This app uses Supabase for database, storage, and backend services. Follow these steps:

### 1. Create a Supabase Project

1. Go to [Supabase](https://supabase.com)
2. Sign up or log in
3. Click **New Project**
4. Choose your organization (or create one)
5. Fill in project details:
   - **Name**: koji-store
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose closest to your users
6. Click **Create new project** (takes ~2 minutes)

### 2. Get Your Supabase Credentials

1. In Supabase Dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (e.g., `https://xxx.supabase.co`)
   - **anon public** key (under "Project API keys")

### 3. Set Environment Variables

Create a `.env.local` file in the root directory with these values:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Admin Password
ADMIN_PASSWORD=your_secure_password
```

**For Vercel deployment:**
- Add these same variables in **Project Settings → Environment Variables**
- Make sure to add them for Production, Preview, and Development
- Redeploy after adding variables

### 4. Create Database Schema

See `SUPABASE_SETUP.md` for detailed SQL schema setup instructions.

Quick setup:
1. Go to **SQL Editor** in Supabase Dashboard
2. Run the SQL schema from `SUPABASE_SETUP.md`
3. This creates `products` and `orders` tables with indexes

### 5. Configure Storage

1. Go to **Storage** in Supabase Dashboard
2. Create bucket: `product-images`
3. Make it public (check "Public bucket")
4. Storage is ready for image uploads

### 6. Migrate Existing Data (Optional)

If you have existing products in Redis:
service firebase.storage {
  match /b/{bucket}/o {
    match /uploads/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## Admin Access

To grant admin access, update the `ADMIN_EMAILS` array in `app/admin/dashboard/page.tsx`:

```typescript
const ADMIN_EMAILS = ["your-admin-email@example.com"]
```

## Development

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

## Deployment to Vercel

1. Connect your GitHub repository to Vercel
2. Add all Firebase environment variables in Project Settings
3. Deploy!

The site will automatically redeploy on every push to main branch.

## Troubleshooting

### Firebase connection errors
- Check that all environment variables are set correctly
- Verify your Firebase project has Authentication and Storage enabled
- Check browser console for detailed error messages

### Admin dashboard not accessible
- Make sure your email is in the `ADMIN_EMAILS` array
- Sign in with that email address

### Build errors
- Run `pnpm run build` locally to catch errors before deploying
- Check that all dependencies are installed
- Verify no TypeScript errors with `pnpm run lint`

