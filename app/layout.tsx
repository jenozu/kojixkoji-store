import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Suspense } from "react"

// state/providers
import { CartProvider } from "@/lib/cart-context"
import { FavoritesProvider } from "@/lib/favorites-context"

import "./globals.css"

export const metadata: Metadata = {
  title: "Koji Shop - Kawaii Art & Merchandise",
  description:
    "Discover cute kawaii art prints, apparel, and accessories with dreamy anime aesthetics",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <CartProvider>
          <FavoritesProvider>
            <Header />
            <main className="min-h-screen">
              {/* Only suspense-wrap the route content, not the global chrome */}
              <Suspense fallback={<div className="p-6">Loading...</div>}>
                {children}
              </Suspense>
            </main>
            <Footer />
          </FavoritesProvider>
        </CartProvider>

        <Analytics />
      </body>
    </html>
  )
}
