# KOJI × KOJI Store

A modern e-commerce platform built with Next.js 14, Supabase, and shadcn/ui.

## Features

- 🛍️ Product catalog with categories
- 🛒 Shopping cart with localStorage persistence
- ❤️ Favorites system
- 💳 Checkout flow (guest checkout enabled)
- 📊 Admin dashboard with analytics
- 📦 Order management
- 🖼️ Image upload to Supabase Storage
- 🎨 Beautiful UI with Tailwind CSS
- 📱 Fully responsive design

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **Styling**: Tailwind CSS + shadcn/ui
- **Charts**: Recharts
- **Authentication**: Simple password auth for admin

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account (free tier available)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/kojixkoji-store.git
cd kojixkoji-store
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up Supabase**

See `SUPABASE_SETUP.md` for detailed instructions:
- Create Supabase project
- Run database schema
- Create storage bucket
- Get API credentials

4. **Configure environment variables**

Copy `.env.local.example` to `.env.local`:
```bash
cp .env.local.example .env.local
```

Add your credentials:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
ADMIN_PASSWORD=your_secure_password
```

5. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Admin Dashboard

Access the admin panel at `/admin/login`:
- **Default password**: `admin123` (change this immediately!)
- Manage products, orders, and view analytics

Features:
- Product management (CRUD)
- Image upload
- Order tracking
- Sales analytics
- Inventory monitoring

## Project Structure

```
├── app/                  # Next.js app directory
│   ├── api/             # API routes
│   ├── admin/           # Admin dashboard
│   ├── shop/            # Shop pages
│   └── ...
├── components/          # React components
│   └── ui/             # shadcn/ui components
├── lib/                # Utilities and helpers
│   ├── supabase-client.ts
│   └── supabase-helpers.ts
└── public/             # Static assets
```

## Database Schema

### Products
- id, name, description
- price, cost, category
- image_url, stock
- sizes (JSONB)
- timestamps

### Orders
- id, order_id, email
- items (JSONB)
- subtotal, taxes, shipping, total
- status, shipping_address (JSONB)
- timestamps

See `SUPABASE_SETUP.md` for full schema.

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `ADMIN_PASSWORD`
4. Deploy

### Other Platforms

Compatible with any platform that supports Next.js:
- Netlify
- Railway
- Render
- Self-hosted

## Migration from Firebase

If migrating from Firebase:
1. See `MIGRATION_COMPLETE.md`
2. Run migration script (if needed)
3. Update environment variables
4. Test thoroughly

## Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

- **Documentation**: Check the `docs/` folder
- **Issues**: GitHub Issues
- **Supabase**: https://supabase.com/docs

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Database by [Supabase](https://supabase.com/)
- Icons by [Lucide](https://lucide.dev/)

---

Made with ❤️ by KOJI × KOJI
