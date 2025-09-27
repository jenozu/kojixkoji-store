"use client"

import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState, useMemo } from "react"
import { useCart } from "@/lib/cart-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Minus, Plus, Trash2, Lock } from "lucide-react"

const format = (n: number) => `CA$${n.toFixed(2)}`

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

  const handlePlaceOrder = async () => {
    // Demo behavior: clear the cart and show a simple thank-you page (optional)
    clearCart()
    // In app/checkout/page.tsx, inside handlePlaceOrder() before router.push:
sessionStorage.setItem(
  "koji-last-order",
  JSON.stringify({
    orderId: Math.random().toString(36).slice(2, 8).toUpperCase(), // demo order id
    email: contact.email,
    total: orderTotal,
  })
)
    router.push("/thank-you") // create this route later, or swap for alert:
    // alert("Order placed! (demo)\nYou can wire Stripe/PayPal later.")
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
                  <span className="text-xs text-muted-foreground">We’ll send your receipt here.</span>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="text-sm block mb-1">Email</label>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      value={contact.email}
                      onChange={(e) => setContact({ email: e.target.value })}
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
                    />
                  </div>
                  <div>
                    <label className="text-sm block mb-1">Last name</label>
                    <Input
                      value={shipping.lastName}
                      onChange={(e) => setShipping((s) => ({ ...s, lastName: e.target.value }))}
                      placeholder="Moon"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm block mb-1">Address</label>
                  <Input
                    value={shipping.address1}
                    onChange={(e) => setShipping((s) => ({ ...s, address1: e.target.value }))}
                    placeholder="123 Kawaii St"
                  />
                </div>

                <div>
                  <label className="text-sm block mb-1">Apt, suite, etc. (optional)</label>
                  <Input
                    value={shipping.address2}
                    onChange={(e) => setShipping((s) => ({ ...s, address2: e.target.value }))}
                    placeholder="Unit 5"
                  />
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm block mb-1">City</label>
                    <Input
                      value={shipping.city}
                      onChange={(e) => setShipping((s) => ({ ...s, city: e.target.value }))}
                      placeholder="Toronto"
                    />
                  </div>
                  <div>
                    <label className="text-sm block mb-1">Province/State</label>
                    <Input
                      value={shipping.province}
                      onChange={(e) => setShipping((s) => ({ ...s, province: e.target.value }))}
                      placeholder="ON"
                    />
                  </div>
                  <div>
                    <label className="text-sm block mb-1">Postal/ZIP</label>
                    <Input
                      value={shipping.postal}
                      onChange={(e) => setShipping((s) => ({ ...s, postal: e.target.value }))}
                      placeholder="M5V 2T6"
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
                    />
                  </div>
                  <div>
                    <label className="text-sm block mb-1">Order notes (optional)</label>
                    <Textarea
                      rows={3}
                      value={shipping.notes}
                      onChange={(e) => setShipping((s) => ({ ...s, notes: e.target.value }))}
                      placeholder="Delivery instructions, gift message, etc."
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment placeholder */}
            <Card className="kawaii-shadow border-0">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Payment (coming soon)
                  </h2>
                  <span className="text-xs text-muted-foreground">We don’t store your card details.</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  You can add Stripe/PayPal later. For now, this is a demo checkout that collects contact and shipping info.
                </p>
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
                        {/* Use next/image for local images; plain img also works */}
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
                            disabled={it.quantity <= 1}
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center">{it.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(it.id, it.quantity + 1)}
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            className="ml-1 text-destructive"
                            onClick={() => removeItem(it.id)}
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
                  />
                  <Button variant="outline" onClick={handleApplyPromo} disabled={!promo || applying}>
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

                <Button
                  size="lg"
                  className="w-full"
                  disabled={!canPlace || items.length === 0}
                  onClick={handlePlaceOrder}
                >
                  Place Order (Demo)
                </Button>

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
