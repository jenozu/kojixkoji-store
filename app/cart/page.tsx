"use client"

import Image from "next/image"
import Link from "next/link"
import { useMemo } from "react"
import { useCart } from "@/lib/cart-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react"

const fmt = new Intl.NumberFormat("en-CA", {
  style: "currency",
  currency: "CAD",
  maximumFractionDigits: 2,
})

export default function CartPage() {
  const { items, total, itemCount, updateQuantity, removeItem, clearCart } = useCart()

  // (Optional) shipping/tax estimates — tweak as you like
  const shippingEstimate = itemCount > 0 ? (total >= 100 ? 0 : 9.99) : 0
  const taxesEstimate = 0 // add your rate if needed
  const grandTotal = useMemo(() => total + shippingEstimate + taxesEstimate, [total, shippingEstimate, taxesEstimate])

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="kawaii-gradient py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold">Your Cart</h1>
          <p className="text-lg text-muted-foreground">
            {itemCount ? `You have ${itemCount} item${itemCount > 1 ? "s" : ""} in your cart` : "Your cart is empty"}
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-10 grid gap-8 lg:grid-cols-3">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <ShoppingBag className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
                <p className="text-muted-foreground mb-4">Looks like your cart is empty.</p>
                <Link href="/shop">
                  <Button>Continue Shopping</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <>
              {items.map((item) => (
                <Card key={item.id} className="border-border/50">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md bg-muted">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <Link href={`/product/${item.id}`}>
                              <h3 className="font-medium leading-snug hover:text-primary transition-colors line-clamp-2">
                                {item.name}
                              </h3>
                            </Link>
                            <div className="mt-1 flex items-center gap-2">
                              {item.category && (
                                <Badge variant="secondary" className="text-xs">
                                  {item.category}
                                </Badge>
                              )}
                              {item.size && (
                                <Badge variant="outline" className="text-xs">
                                  Size: {item.size}
                                </Badge>
                              )}
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="font-semibold">{fmt.format(item.price)}</div>
                          </div>
                        </div>

                        {/* Quantity & actions */}
                        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                          <div className="inline-flex items-center rounded-md border">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="rounded-r-none"
                              onClick={() => updateQuantity(item.id, Math.max(1, (item.quantity ?? 1) - 1))}
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-4 w-4" />
                            </Button>

                            <Input
                              type="number"
                              inputMode="numeric"
                              min={1}
                              value={item.quantity ?? 1}
                              onChange={(e) =>
                                updateQuantity(item.id, Math.max(1, Number(e.target.value || 1)))
                              }
                              className="w-14 text-center border-x-0 rounded-none"
                            />

                            <Button
                              variant="ghost"
                              size="icon"
                              className="rounded-l-none"
                              onClick={() => updateQuantity(item.id, (item.quantity ?? 1) + 1)}
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>

                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <div className="flex justify-between">
                <Link href="/shop">
                  <Button variant="outline" className="bg-transparent">
                    Continue Shopping
                  </Button>
                </Link>
                <Button variant="ghost" className="text-destructive" onClick={clearCart}>
                  Clear Cart
                </Button>
              </div>
            </>
          )}
        </div>

        {/* Summary */}
        <aside className="lg:sticky lg:top-24 h-fit">
          <Card className="border-border/50">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-semibold">Order Summary</h2>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">{fmt.format(total)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium">{fmt.format(shippingEstimate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Taxes</span>
                  <span className="font-medium">{fmt.format(taxesEstimate)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between text-base font-semibold">
                  <span>Total</span>
                  <span>{fmt.format(grandTotal)}</span>
                </div>
              </div>

              <Link href="/checkout" className="block">
                <Button size="lg" disabled={!items.length} className="w-full">
                  Checkout
                </Button>
              </Link>

              <p className="text-xs text-muted-foreground">
                Shipping and taxes are estimates. Final amounts are calculated at checkout.
              </p>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  )
}
