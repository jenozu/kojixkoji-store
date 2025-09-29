"use client"

import { useFavorites } from "@/lib/favorites-context"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"

export default function FavoritesPage() {
  const { favorites, clearFavorites } = useFavorites()

  return (
    <div className="min-h-screen">
      <section className="kawaii-gradient py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold">Your Favorites</h1>
              <p className="text-lg text-muted-foreground">
                {favorites.length
                  ? `You have ${favorites.length} saved item${favorites.length > 1 ? "s" : ""}`
                  : "No favorites yet."}
              </p>
            </div>
            {favorites.length > 0 && (
              <Button variant="outline" className="bg-transparent" onClick={clearFavorites}>
                Clear All
              </Button>
            )}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {favorites.length > 0 ? (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {favorites.map((p) => (
              <ProductCard key={p.id} {...p} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground mb-4">
              Tap the heart on any product to add it here.
            </p>
            <a href="/shop" className="underline">Browse the shop</a>
          </div>
        )}
      </div>
    </div>
  )
}
