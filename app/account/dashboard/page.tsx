"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { signOut } from "firebase/auth"
import { auth } from "@/lib/firebase-client"
import { useAuth } from "@/lib/auth-context"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Heart, Package, Settings, User } from "lucide-react"

export default function AccountDashboardPage() {
  const router = useRouter()
  const { user, loading } = useAuth()

  // If not signed in, send back to /account (sign-in)
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/account")
    }
  }, [loading, user, router])

  if (loading || !user) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="animate-pulse space-y-6 max-w-4xl">
          <div className="h-8 w-64 rounded bg-muted" />
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="h-40 rounded bg-muted" />
            <div className="h-40 rounded bg-muted" />
          </div>
        </div>
      </div>
    )
  }

  const displayName = user.displayName || user.email?.split("@")[0] || "Friend"

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="kawaii-gradient py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold">Welcome, {displayName} ✨</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Manage your profile, orders, and favorites from your dashboard.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-10 grid gap-6 lg:grid-cols-3">
        {/* Profile card */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile
            </CardTitle>
            <CardDescription>Your account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="text-sm text-muted-foreground">Email</div>
              <div className="font-medium">{user.email}</div>
            </div>
            {user.emailVerified ? (
              <div className="text-sm text-green-600">Email verified</div>
            ) : (
              <div className="text-sm text-amber-600">Email not verified</div>
            )}
            <div className="flex gap-2 pt-2">
              <Link href="/account">
                <Button variant="outline" size="sm">
                  Edit Profile
                </Button>
              </Link>
              <Button
                variant="destructive"
                size="sm"
                onClick={async () => {
                  await signOut(auth)
                  router.replace("/account")
                }}
              >
                Sign out
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick actions */}
        <div className="lg:col-span-2 grid gap-6 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Orders
              </CardTitle>
              <CardDescription>See your recent orders and their status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">No orders yet.</p>
              <div className="flex gap-2">
                <Link href="/shop">
                  <Button size="sm">Start Shopping</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Favorites
              </CardTitle>
              <CardDescription>Your saved items</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                View or manage products you’ve hearted.
              </p>
              <div className="flex gap-2">
                <Link href="/favorites">
                  <Button size="sm" variant="outline">
                    View Favorites
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="sm:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Settings & Help
              </CardTitle>
              <CardDescription>Shipping, returns, and support</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <Link href="/shipping">
                <Button variant="secondary" size="sm">Shipping Info</Button>
              </Link>
              <Link href="/returns">
                <Button variant="secondary" size="sm">Return Policy</Button>
              </Link>
              <Link href="/faq">
                <Button variant="secondary" size="sm">FAQ</Button>
              </Link>
              <Link href="/contact">
                <Button variant="secondary" size="sm">Contact Us</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
