"use client"

import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState, useMemo, useEffect } from "react"
import { useCart } from "@/lib/cart-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Minus, Plus, Trash2, Lock, Loader2 } from "lucide-react"
import { loadStripe } from "@stripe/stripe-js"
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js"

const format = (n: number) => `CA$${n.toFixed(2)}`

// Initialize Stripe
// Added .trim() to prevent 401 errors from accidental whitespace
const stripePromise = loadStripe(
  (process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "").trim()
)

// Payment form component
function PaymentForm({
  orderTotal,
  contact,
  shipping,
  items,
  clientSecret,
  onSuccess,
  onError,
}: {
  orderTotal: number
  contact: { email: string }
  shipping: any
  items: any[]
  clientSecret: string
  onSuccess: (orderId: string) => void
  onError: (error: string) => void
}) {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isElementReady, setIsElementReady] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      setError("Payment form is not ready. Please wait a moment.")
      return
    }

    // Check if PaymentElement is mounted
    const paymentElement = elements.getElement('payment')
    if (!paymentElement) {
      setError("Payment form is not ready. Please wait a moment.")
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      // Submit the payment element for validation
      const { error: submitError } = await elements.submit()
      if (submitError) {
        throw submitError
      }

      // Generate order ID
      const orderId = `KOJI-${Date.now().toString(36).toUpperCase()}`

      // Prepare order data - split into multiple metadata fields to avoid 500 char limit
      const itemsData = items.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      }))

      // Extract payment intent ID from client secret
      const paymentIntentId = clientSecret.split("_secret_")[0]

      // Update payment intent with order metadata before confirming
      // Split data across multiple metadata fields (each max 500 chars)
      const response = await fetch("/api/payments/update-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentIntentId,
          metadata: {
            orderId,
            email: contact.email,
            items: JSON.stringify(itemsData),
            subtotal: orderTotal.toString(),
            taxes: "0",
            shipping: "0",
            total: orderTotal.toString(),
            shippingName: `${shipping.firstName} ${shipping.lastName}`,
            shippingAddress: `${shipping.address1}${shipping.address2 ? ', ' + shipping.address2 : ''}`,
            shippingCity: shipping.city,
            shippingProvince: shipping.province,
            shippingPostal: shipping.postal,
            shippingCountry: shipping.country,
            shippingNotes: shipping.notes || "",
          },
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update payment intent")
      }

      // Confirm payment
      const { error: confirmError } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/thank-you`,
          payment_method_data: {
            billing_details: {
              name: `${shipping.firstName} ${shipping.lastName}`,
              email: contact.email,
              address: {
                line1: shipping.address1,
                line2: shipping.address2 || undefined,
                city: shipping.city,
                state: shipping.province,
                postal_code: shipping.postal,
                country: shipping.country === "Canada" ? "CA" : shipping.country,
              },
            },
          },
        },
        redirect: "if_required",
      })

      if (confirmError) {
        throw confirmError
      }

      // Store order summary for thank-you page
      sessionStorage.setItem(
        "koji-last-order",
        JSON.stringify({
          orderId,
          email: contact.email,
          total: orderTotal,
        })
      )

      onSuccess(orderId)
    } catch (err: any) {
      const errorMessage = err.message || "Payment failed. Please try again."
      setError(errorMessage)
      onError(errorMessage)
      setIsProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement 
        onReady={() => {
          console.log('PaymentElement ready')
          setIsElementReady(true)
        }}
        onLoadError={(error) => {
          console.log('PaymentElement load error (non-critical):', error)
          // Even if some payment methods fail to load (like Apple Pay on HTTP),
          // card input should still work, so enable the button
          setIsElementReady(true)
        }}
        options={{
          layout: 'tabs',
        }}
      />
      {error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}
      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={!stripe || !isElementReady || isProcessing}
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Lock className="mr-2 h-4 w-4" />
            Pay CA${orderTotal.toFixed(2)}
          </>
        )}
      </Button>
    </form>
  )
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items, total, updateQuantity, removeItem, clearCart } = useCart()

  // simple demo fields
  const [contact, setContact] = useState({ email: "" })
  const [shipping, setShipping] = useState({
    firstName: "",
    lastName: "",
    address1: "",
    address2: "",
    city: "",
    province: "",
    postal: "",
    country: "Canada",
    notes: "",
  })
  const [promo, setPromo] = useState("")
  const [applying, setApplying] = useState(false)
  const [paymentError, setPaymentError] = useState<string | null>(null)
  const [showPayment, setShowPayment] = useState(false)
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [isLoadingPayment, setIsLoadingPayment] = useState(false)

  const subtotal = total
  const discount = 0 // apply real discounts here if needed
  const estTaxes = useMemo(() => Math.max(0, subtotal - discount) * 0.0, [subtotal, discount]) // placeholder 0
  const orderTotal = Math.max(0, subtotal - discount + estTaxes)

  const canPlace =
    items.length > 0 &&
    contact.email &&
    shipping.firstName &&
    shipping.lastName &&
    shipping.address1 &&
    shipping.city &&
    shipping.province &&
    shipping.postal

  const handleApplyPromo = async () => {
    setApplying(true)
    // demo: no-op
    setTimeout(() => setApplying(false), 400)
  }

  const handlePaymentSuccess = (orderId: string) => {
    clearCart()
    router.push("/thank-you")
  }

  const handleContinueToPayment = async () => {
    if (!canPlace) return

    setIsLoadingPayment(true)
    setPaymentError(null)

    try {
      // Create payment intent
      const response = await fetch("/api/payments/create-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: orderTotal,
          currency: "cad",
        }),
      })

      if (!response.ok) {
        // Parse the error message from the server
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create payment intent");
      }

      const data = await response.json()
      console.log('Payment intent created:', {
        hasClientSecret: !!data.clientSecret,
        clientSecretPrefix: data.clientSecret?.substring(0, 20) + '...'
      })
      setClientSecret(data.clientSecret)
      setShowPayment(true)
    } catch (err: any) {
      setPaymentError(err.message || "Failed to initialize payment")
    } finally {
      setIsLoadingPayment(false)
    }
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span>/</span>
            <Link href="/cart" className="hover:text-primary">Cart</Link>
            <span>/</span>
            <span className="text-foreground">Checkout</span>
          </div>
        </nav>

        <h1 className="text-3xl font-bold mb-6">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact */}
            <Card className="kawaii-shadow border-0">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Contact</h2>
                  <span className="text-xs text-muted-foreground">We'll send your receipt here.</span>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="text-sm block mb-1">Email</label>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      value={contact.email}
                      onChange={(e) => setContact({ email: e.target.value })}
                      disabled={showPayment}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipping */}
            <Card className="kawaii-shadow border-0">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Shipping address</h2>
                  <span className="text-xs text-muted-foreground">Ships from Canada</span>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm block mb-1">First name</label>
                    <Input
                      value={shipping.firstName}
                      onChange={(e) => setShipping((s) => ({ ...s, firstName: e.target.value }))}
                      placeholder="Sailor"
                      disabled={showPayment}
                    />
                  </div>
                  <div>
                    <label className="text-sm block mb-1">Last name</label>
                    <Input
                      value={shipping.lastName}
                      onChange={(e) => setShipping((s) => ({ ...s, lastName: e.target.value }))}
                      placeholder="Moon"
                      disabled={showPayment}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm block mb-1">Address</label>
                  <Input
                    value={shipping.address1}
                    onChange={(e) => setShipping((s) => ({ ...s, address1: e.target.value }))}
                    placeholder="123 Kawaii St"
                    disabled={showPayment}
                  />
                </div>

                <div>
                  <label className="text-sm block mb-1">Apt, suite, etc. (optional)</label>
                  <Input
                    value={shipping.address2}
                    onChange={(e) => setShipping((s) => ({ ...s, address2: e.target.value }))}
                    placeholder="Unit 5"
                    disabled={showPayment}
                  />
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm block mb-1">City</label>
                    <Input
                      value={shipping.city}
                      onChange={(e) => setShipping((s) => ({ ...s, city: e.target.value }))}
                      placeholder="Toronto"
                      disabled={showPayment}
                    />
                  </div>
                  <div>
                    <label className="text-sm block mb-1">Province/State</label>
                    <Input
                      value={shipping.province}
                      onChange={(e) => setShipping((s) => ({ ...s, province: e.target.value }))}
                      placeholder="ON"
                      disabled={showPayment}
                    />
                  </div>
                  <div>
                    <label className="text-sm block mb-1">Postal/ZIP</label>
                    <Input
                      value={shipping.postal}
                      onChange={(e) => setShipping((s) => ({ ...s, postal: e.target.value }))}
                      placeholder="M5V 2T6"
                      disabled={showPayment}
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm block mb-1">Country</label>
                    <Input
                      value={shipping.country}
                      onChange={(e) => setShipping((s) => ({ ...s, country: e.target.value }))}
                      placeholder="Canada"
                      disabled={showPayment}
                    />
                  </div>
                  <div>
                    <label className="text-sm block mb-1">Order notes (optional)</label>
                    <Textarea
                      rows={3}
                      value={shipping.notes}
                      onChange={(e) => setShipping((s) => ({ ...s, notes: e.target.value }))}
                      placeholder="Delivery instructions, gift message, etc."
                      disabled={showPayment}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment */}
            <Card className="kawaii-shadow border-0">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Payment
                  </h2>
                  <span className="text-xs text-muted-foreground">We don't store your card details.</span>
                </div>

                {!showPayment ? (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Secure payment powered by Stripe. Click continue to enter your payment details.
                    </p>
                    <Button
                      onClick={handleContinueToPayment}
                      disabled={!canPlace || isLoadingPayment}
                      className="w-full"
                    >
                      {isLoadingPayment ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        "Continue to Payment"
                      )}
                    </Button>
                  </div>
                ) : clientSecret ? (
                  <Elements
                    stripe={stripePromise}
                    options={{
                      clientSecret,
                      appearance: {
                        theme: "stripe",
                      },
                    }}
                  >
                    <PaymentForm
                      orderTotal={orderTotal}
                      contact={contact}
                      shipping={shipping}
                      items={items}
                      clientSecret={clientSecret}
                      onSuccess={handlePaymentSuccess}
                      onError={(error) => {
                        setPaymentError(error)
                        setShowPayment(false)
                        setClientSecret(null)
                      }}
                    />
                  </Elements>
                ) : (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    <span className="ml-2 text-sm text-muted-foreground">
                      Loading payment form...
                    </span>
                  </div>
                )}

                {paymentError && (
                  <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                    {paymentError}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right: order summary */}
          <div className="space-y-6">
            <Card className="kawaii-shadow border-0">
              <CardContent className="p-6 space-y-4">
                <h2 className="text-xl font-semibold">Order summary</h2>

                {/* items */}
                <div className="space-y-4">
                  {items.length === 0 && (
                    <div className="text-sm text-muted-foreground">
                      Your cart is empty. <Link href="/shop" className="underline hover:text-primary">Continue shopping</Link>.
                    </div>
                  )}

                  {items.map((it) => (
                    <div key={it.id + (it.size ?? "")} className="flex gap-3">
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md border">
                        <Image
                          src={it.image || "/placeholder.svg"}
                          alt={it.name}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{it.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {it.category}
                          {it.size ? ` • Size ${it.size}` : ""}
                        </div>

                        <div className="mt-2 flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(it.id, Math.max(1, it.quantity - 1))}
                            disabled={it.quantity <= 1 || showPayment}
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center">{it.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(it.id, it.quantity + 1)}
                            disabled={showPayment}
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            className="ml-1 text-destructive"
                            onClick={() => removeItem(it.id)}
                            disabled={showPayment}
                            aria-label="Remove item"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="font-medium shrink-0">{format(it.price * it.quantity)}</div>
                    </div>
                  ))}
                </div>

                {/* promo */}
                <div className="flex gap-2">
                  <Input
                    placeholder="Gift card or discount code"
                    value={promo}
                    onChange={(e) => setPromo(e.target.value)}
                    disabled={showPayment}
                  />
                  <Button variant="outline" onClick={handleApplyPromo} disabled={!promo || applying || showPayment}>
                    {applying ? "Applying..." : "Apply"}
                  </Button>
                </div>

                {/* totals */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{format(subtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-{format(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-muted-foreground">
                    <span>Shipping</span>
                    <span>Calculated at next step</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Estimated taxes</span>
                    <span>{format(estTaxes)}</span>
                  </div>
                  <div className="h-px bg-border my-2" />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>{format(orderTotal)}</span>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground text-center">
                  By placing your order, you agree to our{" "}
                  <Link href="/returns" className="underline hover:text-primary">Return Policy</Link>{" "}
                  and{" "}
                  <Link href="/shipping" className="underline hover:text-primary">Shipping Info</Link>.
                </p>
              </CardContent>
            </Card>

            <div className="text-sm text-muted-foreground">
              <Link href="/shop" className="underline hover:text-primary">
                ← Continue shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
