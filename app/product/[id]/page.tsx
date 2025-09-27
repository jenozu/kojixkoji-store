"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, Heart, ShoppingCart, Share2, Minus, Plus } from "lucide-react"
import { useFavorites } from "@/lib/favorites-context"
import { useCart } from "@/lib/cart-context"

export default function ProductPage() {
  const params = useParams()
  const productId = params.id as string

  const [selectedSize, setSelectedSize] = useState("M")
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [adding, setAdding] = useState(false)

  // Mock product data - replace with real data fetch later
  const product = {
    id: productId,
    name: "Dreamy Cat Girl Print",
    price: 24.99,
    originalPrice: 29.99,
    description:
      "Bring kawaii magic to your space with this adorable cat girl art print. Featuring soft pastel colors and dreamy anime aesthetics, this high-quality print is perfect for any kawaii lover's collection.",
    images: [
      "/kawaii-anime-cat-girl-art-print-pastel-colors.jpg",
      "/kawaii-anime-cat-girl-art-print-pastel-colors.jpg",
      "/kawaii-anime-cat-girl-art-print-pastel-colors.jpg",
    ],
    rating: 4.9,
    reviews: 127,
    category: "Art Prints",
    sizes: ["S", "M", "L", "XL"],
    inStock: true,
    features: ["High-quality matte finish", "Fade-resistant inks", "Multiple size options", "Ready to frame"],
  }

  const relatedProducts = [
    { id: 2, name: "Pastel Moon Sweater", price: 45.99, image: "/kawaii-pastel-moon-sweater-cute-anime-style.jpg", rating: 4.8 },
    { id: 3, name: "Cherry Blossom Phone Case", price: 18.99, image: "/kawaii-cherry-blossom-phone-case-pink-anime.jpg", rating: 4.7 },
    { id: 4, name: "Magical Girl Blanket", price: 39.99, image: "/kawaii-magical-girl-blanket-soft-pastel-anime.jpg", rating: 4.9 },
  ]

  // favorites
  const { isFavorited, toggleFavorite } = useFavorites()
  const favorite = isFavorited(product.id)

  // cart
  const { addItem } = useCart()

  const handleAddToCart = async () => {
    setAdding(true)
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] || "/placeholder.svg",
      category: product.category,
      quantity,
      size: selectedSize,
    })
    setTimeout(() => setAdding(false), 350)
  }

  const handleToggleFavorite = () => {
    toggleFavorite({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.images[0] || "/placeholder.svg",
      category: product.category,
    })
  }

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : ""
    try {
      if (navigator.share) {
        await navigator.share({ title: product.name, text: product.description, url })
      } else {
        await navigator.clipboard.writeText(url)
        alert("Link copied!")
      }
    } catch {
      // user cancelled or share failed; silently ignore
    }
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-primary">Shop</Link>
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </div>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg border">
              <img
                src={product.images[selectedImage] || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square overflow-hidden rounded-lg border-2 ${
                    selectedImage === index ? "border-primary" : "border-border"
                  }`}
                  aria-label={`Show image ${index + 1}`}
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div className="space-y-4">
              <Badge variant="outline">{product.category}</Badge>
              <h1 className="text-3xl font-bold text-foreground">{product.name}</h1>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{product.rating}</span>
                </div>
                <span className="text-muted-foreground">({product.reviews} reviews)</span>
              </div>

              <div className="flex items-center space-x-3">
                <span className="text-3xl font-bold text-primary">${product.price}</span>
                {product.originalPrice && (
                  <>
                    <span className="text-xl text-muted-foreground line-through">${product.originalPrice}</span>
                    <Badge className="bg-primary text-primary-foreground">
                      Save ${(product.originalPrice - product.price).toFixed(2)}
                    </Badge>
                  </>
                )}
              </div>
            </div>

            <p className="text-muted-foreground leading-relaxed">{product.description}</p>

            {/* Size Selection */}
            <div className="space-y-3">
              <h3 className="font-semibold">Size</h3>
              <div className="flex space-x-2">
                {product.sizes.map((size) => (
                  <Button
                    key={size}
                    variant={selectedSize === size ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedSize(size)}
                    className="w-12 h-12"
                    aria-pressed={selectedSize === size}
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="space-y-3">
              <h3 className="font-semibold">Quantity</h3>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4">
              <div className="flex space-x-4">
                <Button size="lg" className="flex-1 kawaii-hover" onClick={handleAddToCart} disabled={adding}>
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  {adding ? "Adding..." : "Add to Cart"}
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleToggleFavorite}
                  aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
                  aria-pressed={favorite}
                >
                  <Heart className={`h-5 w-5 ${favorite ? "fill-primary text-primary" : ""}`} />
                </Button>

                <Button size="lg" variant="outline" onClick={handleShare} aria-label="Share product">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>

              {product.inStock ? (
                <p className="text-sm text-green-600 font-medium">✓ In Stock - Ships within 2-3 business days</p>
              ) : (
                <p className="text-sm text-red-600 font-medium">Out of Stock</p>
              )}
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <Tabs defaultValue="description" className="mb-16">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground leading-relaxed">
                  {product.description} This beautiful art print captures the essence of kawaii culture with its soft,
                  dreamy aesthetic and adorable character design. Perfect for decorating your bedroom, office, or any
                  space that needs a touch of cuteness.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="features" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <ul className="space-y-3">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Reviews coming soon!</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Related Products */}
        <section>
          <h2 className="text-2xl font-bold mb-8">You Might Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((p) => (
              <Link key={p.id} href={`/product/${p.id}`}>
                <Card className="group kawaii-hover cursor-pointer">
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <img
                        src={p.image || "/placeholder.svg"}
                        alt={p.name}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4 space-y-2">
                      <h3 className="font-semibold group-hover:text-primary transition-colors">{p.name}</h3>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-primary">${p.price}</span>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm">{p.rating}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
