"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, ShoppingCart } from "lucide-react"
import { useFavorites } from "@/lib/favorites-context"
import { useCart } from "@/lib/cart-context"
import { useState } from "react"

interface ProductCardProps {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  category: string
  isNew?: boolean
}

export function ProductCard({
  id,
  name,
  price,
  originalPrice,
  image,
  category,
  isNew = false,
}: ProductCardProps) {
  const [isLoading, setIsLoading] = useState(false)

  // favorites store
  const { isFavorited, toggleFavorite } = useFavorites()
  const favorite = isFavorited(id)

  // cart store
  const { addItem } = useCart()

  const handleAddToCart = () => {
    setIsLoading(true)
    addItem({ id, name, price, image, category, quantity: 1 })
    setTimeout(() => setIsLoading(false), 300)
  }

  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0

  return (
    <Card className="group overflow-hidden kawaii-hover kawaii-shadow border-0 bg-card">
      <div className="relative aspect-square overflow-hidden">
        <Link href={`/product/${id}`}>
          <Image
            src={image || "/placeholder.svg"}
            alt={name}
            fill
            className="object-contain transition-transform group-hover:scale-105"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {isNew && <Badge className="bg-secondary text-secondary-foreground">New</Badge>}
          {discount > 0 && (
            <Badge className="bg-destructive text-destructive-foreground">{discount}% OFF</Badge>
          )}
        </div>

        {/* Favorite Button (isolated from Link navigation) */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 bg-background/80 hover:bg-background"
          onClick={(e) => {
            // prevent any parent <Link> from navigating
            e.preventDefault()
            e.stopPropagation()
            toggleFavorite({ id, name, price, originalPrice, image, category })
          }}
          aria-label={favorite ? "Unfavorite" : "Favorite"}
          aria-pressed={favorite}
        >
          <Heart className={`h-4 w-4 ${favorite ? "fill-primary text-primary" : ""}`} />
        </Button>
      </div>

      <CardContent className="p-4">
        <div className="space-y-2">
          <Badge variant="secondary" className="text-xs">
            {category}
          </Badge>

          <Link href={`/product/${id}`}>
            <h3 className="font-medium text-sm leading-tight hover:text-primary transition-colors line-clamp-2">
              {name}
            </h3>
          </Link>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold text-primary">CA${price.toFixed(2)}</span>
              {originalPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  CA${originalPrice.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          <Button onClick={handleAddToCart} disabled={isLoading} className="w-full mt-2" size="sm">
            {isLoading ? (
              "Adding..."
            ) : (
              <>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
