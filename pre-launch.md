# 🚀 Launch Checklist for Koji Shop

Here's your step-by-step guide to get your website live!

---

## 📋 Pre-Launch Checklist

### **STEP 1: Set Up Firebase (10 minutes)**

- [ ] Go to [Firebase Console](https://console.firebase.google.com/)
- [ ] Create a new project (or select existing one)
- [ ] Click the **Web** icon (</>) to add a web app
- [ ] Copy your Firebase configuration values
- [ ] **Enable Authentication:**
  - Go to **Build → Authentication**
  - Click "Get Started"
  - Enable **Email/Password** provider
  - Click "Save"
- [ ] **Enable Storage:**
  - Go to **Build → Storage**
  - Click "Get Started"
  - Click "Next" → "Done"
  - Go to **Rules** tab and paste:
    ```javascript
    rules_version = '2';
    service firebase.storage {
      match /b/{bucket}/o {
        match /uploads/{allPaths=**} {
          allow read: if true;
          allow write: if request.auth != null;
        }
      }
    }
    ```
  - Click "Publish"
- [ ] **(Optional) Enable Firestore** for cloud persistence:
  - Go to **Build → Firestore Database**
  - Click "Create database"
  - Choose "Start in test mode" → "Next" → "Enable"

---

### **STEP 2: Add Environment Variables**

**For Local Development:**

- [ ] Create a file named `.env.local` in your project root
- [ ] Copy and paste this, replacing with your Firebase values:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

- [ ] Save the file
- [ ] **Verify** `.env.local` is in your `.gitignore` (it should be by default)

---

### **STEP 3: Configure Admin Access**

- [ ] Open `app/admin/dashboard/page.tsx`
- [ ] Find this line (around line 8):
  ```typescript
  const ADMIN_EMAILS = ["admin@koji.com", "your-admin-email@example.com"]
  ```
- [ ] Replace with **your actual email address**:
  ```typescript
  const ADMIN_EMAILS = ["yourname@gmail.com"]
  ```
- [ ] Save the file

---

### **STEP 4: Test Locally**

- [ ] Open terminal in your project folder
- [ ] Run: `npm install` (if you haven't already)
- [ ] Run: `npm run dev`
- [ ] Open [http://localhost:3000](http://localhost:3000)
- [ ] **Test these flows:**
  - [ ] Click "Account" → Create a new account with your email
  - [ ] Verify you're redirected to `/account/dashboard`
  - [ ] Add a product to cart from the shop
  - [ ] Go to cart and click "Checkout"
  - [ ] Fill out the checkout form and click "Place Order"
  - [ ] Verify you see the thank-you page
  - [ ] Go to `/admin/dashboard` and verify you can access it
  - [ ] Try uploading a test image in the admin panel
  - [ ] Check browser console for any errors (F12 → Console tab)

---

### **STEP 5: Deploy to Vercel**

- [ ] Commit your changes to Git:
  ```bash
  git add .
  git commit -m "Complete Koji Shop launch setup"
  git push origin main
  ```

- [ ] Go to [vercel.com](https://vercel.com) and sign in
- [ ] Click **"Add New..." → Project**
- [ ] Import your GitHub repository
- [ ] **Before deploying**, click **"Environment Variables"**
- [ ] Add all 6 Firebase variables:
  ```
  NEXT_PUBLIC_FIREBASE_API_KEY = your_value
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = your_value
  NEXT_PUBLIC_FIREBASE_PROJECT_ID = your_value
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = your_value
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = your_value
  NEXT_PUBLIC_FIREBASE_APP_ID = your_value
  ```
- [ ] Make sure all are added for **Production, Preview, and Development**
- [ ] Click **"Deploy"**
- [ ] Wait for build to complete (~2-3 minutes)
- [ ] Click "Visit" to see your live site! 🎉

---

### **STEP 6: Post-Launch Testing**

- [ ] Test sign-up on production site
- [ ] Test sign-in on production site
- [ ] Test adding to cart
- [ ] Test checkout flow
- [ ] Test admin dashboard access
- [ ] Test image upload in admin panel
- [ ] Test on mobile device
- [ ] Share with a friend and get feedback!

---

## 🔧 Optional: Enable Firestore Persistence

If you want favorites and orders to sync to the cloud:

- [ ] Uncomment the Firestore integration examples in `lib/firestore-helpers.ts`
- [ ] Add Firestore rules in Firebase Console:
  ```javascript
  rules_version = '2';
  service cloud.firestore {
    match /databases/{database}/documents {
      match /users/{userId}/{document=**} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
  ```

---

## 📝 Quick Reference

**Where to find Firebase config:**
1. Firebase Console → Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Copy the config values

**Common Issues:**
- ❌ "Firebase auth/invalid-api-key" → Check your `.env.local` has correct values
- ❌ "Access Denied" on admin → Update `ADMIN_EMAILS` with your email
- ❌ Build fails → Make sure all 6 Firebase env vars are set in Vercel

**Need Help?**
- See `SETUP.md` for detailed Firebase instructions
- See `DEPLOYMENT-SUMMARY.md` for feature overview

---

## ✅ You're Done When...

- ✅ You can sign up and sign in on production
- ✅ You can add items to cart and checkout
- ✅ You see the thank-you page after checkout
- ✅ You can access `/admin/dashboard` with your email
- ✅ You can upload images in the admin panel
- ✅ No console errors on any page

---

**Estimated Time:** 20-30 minutes total

**Current Status:** Your code is complete and ready. You just need to add Firebase credentials and deploy! 🚀

