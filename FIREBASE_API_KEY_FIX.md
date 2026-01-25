# 🔑 Firebase API Key Error Fix

## Error Detected
```
FirebaseError: Firebase: Error (auth/api-key-not-valid.-please-pass-a-valid-api-key.)
```

## ✅ Your .env.local File Looks Correct
The format is good - no extra quotes or spaces detected.

---

## 🔧 Fix: Check Firebase Console Settings

### **Step 1: Verify Authentication is Enabled**

1. Go to: https://console.firebase.google.com/
2. Select your project: **kojixkoji-6ea8a**
3. Click **Authentication** in the left menu
4. Click **Get Started** (if you see it)
5. Go to **Sign-in method** tab
6. Find **Email/Password** in the list
7. Click on it and **Enable** it
8. Click **Save**

---

### **Step 2: Check API Key Restrictions (CRITICAL)**

Your API key might have restrictions that block localhost. Here's how to fix:

1. Go to: https://console.cloud.google.com/apis/credentials
2. Make sure you're in the **kojixkoji-6ea8a** project (check top dropdown)
3. Find your API key in the list (starts with `AIzaSyD...`)
4. Click on the API key name to edit it
5. Look at **Application restrictions**:
   - Should be set to **None** OR
   - If set to "HTTP referrers", make sure it includes:
     - `localhost:3000/*`
     - `http://localhost:3000/*`
6. Look at **API restrictions**:
   - Should be **Don't restrict key** OR
   - Make sure **Identity Toolkit API** is enabled
7. Click **Save**

---

### **Step 3: Verify Authorized Domains**

1. Back in Firebase Console: https://console.firebase.google.com/
2. Go to **Authentication** → **Settings** tab
3. Scroll to **Authorized domains**
4. Make sure **localhost** is in the list (it should be by default)
5. If not, click **Add domain** and add `localhost`

---

### **Step 4: Enable Required APIs**

1. Go to: https://console.cloud.google.com/apis/library
2. Search for **Identity Toolkit API**
3. Click on it
4. Click **Enable** (if not already enabled)

---

## 🚀 Alternative: Get a Fresh API Key

If the above doesn't work, create a new web app:

1. Firebase Console → Project Settings (gear icon)
2. Scroll to **Your apps**
3. Click **Add app** → Web icon (`</>`)
4. Register app name: "Web App"
5. Copy the **NEW** config values
6. Replace ALL values in your `.env.local`

---

## 🔄 After Making Changes

1. Save all changes in Firebase Console
2. Restart your dev server:
   ```bash
   # Press Ctrl+C in terminal
   npm run dev
   ```
3. Clear browser cache (Ctrl+Shift+Delete)
4. Try signing in again

---

## 📋 Quick Checklist

- [ ] Authentication enabled in Firebase Console
- [ ] Email/Password provider enabled
- [ ] API key has no restrictions (or localhost is allowed)
- [ ] Identity Toolkit API is enabled
- [ ] localhost is in authorized domains
- [ ] Dev server restarted
- [ ] Browser cache cleared

