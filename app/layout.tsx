import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Suspense } from "react"

// state/providers
import { CartProvider } from "@/lib/cart-context"
import { FavoritesProvider } from "@/lib/favorites-context"
import { AuthProvider } from "@/lib/auth-context" // ✅ add this

import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

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
      <body className={`${inter.className} antialiased`}>
        {/* ✅ AuthProvider must wrap the app so user state is available everywhere */}
        <AuthProvider>
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
        </AuthProvider>

        <Analytics />
      </body>
    </html>
  )
}
