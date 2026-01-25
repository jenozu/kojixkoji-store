"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Sparkles, Heart, Gift } from "lucide-react"

// Featured products will be fetched from API

const categories = [
  {
    name: "Art Prints",
    image: "/kawaii-anime-art-prints-collection-pastel.jpg",
    count: "25+ items",
  },
  {
    name: "Apparel",
    image: "/kawaii-anime-t-shirts-sweaters-pastel-colors.jpg",
    count: "15+ items",
  },
  {
    name: "Accessories",
    image: "/kawaii-phone-cases-anime-accessories-pastel.jpg",
    count: "20+ items",
  },
  {
    name: "Home & Living",
    image: "/kawaii-blankets-pillows-home-decor-anime-pastel.jpg",
    count: "10+ items",
  },
]

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const res = await fetch('/api/products')
        const data = await res.json()
        // Take first 4 products as featured
        setFeaturedProducts(data.slice(0, 4))
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden kawaii-gradient">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <Badge variant="secondary">New Collection Available</Badge>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold leading-tight text-balance">
                Kawaii Dreams Come{" "}
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">True</span>
              </h1>

              <p className="text-lg text-muted-foreground leading-relaxed text-pretty">
                Discover our enchanting collection of anime art prints, cozy apparel, and adorable accessories. Each
                piece is crafted with love to bring kawaii magic to your everyday life.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="kawaii-hover" asChild>
                  <Link href="/shop">
                    <Gift className="h-5 w-5 mr-2" />
                    Shop Collection
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="kawaii-hover bg-transparent" asChild>
                  <Link href="/about">Learn Our Story</Link>
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square relative overflow-hidden rounded-3xl kawaii-shadow">
                <Image
                  src="/images/hero-banner.jpg"
                  alt="Kawaii Hello Kitty characters in dreamy clouds"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Featured Collection</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-pretty">
              Handpicked favorites featuring your beloved anime characters in our signature kawaii style
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Link key={product.id} href={`/product/${product.id}`}>
                <Card className="group kawaii-hover cursor-pointer border-border/50">
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <Button
                        size="icon"
                        variant="secondary"
                        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 hover:bg-white"
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                      {product.originalPrice && (
                        <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">Sale</Badge>
                      )}
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="space-y-1">
                        <Badge variant="outline" className="text-xs">
                          {product.category}
                        </Badge>
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {product.name}
                        </h3>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{product.rating}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">({product.reviews})</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-bold text-primary">${product.price}</span>
                          {product.originalPrice && (
                            <span className="text-sm text-muted-foreground line-through">${product.originalPrice}</span>
                          )}
                        </div>
                        <span className="text-sm text-muted-foreground">View Details</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" variant="outline" className="kawaii-hover bg-transparent" asChild>
              <Link href="/shop">View All Products</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Shop by Category</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-pretty">
              From dreamy art prints to cozy apparel, find the perfect kawaii items for every part of your life
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link key={category.name} href={`/shop?category=${category.name.toLowerCase().replace(" ", "-")}`}>
                <Card className="group kawaii-hover border-border/50">
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <img
                        src={category.image || "/placeholder.svg"}
                        alt={category.name}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-6 text-center space-y-2">
                      <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-muted-foreground">{category.count}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <div className="flex items-center justify-center">
                <Star className="h-8 w-8 text-primary fill-current" />
              </div>
              <div className="text-3xl font-bold">5.0</div>
              <p className="text-muted-foreground">Average Rating</p>
              <p className="text-sm text-muted-foreground">(22 reviews)</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-center">
                <Heart className="h-8 w-8 text-primary fill-current" />
              </div>
              <div className="text-3xl font-bold">98</div>
              <p className="text-muted-foreground">Happy Customers</p>
              <p className="text-sm text-muted-foreground">Sales completed</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <div className="text-3xl font-bold">11</div>
              <p className="text-muted-foreground">Years on Etsy</p>
              <p className="text-sm text-muted-foreground">Trusted seller</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
