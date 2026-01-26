"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
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
  const router = useRouter()
  const productId = params.id as string

  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedSize, setSelectedSize] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [adding, setAdding] = useState(false)

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const res = await fetch(`/api/products/${productId}`)
        if (!res.ok) {
          router.push('/shop')
          return
        }
        const data = await res.json()
        setProduct(data)
        // Set default selected size to first available size
        if (data.sizes && data.sizes.length > 0) {
          setSelectedSize(data.sizes[0].label || data.sizes[0])
        }
      } catch (error) {
        console.error('Error fetching product:', error)
        router.push('/shop')
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [productId, router])

  const relatedProducts = [
    { id: 2, name: "Pastel Moon Sweater", price: 45.99, image: "/kawaii-pastel-moon-sweater-cute-anime-style.jpg", rating: 4.8 },
    { id: 3, name: "Cherry Blossom Phone Case", price: 18.99, image: "/kawaii-cherry-blossom-phone-case-pink-anime.jpg", rating: 4.7 },
    { id: 4, name: "Magical Girl Blanket", price: 39.99, image: "/kawaii-magical-girl-blanket-soft-pastel-anime.jpg", rating: 4.9 },
  ]

  // favorites (hooks must be called unconditionally)
  const { isFavorited, toggleFavorite } = useFavorites()
  const favorite = product ? isFavorited(product.id) : false

  // cart
  const { addItem } = useCart()

  const handleAddToCart = async () => {
    if (!product) return
    setAdding(true)
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.imageUrl || "/placeholder.svg",
      category: product.category,
      quantity,
      size: selectedSize,
    })
    setTimeout(() => setAdding(false), 350)
  }

  const handleToggleFavorite = () => {
    if (!product) return
    toggleFavorite({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.imageUrl || "/placeholder.svg",
      category: product.category,
    })
  }

  const handleShare = async () => {
    if (!product) return
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
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">Loading product...</p>
          </div>
        ) : !product ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">Product not found</p>
            <Link href="/shop">
              <Button className="mt-4">Back to Shop</Button>
            </Link>
          </div>
        ) : (
          <>
            {/* Breadcrumb */}
            <nav className="mb-8">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Link href="/" className="hover:text-primary">Home</Link>
                <span>/</span>
                <Link href="/shop" className="hover:text-primary">Shop</Link>
                <span>/</span>
                <span className="text-foreground">{product.name || product.title}</span>
              </div>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
              {/* Product Images */}
              <div className="space-y-4">
                <div className="aspect-square overflow-hidden rounded-lg border">
                  <img
                    src={product.imageUrl || product.image || "/placeholder.svg"}
                    alt={product.name || product.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {/* Hide thumbnails as we don't have multiple images in current setup */}
                </div>
              </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div className="space-y-4">
              <Badge variant="outline">{product.category}</Badge>
              <h1 className="text-3xl font-bold text-foreground">{product.name || product.title}</h1>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">4.5</span>
                </div>
                <span className="text-muted-foreground">(Reviews coming soon)</span>
              </div>

              <div className="flex items-center space-x-3">
                <span className="text-3xl font-bold text-primary">${product.price.toFixed(2)}</span>
                {product.originalPrice && (
                  <>
                    <span className="text-xl text-muted-foreground line-through">${product.originalPrice.toFixed(2)}</span>
                    <Badge className="bg-primary text-primary-foreground">
                      Save ${(product.originalPrice - product.price).toFixed(2)}
                    </Badge>
                  </>
                )}
              </div>
            </div>

            <p className="text-muted-foreground leading-relaxed">{product.description}</p>

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold">Select Print Size</h3>
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                >
                  {product.sizes.map((size: any, idx: number) => (
                    <option key={idx} value={size.label || size}>
                      {size.label || size} - ${size.price?.toFixed(2) || product.price.toFixed(2)}
                      {size.stock !== undefined && size.stock > 0 ? ` (${size.stock} available)` : ''}
                    </option>
                  ))}
                </select>
              </div>
            )}

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

              {product.stock && product.stock > 0 ? (
                <p className="text-sm text-green-600 font-medium">✓ In Stock ({product.stock} available) - Ships within 2-3 business days</p>
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
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <span>High-quality materials</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <span>Fast shipping</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <span>Satisfaction guaranteed</span>
                  </li>
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
        </>
        )}
      </div>
    </div>
  )
}
