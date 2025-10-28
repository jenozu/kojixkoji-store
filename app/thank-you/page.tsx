"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Package, Mail, ArrowRight } from "lucide-react"

type OrderData = {
  orderId: string
  email: string
  total: number
}

export default function ThankYouPage() {
  const router = useRouter()
  const [orderData, setOrderData] = useState<OrderData | null>(null)

  useEffect(() => {
    // Retrieve order data from sessionStorage
    const stored = sessionStorage.getItem("koji-last-order")
    if (stored) {
      try {
        const data = JSON.parse(stored)
        setOrderData(data)
        // Clear it so refreshing doesn't show the same order
        sessionStorage.removeItem("koji-last-order")
      } catch {
        // Invalid data, redirect to shop
        router.replace("/shop")
      }
    } else {
      // No order data, redirect to shop
      router.replace("/shop")
    }
  }, [router])

  if (!orderData) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="animate-pulse space-y-6 max-w-2xl mx-auto">
          <div className="h-8 w-64 rounded bg-muted mx-auto" />
          <div className="h-48 rounded bg-muted" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Success Icon */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-4">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Thank You!</h1>
            <p className="text-lg text-muted-foreground">
              Your order has been received and is being processed.
            </p>
          </div>

          {/* Order Details */}
          <Card className="kawaii-shadow border-0 mb-8">
            <CardContent className="p-8 space-y-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Package className="h-5 w-5 text-primary mt-0.5" />
                  <div className="flex-1">
                    <div className="font-semibold mb-1">Order Number</div>
                    <div className="text-2xl font-bold text-primary">{orderData.orderId}</div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Save this number for tracking your order
                    </p>
                  </div>
                </div>

                <div className="h-px bg-border" />

                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-primary mt-0.5" />
                  <div className="flex-1">
                    <div className="font-semibold mb-1">Confirmation Email</div>
                    <div className="text-muted-foreground">{orderData.email}</div>
                    <p className="text-sm text-muted-foreground mt-1">
                      We've sent a confirmation to this email address
                    </p>
                  </div>
                </div>

                <div className="h-px bg-border" />

                <div className="flex items-center justify-between">
                  <div className="font-semibold">Order Total</div>
                  <div className="text-2xl font-bold text-primary">
                    CA${orderData.total.toFixed(2)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* What's Next */}
          <Card className="kawaii-shadow border-0 mb-8">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-semibold">What happens next?</h2>
              <ol className="space-y-3 text-sm">
                <li className="flex gap-3">
                  <span className="font-semibold text-primary shrink-0">1.</span>
                  <span>You'll receive a confirmation email within a few minutes.</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-semibold text-primary shrink-0">2.</span>
                  <span>We'll prepare and package your order with care.</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-semibold text-primary shrink-0">3.</span>
                  <span>You'll get a shipping notification when your package is on its way.</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-semibold text-primary shrink-0">4.</span>
                  <span>Enjoy your kawaii treasures! ✨</span>
                </li>
              </ol>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/shop" className="flex-1 sm:flex-initial">
              <Button size="lg" className="w-full kawaii-hover">
                Continue Shopping
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/account/dashboard" className="flex-1 sm:flex-initial">
              <Button size="lg" variant="outline" className="w-full">
                View My Account
              </Button>
            </Link>
          </div>

          {/* Support */}
          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground mb-2">
              Need help with your order?
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/contact" className="text-sm text-primary hover:underline">
                Contact Us
              </Link>
              <Link href="/faq" className="text-sm text-primary hover:underline">
                FAQ
              </Link>
              <Link href="/shipping" className="text-sm text-primary hover:underline">
                Shipping Info
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
