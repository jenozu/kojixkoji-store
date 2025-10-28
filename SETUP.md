# Koji Shop - Setup Guide

## Firebase Configuration

This app requires Firebase for authentication and storage. Follow these steps:

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use an existing one
3. Enable **Authentication** (Email/Password provider)
4. Enable **Firestore Database** (optional, for orders/favorites persistence)
5. Enable **Storage** (for product image uploads)

### 2. Get Your Firebase Config

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll down to "Your apps" and select or create a Web app
3. Copy the config values

### 3. Set Environment Variables

Create a `.env.local` file in the root directory with these values:

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

**For Vercel deployment:**
- Add these same variables in **Project Settings → Environment Variables**
- Make sure to add them for Production, Preview, and Development
- Redeploy after adding variables

### 4. Firebase Security Rules

**Firestore Rules** (if using Firestore for persistence):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own favorites and orders
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Products are public read, admin write
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.email in ['admin@koji.com'];
    }
  }
}
```

**Storage Rules**:
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

