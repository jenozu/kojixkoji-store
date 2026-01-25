# 🔧 Vercel Blob Storage Setup Guide

## Why You Need Vercel Blob

Your app uses TWO Vercel services:

1. **Vercel KV (Redis/Upstash)** ✅ Already set up
   - Stores: Product data (names, prices, categories)
   - Like: A database/spreadsheet

2. **Vercel Blob** ⏳ Need to set up now
   - Stores: Images and files
   - Like: Dropbox/Google Drive

## 🚀 Quick Setup Steps

### Step 1: Create Blob Storage in Vercel

1. Go to your Vercel Dashboard: https://vercel.com/dashboard
2. Select your `kojixkoji-store` project
3. Click on the **Storage** tab
4. Click **Create Database** or **Connect Store**
5. Select **Blob**
6. Name it: `kojixkoji-images` (or any name you prefer)
7. Click **Create**

### Step 2: Connect to Your Project

Vercel will automatically:
- ✅ Create the blob storage
- ✅ Add `BLOB_READ_WRITE_TOKEN` environment variable
- ✅ Connect it to your project

### Step 3: Verify Environment Variables

After creating the Blob storage, check that these are set:

**Go to:** Project Settings → Environment Variables

You should see:
```
BLOB_READ_WRITE_TOKEN = vercel_blob_rw_...
```

This is automatically added by Vercel!

### Step 4: Deploy

Your app will now use Vercel Blob for uploads:

```bash
# Push changes to trigger deployment
git add .
git commit -m "Add Vercel Blob for image uploads"
git push
```

Or trigger a redeploy in Vercel dashboard.

## 📝 How It Works Now

### Before (Local Storage) ❌
```
Upload image → /public/uploads/filename.jpg
Problem: Doesn't work on Vercel (read-only filesystem)
```

### After (Vercel Blob) ✅
```
Upload image → Vercel Blob → https://[random].public.blob.vercel-storage.com/products/123-image.jpg
Benefits:
✅ Works on Vercel
✅ Fast CDN delivery
✅ No filesystem issues
✅ Automatic backups
```

## 🔍 What Changed in the Code

Updated `app/api/upload/route.ts`:
- ❌ Removed: `fs.writeFile()` (local filesystem)
- ✅ Added: `@vercel/blob` with `put()` method
- Images now stored in Vercel's global CDN

## 🧪 Testing

1. **Local Development:**
   - Add `BLOB_READ_WRITE_TOKEN` to your `.env.local`
   - Get it from Vercel dashboard after creating Blob storage
   - Or just test on production after deploying

2. **Production:**
   - Environment variable is automatically set by Vercel
   - Just deploy and it works!

## 📊 Storage Limits

**Vercel Blob Free Tier:**
- ✅ 500 MB storage
- ✅ 100 GB bandwidth/month
- ✅ Perfect for your store!

Need more? Upgrade to Pro when needed.

## 🎯 Summary

```
Product DATA     → Vercel KV (Redis)      ✅ Already working
Product IMAGES   → Vercel Blob           ⏳ Setup now
User AUTH        → Firebase Auth         ✅ Already working
```

After setup, your complete stack:
- **Database**: Vercel KV (Upstash Redis)
- **File Storage**: Vercel Blob
- **Authentication**: Firebase Auth
- **Hosting**: Vercel

All three work together perfectly! 🎉

---

## 🆘 Troubleshooting

**"BLOB_READ_WRITE_TOKEN not found" error:**
- Make sure you created the Blob storage in Vercel dashboard
- Check that the environment variable exists in Project Settings
- Redeploy after creating the Blob storage

**Images not uploading:**
- Check file size (max 4.5MB)
- Check file type (JPG, PNG, GIF, WebP only)
- Verify Blob storage is connected to your project

**Still see `/public/uploads/` references:**
- Those are fine for local dev (fallback)
- Production will use Vercel Blob automatically

---

**Next Steps:**
1. Create Vercel Blob storage (2 minutes)
2. Push/deploy your code
3. Test image uploads in admin dashboard
4. Done! 🎉

