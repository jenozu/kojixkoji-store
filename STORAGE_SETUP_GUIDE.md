# Supabase Storage Setup Guide

## Problem
You're getting errors when trying to upload images, or images aren't showing on the product page.

## Root Cause
The `product-images` storage bucket hasn't been created or configured in your Supabase project.

## Solution: Create Storage Bucket

### Step 1: Create the Bucket

1. Go to https://supabase.com/dashboard
2. Select your project
3. Click **Storage** in the left sidebar
4. Click **Create a new bucket** (green button)
5. Fill in:
   - **Name**: `product-images` (must be exactly this)
   - **Public bucket**: ✅ **TURN THIS ON** (very important!)
   - **File size limit**: Leave default or set to 52428800 (50MB)
   - **Allowed MIME types**: Leave empty (allow all) or add: `image/*,video/*`
6. Click **Create bucket**

### Step 2: Configure Storage Policies

The bucket needs RLS policies to allow uploads. You have two options:

#### Option A: Disable RLS (Quickest - Good for Admin Dashboard)

1. Click on the `product-images` bucket
2. Click the **Policies** tab
3. Click **Disable RLS** toggle at the top

This allows anyone with your anon key to upload/read files.

#### Option B: Create Specific Policies (More Secure)

Run this SQL in your **SQL Editor**:

```sql
-- Allow public access to read files (view images on website)
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

-- Allow authenticated and anon users to upload files
CREATE POLICY "Allow uploads"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'product-images');

-- Allow users to update files they uploaded
CREATE POLICY "Allow updates"
ON storage.objects FOR UPDATE
USING (bucket_id = 'product-images');

-- Allow users to delete files
CREATE POLICY "Allow deletes"
ON storage.objects FOR DELETE
USING (bucket_id = 'product-images');
```

### Step 3: Verify Setup

After creating the bucket, check if it's working:

1. Visit: `https://v0-kojixkoji.vercel.app/api/health`
2. Look for the `storage` section in the JSON response:
   - `bucketExists: true` = ✅ Good
   - `bucketExists: false` = ❌ Bucket not found
   - Check the `error` field for specific issues

### Step 4: Test Upload

1. Go to your admin dashboard
2. Try uploading an image
3. It should now work!

## Common Issues

### "Bucket not found"
- Make sure bucket name is exactly `product-images`
- Refresh the page after creating the bucket

### "New row violates row-level security policy"
- This means RLS is enabled but policies aren't set
- Either disable RLS or create the policies above

### Images still not showing
- Make sure bucket is set to **Public**
- Check browser console (F12) for 403/404 errors
- Verify the image URL in the database starts with your Supabase URL

### Upload fails with "Permission denied"
- Storage policies might be too restrictive
- Try disabling RLS first to test
- If it works, then create proper policies

## Need Help?

Check these endpoints for diagnostics:
- **Health Check**: https://v0-kojixkoji.vercel.app/api/health
- **Products API**: https://v0-kojixkoji.vercel.app/api/products

The health check will tell you exactly what's misconfigured.
