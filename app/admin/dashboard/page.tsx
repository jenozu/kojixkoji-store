"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import FirebaseUploaderButton from "@/components/FirebaseUploaderButton"
import { Package, Users, Upload, Image as ImageIcon } from "lucide-react"
import Link from "next/link"

// Add your admin email(s) here
const ADMIN_EMAILS = ["admin@koji.com", "your-admin-email@example.com"]

export default function AdminDashboardPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([])

  // Route protection: redirect if not signed in or not admin
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/account")
    }
    if (!loading && user && !ADMIN_EMAILS.includes(user.email || "")) {
      router.replace("/")
    }
  }, [loading, user, router])

  if (loading || !user) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="animate-pulse space-y-6 max-w-6xl">
          <div className="h-8 w-64 rounded bg-muted" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="h-48 rounded bg-muted" />
            <div className="h-48 rounded bg-muted" />
            <div className="h-48 rounded bg-muted" />
          </div>
        </div>
      </div>
    )
  }

  // Check if user is admin
  if (!ADMIN_EMAILS.includes(user.email || "")) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p className="text-muted-foreground mb-6">You don't have permission to access this page.</p>
        <Link href="/">
          <Button>Go Home</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="kawaii-gradient py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold">Admin Dashboard</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Manage products, orders, and site content.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-10">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          {/* Orders Overview */}
          <Card className="kawaii-shadow border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Orders
              </CardTitle>
              <CardDescription>Manage customer orders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">0</div>
              <p className="text-sm text-muted-foreground">
                No orders yet. Orders will appear here once customers start purchasing.
              </p>
            </CardContent>
          </Card>

          {/* Users Overview */}
          <Card className="kawaii-shadow border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Users
              </CardTitle>
              <CardDescription>Customer accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">1</div>
              <p className="text-sm text-muted-foreground">
                You are currently signed in as an admin user.
              </p>
            </CardContent>
          </Card>

          {/* Product Management */}
          <Card className="kawaii-shadow border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Products
              </CardTitle>
              <CardDescription>Manage inventory</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">8</div>
              <p className="text-sm text-muted-foreground">
                Products are currently hardcoded. Add Firestore integration for dynamic products.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Firebase Image Upload Section */}
        <Card className="kawaii-shadow border-0 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Product Image Upload
            </CardTitle>
            <CardDescription>
              Upload product images to Firebase Storage. Use these URLs in your product data.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <FirebaseUploaderButton
                onUploaded={(url) => {
                  setUploadedUrls((prev) => [...prev, url])
                  alert(`Image uploaded! URL copied to clipboard:\n${url}`)
                  navigator.clipboard.writeText(url)
                }}
              />
              <p className="text-sm text-muted-foreground">
                Supported formats: JPG, PNG, GIF, WebP
              </p>
            </div>

            {uploadedUrls.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  Recently Uploaded Images ({uploadedUrls.length})
                </h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {uploadedUrls.map((url, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="aspect-square rounded-lg overflow-hidden border">
                        <img
                          src={url}
                          alt={`Upload ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 text-xs"
                          onClick={() => {
                            navigator.clipboard.writeText(url)
                            alert("URL copied!")
                          }}
                        >
                          Copy URL
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 text-xs"
                          onClick={() => window.open(url, "_blank")}
                        >
                          Open
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="kawaii-shadow border-0">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common admin tasks</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Link href="/shop">
              <Button variant="secondary" size="sm">
                View Shop
              </Button>
            </Link>
            <Link href="/account/dashboard">
              <Button variant="secondary" size="sm">
                My Account
              </Button>
            </Link>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                alert(
                  "To add Firestore product management:\n\n1. Create a 'products' collection in Firestore\n2. Add CRUD operations in this dashboard\n3. Update shop page to fetch from Firestore\n4. See Firebase docs for examples"
                )
              }}
            >
              Add Firestore Products
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

