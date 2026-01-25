# Vercel Deployment Guide - Supabase Migration

## Environment Variables for Vercel

After migrating to Supabase, update your Vercel environment variables.

### Step 1: Remove Old Variables

In Vercel Dashboard → Your Project → Settings → Environment Variables, **DELETE** these:

**Firebase (no longer needed):**
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

**Redis (no longer needed):**
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

**Vercel Blob (optional, if using Supabase Storage):**
- `BLOB_READ_WRITE_TOKEN`

### Step 2: Add New Variables

Add these **NEW** environment variables:

**Supabase (REQUIRED):**
```
NEXT_PUBLIC_SUPABASE_URL
Value: https://your-project-id.supabase.co
```

```
NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: your-anon-public-key-from-supabase
```

**Admin (REQUIRED):**
```
ADMIN_PASSWORD
Value: your_secure_admin_password
```

### Step 3: Set Environment Scope

For each variable, select:
- ✅ Production
- ✅ Preview
- ✅ Development

### Step 4: Redeploy

1. Go to Deployments tab
2. Click "..." on latest deployment
3. Click "Redeploy"
4. Wait for build to complete

---

## Getting Supabase Credentials

### Project URL
1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to Settings → API
4. Copy **Project URL**
   - Example: `https://abcdefgh.supabase.co`

### Anon Key
1. Same page (Settings → API)
2. Under "Project API keys"
3. Copy **anon** / **public** key
   - This is safe to expose (it's client-side)
   - Row Level Security (RLS) protects your data

---

## Verification

After deployment, check:

1. **Visit your site**: https://your-site.vercel.app
2. **Check console**: No environment variable errors
3. **Test features**:
   - Products load on shop page
   - Admin login works (`/admin/login`)
   - Admin can add products
   - Images upload successfully

---

## Troubleshooting

### "Missing Supabase environment variables" error
- Verify variables are added in Vercel
- Check spelling (case-sensitive)
- Ensure all environments selected (Production/Preview/Development)
- Redeploy after adding variables

### Products not loading
- Check Supabase database has products
- Run migration script if needed
- Verify RLS policies allow public read

### Admin can't login
- Verify `ADMIN_PASSWORD` is set
- Check it matches what you're entering
- Try clearing browser cache

### Images fail to upload
- Verify `product-images` bucket exists in Supabase
- Check bucket is set to public
- Verify storage policies allow uploads

---

## Rollback Plan

If you need to rollback:

1. Keep old env vars temporarily
2. Revert code changes via Git
3. Redeploy previous commit
4. Your old Firebase/Redis data is intact

---

## Performance Tips

### Database
- Indexes are already created in schema
- Use query limits in API routes
- Enable Supabase connection pooling if needed

### Storage
- Images are cached (3600s)
- Public URLs are CDN-served
- Use appropriate image sizes

### Edge Functions (Future)
- Supabase Edge Functions can replace some API routes
- Deploy closer to users globally
- Reduce latency

---

## Monitoring

### Supabase Dashboard
- Database → Tables: View data
- Storage → Buckets: See uploaded files
- Logs: Monitor API usage
- Database → Extensions: Enable pg_stat_statements for query analysis

### Vercel Dashboard
- Analytics: Track page views
- Logs: Monitor API routes
- Insights: Performance metrics

---

## Security Checklist

- ✅ Changed admin password from default
- ✅ RLS policies enabled on tables
- ✅ Storage policies set correctly
- ✅ `.env.local` not committed to git
- ✅ Supabase anon key is public (safe by design)
- ✅ Admin routes protected by password

---

## Next Steps

1. **Test thoroughly** on production
2. **Monitor logs** for first few days
3. **Set up backups** in Supabase (Settings → Database)
4. **Enable auth** if you want user accounts later (optional)
5. **Add email notifications** for orders (future enhancement)

---

## Support

- **Vercel**: https://vercel.com/docs
- **Supabase**: https://supabase.com/docs
- **This Project**: See README.md and MIGRATION_COMPLETE.md

---

✅ Your store is now deployed with Supabase!
