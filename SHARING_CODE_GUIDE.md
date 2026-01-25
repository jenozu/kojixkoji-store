# 📦 Guide: Sharing Code with Your Web Designer

## ✅ **INCLUDE These Folders/Files:**

### **Source Code (Required)**
- ✅ `app/` - All your pages and routes
- ✅ `components/` - React components (UI elements)
- ✅ `lib/` - Utility functions and contexts
- ✅ `public/` - Images, icons, static assets
- ✅ `styles/` - CSS files (if you have any)

### **Configuration Files (Required)**
- ✅ `package.json` - Lists all dependencies
- ✅ `package-lock.json` - Locks dependency versions
- ✅ `tsconfig.json` - TypeScript configuration
- ✅ `next.config.mjs` - Next.js configuration
- ✅ `postcss.config.mjs` - PostCSS/Tailwind config
- ✅ `components.json` - shadcn/ui components config
- ✅ `.gitignore` - What to ignore (helpful for them)

### **Documentation (Helpful)**
- ✅ `README.md` - Project overview
- ✅ `SETUP.md` - Setup instructions
- ✅ `FIXES_APPLIED.md` - Recent bug fixes
- ✅ `DEPLOYMENT-SUMMARY.md` - Deployment notes
- ✅ `ENV_SETUP_GUIDE.txt` - Environment setup guide

---

## ❌ **DO NOT Include (Exclude These):**

### **Sensitive Files (NEVER Share!)**
- ❌ `.env.local` - Contains your Firebase secrets
- ❌ `.env` - Any environment files
- ❌ `.env.*` - All environment files

### **Build Output (Not Needed)**
- ❌ `node_modules/` - Can be recreated with `npm install`
- ❌ `.next/` - Next.js build cache
- ❌ `out/` - Static export output
- ❌ `build/` - Build files
- ❌ `*.tsbuildinfo` - TypeScript build info
- ❌ `.vercel/` - Vercel deployment config

### **IDE/Editor Files (Optional)**
- ⚠️ `*.code-workspace` - VSCode workspace file (optional)
- ⚠️ `.vscode/` - VSCode settings (optional)

### **Log Files (Not Needed)**
- ❌ `npm-debug.log*`
- ❌ `yarn-debug.log*`
- ❌ `.pnpm-debug.log*`

---

## 🎯 **Recommended Method: Use Git**

**Best Option:** Share via GitHub/GitLab repository

1. **Create a GitHub repository**
2. **Push your code** (git already ignores sensitive files)
3. **Share the repository link** with your friend
4. They can clone it: `git clone <your-repo-url>`

**Advantages:**
- ✅ Automatically excludes `.env.local` (it's in `.gitignore`)
- ✅ Version control
- ✅ Easy updates
- ✅ No file size limits

---

## 📦 **Alternative: Create a Zip File**

If you need to share files directly:

### **Step 1: Create .env.local.example**
Create a template file for environment variables:

```bash
# Copy your .env.local to create an example (without real values)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### **Step 2: Exclude Folders When Zipping**

**Windows (PowerShell):**
```powershell
# Create a zip excluding node_modules and .env files
Compress-Archive -Path app,components,lib,public,styles,*.json,*.mjs,*.ts,*.md,*.txt -DestinationPath kojixkoji-store-share.zip -Exclude node_modules,.env*
```

**Or manually:**
1. Select all files EXCEPT:
   - `node_modules/`
   - `.env.local`
   - `.next/`
   - `.vercel/`
2. Right-click → "Send to" → "Compressed (zipped) folder"

---

## 📋 **Quick Checklist Before Sharing:**

Before sending to your friend, make sure:

- [ ] ✅ `.env.local` is **NOT** included
- [ ] ✅ `node_modules/` is **NOT** included  
- [ ] ✅ `.next/` is **NOT** included
- [ ] ✅ All source code (`app/`, `components/`, `lib/`) **IS** included
- [ ] ✅ `package.json` **IS** included
- [ ] ✅ `README.md` or setup instructions **IS** included
- [ ] ✅ Created `.env.local.example` with template values

---

## 🚀 **What Your Friend Will Need to Do:**

1. **Extract the code** (if zip) or clone repository
2. **Create `.env.local`** file:
   ```bash
   # Copy ENV_SETUP_GUIDE.txt instructions
   # Add their own Firebase credentials OR ask you for test credentials
   ```
3. **Install dependencies:**
   ```bash
   npm install
   ```
4. **Run the dev server:**
   ```bash
   npm run dev
   ```

---

## 🔐 **Security Notes:**

### **NEVER Share:**
- ❌ Your actual Firebase credentials (`.env.local`)
- ❌ Production API keys
- ❌ Passwords or secrets
- ❌ Private keys

### **Safe to Share:**
- ✅ All source code
- ✅ Configuration files (without secrets)
- ✅ Documentation
- ✅ Public assets

---

## 📝 **Instructions to Give Your Friend:**

Share this with them:

```
Hi! Here's the Koji Store codebase. To get started:

1. Extract/clone the project
2. Create a .env.local file in the root with:
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

3. Run: npm install
4. Run: npm run dev
5. Open: http://localhost:3000

See SETUP.md or ENV_SETUP_GUIDE.txt for Firebase setup details.
```

---

## 🎯 **Recommended Share Method:**

**Best: GitHub Repository** ⭐
1. Create private repository
2. Push code (`.gitignore` protects secrets)
3. Add your friend as collaborator
4. They clone and contribute

**Alternative: Zip File**
- Manually exclude `node_modules/`, `.env.local`, `.next/`
- Include `.env.local.example` template
- Add setup instructions
