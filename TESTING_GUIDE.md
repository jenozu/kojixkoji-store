# 🧪 Testing Guide - Koji Store

## 🚀 Quick Start

### **Step 1: Open Your Website**

Once the dev server is running, open your browser to:

**http://localhost:3000**

You should see the homepage!

---

## ✅ **Step 2: Test Authentication (The Issue Area)**

### **A. Try User Registration**

1. **Go to:** http://localhost:3000/account
2. **Click:** "Create Account" tab
3. **Fill in:**
   - Name: Test User
   - Email: test@example.com
   - Password: test123 (must be 6+ characters)
4. **Click:** "Create Account"

### **Expected Results:**

#### ✅ **If It Works:**
- No errors in browser console
- Redirects to `/account/dashboard`
- Dashboard shows your name/email

#### ❌ **If It Fails - Check Console:**

Open browser DevTools (F12) → Console tab, look for:

**Error 1: "auth/api-key-not-valid"**
```
🔧 FIX: Enable Authentication in Firebase Console
1. Go to: https://console.firebase.google.com/
2. Select project: kojixkoji-6ea8a
3. Click: Authentication → Get Started
4. Click: Sign-in method tab
5. Enable: Email/Password
6. Click: Save
```

**Error 2: "Missing Firebase environment variables"**
```
🔧 FIX: Check .env.local file exists in project root
- Should have NEXT_PUBLIC_FIREBASE_API_KEY, etc.
- Restart dev server after creating it
```

**Error 3: "Firebase: operation-not-allowed"**
```
🔧 FIX: Email/Password authentication not enabled
- Same fix as Error 1 above
```

---

### **B. Try User Sign-In**

1. **If registration worked**, try signing out then back in:
   - Click "Sign out" in dashboard
   - Go to `/account`
   - Use the same credentials to sign in

2. **Test with wrong password:**
   - Should show "Wrong email or password" error

---

## 📦 **Step 3: Test Shop & Products**

1. **Go to:** http://localhost:3000/shop

### **Check:**
- [ ] Products display on the page
- [ ] No "Loading..." message forever
- [ ] Products have images
- [ ] Can click on products to view details

### **If Empty/No Products:**

**Option A: Add via Admin Panel**
1. Go to: http://localhost:3000/admin/dashboard
2. Sign in with your admin email (andel.obryan@gmail.com)
3. Click "Products" tab → "Add Product"
4. Fill in product details and upload image
5. Save product

**Option B: Check API**
1. Open: http://localhost:3000/api/products
2. Should show JSON array of products (or empty array `[]`)

---

## 🛒 **Step 4: Test Shopping Cart**

1. **Go to shop page**
2. **Click on a product** → View product details
3. **Click "Add to Cart"**
4. **Check cart icon** in header - should show item count
5. **Go to cart:** http://localhost:3000/cart
6. **Verify:**
   - Product shows in cart
   - Can update quantity
   - Can remove items
   - Total calculates correctly

---

## 💳 **Step 5: Test Checkout (Expected Issues)**

1. **Go to:** http://localhost:3000/checkout
2. **Fill in shipping info:**
   - Email, name, address, etc.
3. **Click:** "Place Order (Demo)"

### **Expected:**
- ✅ Redirects to `/thank-you` page
- ✅ Shows order number
- ❌ **No payment** (this is expected - payment not implemented yet)

---

## 🔍 **Step 6: Check Browser Console**

**Open DevTools (F12) → Console tab**

### **Look for:**
- ❌ Red errors (these need fixing)
- ⚠️ Yellow warnings (usually okay)
- ✅ "Firebase Config Status" - should show all ✅ Set

### **Common Errors to Fix:**

| Error Message | What It Means | How to Fix |
|--------------|---------------|------------|
| `auth/api-key-not-valid` | Firebase API key invalid or auth not enabled | Enable Email/Password in Firebase Console |
| `Missing Firebase environment variables` | .env.local file missing or incomplete | Create .env.local with Firebase credentials |
| `Failed to fetch products` | Products API error | Check Redis connection or add products |
| `Cannot read property of undefined` | Code bug | Check specific line number |

---

## 📋 **Testing Checklist**

Before considering the site "working", verify:

### **Authentication:**
- [ ] Can create new account
- [ ] Can sign in with existing account
- [ ] Wrong password shows error
- [ ] Dashboard shows after sign-in
- [ ] Can sign out

### **Products:**
- [ ] Products display on `/shop`
- [ ] Can click product to see details
- [ ] Products have images
- [ ] Search/filter works

### **Cart:**
- [ ] Can add products to cart
- [ ] Cart count updates in header
- [ ] Cart page shows items
- [ ] Can update quantities
- [ ] Can remove items
- [ ] Cart persists on page refresh

### **Checkout:**
- [ ] Can fill checkout form
- [ ] "Place Order" works (demo mode)
- [ ] Thank you page shows after order

### **Admin:**
- [ ] Can access `/admin/dashboard` with admin email
- [ ] Can add products
- [ ] Can edit products
- [ ] Can delete products
- [ ] Images upload to Firebase Storage

---

## 🐛 **Quick Diagnostics**

### **Server Not Starting?**
```bash
# Check if port 3000 is in use
netstat -ano | findstr :3000

# Kill process if needed, then restart
npm run dev
```

### **Module Not Found Errors?**
```bash
# Reinstall dependencies
npm install
```

### **Firebase Errors?**
1. Check `.env.local` exists
2. Verify all 6 Firebase variables are set
3. Restart dev server after changing `.env.local`

---

## 🎯 **Priority Issues to Fix**

Based on testing, fix in this order:

1. **🔴 CRITICAL: Firebase Authentication**
   - If registration/sign-in doesn't work
   - See `FIREBASE_API_KEY_FIX.md`

2. **🟠 HIGH: Products Missing**
   - If `/shop` is empty
   - Add products via admin panel

3. **🟠 HIGH: Payment Processing**
   - Checkout works but no payment
   - Need Stripe/PayPal integration

4. **🟡 MEDIUM: Everything Else**
   - Order storage, emails, etc.

---

## 📸 **What to Look For**

### **✅ Good Signs:**
- No red errors in console
- Firebase config shows ✅ Set
- Pages load without errors
- Navigation works smoothly
- Forms submit successfully

### **❌ Red Flags:**
- Red errors in console
- Pages show "Error" or crash
- Forms don't submit
- Data doesn't save
- Firebase errors

---

## 💡 **Tips**

- **Keep console open** while testing (F12)
- **Test in incognito mode** to avoid cached issues
- **Check Network tab** if API calls fail
- **Clear localStorage** if cart/favorites act weird:
  ```javascript
  // In browser console:
  localStorage.clear()
  sessionStorage.clear()
  location.reload()
  ```

---

## 🆘 **Need Help?**

If you see errors, note:
1. **Error message** (exact text)
2. **Where it happens** (which page/action)
3. **Browser console** screenshot (optional)

Then we can fix it! 🚀
