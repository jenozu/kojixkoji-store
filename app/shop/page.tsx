"use client"

import { useEffect, useMemo, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, Filter, Grid, List } from "lucide-react"

const allProducts = [
  {
    id: "1",
    name: "Kawaii Wing Gundam Poster / Hello Kitty Crossover",
    price: 33.88,
    originalPrice: 42.35,
    image: "/kawaii-gundam-hello-kitty-art-print-pastel-colors.jpg",
    category: "Art Prints",
    isNew: true,
  },
  {
    id: "2",
    name: "Kawaii Ichigo Kurosaki Print / Bleach Pastel Art",
    price: 33.88,
    originalPrice: 42.35,
    image: "/kawaii-ichigo-bleach-anime-art-print-pastel-pink-b.jpg",
    category: "Art Prints",
  },
  {
    id: "3",
    name: "Kawaii Sephiroth Art Print / Final Fantasy VII",
    price: 33.88,
    originalPrice: 42.35,
    image: "/kawaii-sephiroth-final-fantasy-art-print-pastel-ae.jpg",
    category: "Art Prints",
  },
  {
    id: "4",
    name: "Kawaii Mitsuri Kanroji Poster / Demon Slayer",
    price: 33.88,
    originalPrice: 42.35,
    image: "/kawaii-mitsuri-demon-slayer-art-print-pink-pastel.jpg",
    category: "Art Prints",
  },
  {
    id: "5",
    name: "Kawaii Hello Kitty Sweater / Pastel Pink",
    price: 45.99,
    image: "/kawaii-hello-kitty-sweater-pastel-pink-cozy.jpg",
    category: "Apparel",
    isNew: true,
  },
  {
    id: "6",
    name: "Anime Character Phone Case / Soft Pastel",
    price: 24.99,
    image: "/kawaii-anime-phone-case-pastel-colors-cute.jpg",
    category: "Accessories",
  },
  {
    id: "7",
    name: "Kawaii Cloud Blanket / Super Soft",
    price: 59.99,
    image: "/kawaii-cloud-blanket-soft-pastel-blue-pink.jpg",
    category: "Home & Living",
  },
  {
    id: "8",
    name: "Pastel Anime T-Shirt / Unisex",
    price: 29.99,
    image: "/kawaii-anime-t-shirt-pastel-colors-unisex.jpg",
    category: "Apparel",
  },
]

const categories = ["All", "Art Prints", "Apparel", "Accessories", "Home & Living"] as const
type Category = (typeof categories)[number]

const priceRanges = [
  { label: "Under $25", min: 0, max: 25 },
  { label: "$25 - $50", min: 25, max: 50 },
  { label: "$50 - $75", min: 50, max: 75 },
  { label: "Over $75", min: 75, max: 999 },
]

export default function ShopPage() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Read initial category from ?category=… if valid
  const urlCategory = (searchParams.get("category") || "") as Category
  const initialCategory: Category = categories.includes(urlCategory) ? urlCategory : "All"

  const [selectedCategory, setSelectedCategory] = useState<Category>(initialCategory)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("featured")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([])

  // Keep state in sync if URL changes (back/forward nav)
  useEffect(() => {
    const next: Category = categories.includes(urlCategory) ? urlCategory : "All"
    setSelectedCategory(next)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlCategory])

  // Helper to update both state and URL when the user clicks a category
  const setCategoryAndURL = (cat: Category) => {
    setSelectedCategory(cat)
    const params = new URLSearchParams(searchParams.toString())
    if (cat === "All") params.delete("category")
    else params.set("category", cat)
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      const matchesCategory = selectedCategory === "All" || product.category === selectedCategory
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesPrice =
        selectedPriceRanges.length === 0 ||
        selectedPriceRanges.some((range) => {
          const pr = priceRanges.find((r) => r.label === range)
          return pr && product.price >= pr.min && product.price <= pr.max
        })
      return matchesCategory && matchesSearch && matchesPrice
    })
  }, [selectedCategory, searchQuery, selectedPriceRanges])

  const sortedProducts = useMemo(() => {
    const arr = [...filteredProducts]
    switch (sortBy) {
      case "price-low":
        return arr.sort((a, b) => a.price - b.price)
      case "price-high":
        return arr.sort((a, b) => b.price - a.price)
      case "name":
        return arr.sort((a, b) => a.name.localeCompare(b.name))
      default:
        return arr
    }
  }, [filteredProducts, sortBy])

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <section className="kawaii-gradient py-12">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">Shop Collection</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              Discover our complete range of kawaii art prints, cozy apparel, and adorable accessories
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className={`lg:w-64 space-y-6 ${showFilters ? "block" : "hidden lg:block"}`}>
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setCategoryAndURL(category)}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Price Range</h3>
                <div className="space-y-3">
                  {priceRanges.map((range) => (
                    <div key={range.label} className="flex items-center space-x-2">
                      <Checkbox
                        id={range.label}
                        checked={selectedPriceRanges.includes(range.label)}
                        onCheckedChange={(checked) => {
                          if (checked) setSelectedPriceRanges([...selectedPriceRanges, range.label])
                          else setSelectedPriceRanges(selectedPriceRanges.filter((r) => r !== range.label))
                        }}
                      />
                      <label htmlFor={range.label} className="text-sm">
                        {range.label}
                      </label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Search and Controls */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex gap-2">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="name">Name: A to Z</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex border rounded-md">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="icon"
                    onClick={() => setViewMode("grid")}
                    className="rounded-r-none"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="icon"
                    onClick={() => setViewMode("list")}
                    className="rounded-l-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>

                <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="lg:hidden">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </div>
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-muted-foreground">
                Showing {sortedProducts.length} of {allProducts.length} products
              </p>
              {selectedCategory !== "All" && <Badge variant="secondary">{selectedCategory}</Badge>}
            </div>

            {/* Products Grid */}
            <div
              className={`grid gap-6 ${
                viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
              }`}
            >
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>

            {sortedProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">No products found matching your criteria.</p>
                <Button
                  variant="outline"
                  className="mt-4 bg-transparent"
                  onClick={() => {
                    setCategoryAndURL("All")
                    setSearchQuery("")
                    setSelectedPriceRanges([])
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
