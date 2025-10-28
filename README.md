# 🌸 Koji Shop - Kawaii eCommerce Store

A beautiful, modern eCommerce site built with Next.js 14, featuring kawaii anime art prints, apparel, and accessories with dreamy pastel aesthetics.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Firebase](https://img.shields.io/badge/Firebase-10-orange)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38bdf8)

## ✨ Features

### Customer Experience
- 🛍️ Browse products by category with search & filters
- ❤️ Add items to favorites (localStorage + optional Firestore sync)
- 🛒 Shopping cart with quantity management
- 👤 User authentication (sign up/sign in via Firebase)
- 📦 Complete checkout flow
- ✅ Order confirmation page
- 📱 Fully responsive mobile design

### Admin Dashboard
- 🔐 Protected admin routes
- 📸 Firebase Storage image uploader
- 📊 Order & user overview (ready to expand)
- 🎨 Product management foundation

### Technical Highlights
- ⚡ Server-side rendering with Next.js 14 App Router
- 🔥 Firebase Auth, Storage & Firestore integration
- 🎨 TailwindCSS with custom kawaii theme
- 🧩 shadcn/ui components
- 📦 Context API for global state
- 💾 localStorage persistence
- 🔒 Route protection

---

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/kojixkoji-store.git
cd kojixkoji-store
npm install
```

### 2. Set Up Firebase

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Authentication** (Email/Password)
3. Enable **Storage** (for product images)
4. Enable **Firestore** (optional, for cloud persistence)
5. Get your Firebase config from Project Settings

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

> **Note**: See [SETUP.md](./SETUP.md) for detailed Firebase setup instructions and security rules.

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Configure Admin Access

Edit `app/admin/dashboard/page.tsx` and update:

```typescript
const ADMIN_EMAILS = ["your-admin-email@example.com"]
```

---

## 📂 Project Structure

```
kojixkoji-store/
├── app/                      # Next.js 14 App Router
│   ├── (routes)/
│   │   ├── shop/            # Product listing
│   │   ├── product/[id]/    # Product details
│   │   ├── cart/            # Shopping cart
│   │   ├── checkout/        # Checkout flow
│   │   ├── thank-you/       # Order confirmation
│   │   ├── account/         # User auth & dashboard
│   │   └── admin/           # Admin panel
│   ├── layout.tsx           # Root layout with providers
│   └── globals.css          # Global styles & kawaii theme
│
├── components/              # Reusable React components
│   ├── ui/                  # shadcn/ui components
│   ├── header.tsx           # Navigation header
│   ├── footer.tsx           # Site footer
│   └── product-card.tsx     # Product card component
│
├── lib/                     # Utilities & contexts
│   ├── firebase-client.ts   # Firebase initialization
│   ├── auth-context.tsx     # Auth state management
│   ├── cart-context.tsx     # Shopping cart state
│   ├── favorites-context.tsx # Favorites state
│   └── firestore-helpers.ts # Optional Firestore utils
│
├── public/                  # Static assets
│   └── images/              # Product images
│
├── SETUP.md                 # Detailed setup guide
└── DEPLOYMENT-SUMMARY.md    # Launch completion summary
```

---

## 🎨 Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [TailwindCSS](https://tailwindcss.com/) v4
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Authentication**: [Firebase Auth](https://firebase.google.com/docs/auth)
- **Storage**: [Firebase Storage](https://firebase.google.com/docs/storage)
- **Database**: [Firestore](https://firebase.google.com/docs/firestore) (optional)
- **Deployment**: [Vercel](https://vercel.com/)

---

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start dev server on localhost:3000

# Production
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
```

---

## 🌐 Deployment to Vercel

1. Push your code to GitHub
2. Import project in [Vercel Dashboard](https://vercel.com/dashboard)
3. Add all Firebase environment variables in **Project Settings → Environment Variables**
4. Deploy!

Vercel will automatically redeploy on every push to your main branch.

> **Important**: Make sure to add all `NEXT_PUBLIC_FIREBASE_*` environment variables in Vercel before deploying.

---

## 📝 Current Product Data

Products are currently hardcoded in:
- `app/page.tsx` (featured products)
- `app/shop/page.tsx` (all products)

### To Make Products Dynamic:

1. Enable Firestore in your Firebase project
2. Create a `products` collection
3. Use `lib/firestore-helpers.ts` as a reference
4. Update pages to fetch from Firestore instead of static data

---

## 🛠️ Customization

### Update Branding

- **Site name**: Edit `app/layout.tsx` (metadata)
- **Logo**: Replace in `components/header.tsx`
- **Colors**: Modify CSS variables in `app/globals.css`
- **Admin emails**: Update in `app/admin/dashboard/page.tsx`

### Add New Products

Currently, update the product arrays in:
- `app/shop/page.tsx`
- `app/page.tsx`

Or implement Firestore integration for dynamic products.

---

## 🔒 Security Notes

- Firebase config is **safe to expose** (they're public API keys)
- Protect sensitive operations with **Firebase Security Rules**
- Admin routes check user email against `ADMIN_EMAILS` array
- See [SETUP.md](./SETUP.md) for recommended security rules

---

## 📚 Documentation

- [SETUP.md](./SETUP.md) - Complete Firebase setup guide
- [DEPLOYMENT-SUMMARY.md](./DEPLOYMENT-SUMMARY.md) - What was built & how to launch

---

## 🐛 Troubleshooting

### Build fails with Firebase errors
- **Cause**: Missing environment variables
- **Fix**: Add all `NEXT_PUBLIC_FIREBASE_*` vars to `.env.local`

### "Access Denied" on admin dashboard
- **Cause**: Your email isn't in `ADMIN_EMAILS`
- **Fix**: Update `app/admin/dashboard/page.tsx` with your email

### Images not uploading
- **Cause**: Firebase Storage not enabled or wrong rules
- **Fix**: Enable Storage and apply rules from SETUP.md

---

## 🎯 Roadmap

- [ ] Stripe/PayPal integration
- [ ] Dynamic product management in admin panel
- [ ] Order status tracking
- [ ] Email notifications (SendGrid/Resend)
- [ ] Product reviews & ratings
- [ ] Inventory management
- [ ] Analytics dashboard

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

---

## 💖 Acknowledgments

- Inspired by kawaii anime aesthetics
- Built with modern web technologies
- Designed for indie creators and small shops

---

**Made with 💖 and pastel colors**

For questions or support, see [SETUP.md](./SETUP.md) or open an issue on GitHub.

