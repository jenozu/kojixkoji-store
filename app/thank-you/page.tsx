"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { CheckCircle2 } from "lucide-react"

type Summary = {
  orderId?: string
  email?: string
  total?: number
}

// Optional: read lightweight summary from sessionStorage (set it right before redirecting here)
function useOrderSummary(): Summary | null {
  const [data, setData] = useState<Summary | null>(null)
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("koji-last-order")
      if (raw) setData(JSON.parse(raw))
    } catch {}
  }, [])
  return data
}

export default function ThankYouPage() {
  const summary = useOrderSummary()

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="rounded-2xl border bg-background p-8 text-center kawaii-shadow">
          <div className="mb-4 flex justify-center">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Thank you for your order! ✨</h1>
          <p className="text-muted-foreground">
            We’re getting your items ready. You’ll receive an email confirmation shortly.
          </p>

          {/* Optional order summary if provided */}
          {summary && (summary.orderId || summary.email || summary.total !== undefined) ? (
            <div className="mt-6 rounded-lg border bg-muted/40 p-4 text-left">
              <h2 className="font-semibold mb-2">Order Summary</h2>
              <ul className="space-y-1 text-sm">
                {summary.orderId && (
                  <li>
                    <span className="text-muted-foreground">Order #:</span>{" "}
                    <span className="font-medium">{summary.orderId}</span>
                  </li>
                )}
                {summary.email && (
                  <li>
                    <span className="text-muted-foreground">Email:</span>{" "}
                    <span className="font-medium">{summary.email}</span>
                  </li>
                )}
                {typeof summary.total === "number" && (
                  <li>
                    <span className="text-muted-foreground">Total:</span>{" "}
                    <span className="font-medium">CA${summary.total.toFixed(2)}</span>
                  </li>
                )}
              </ul>
            </div>
          ) : null}

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/shop"
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-5 text-primary-foreground hover:opacity-90"
            >
              Continue shopping
            </Link>
          </div>

          <p className="mt-6 text-xs text-muted-foreground">
            Questions? <Link className="underline hover:text-primary" href="/contact">Contact us</Link>.
          </p>
        </div>
      </div>
    </div>
  )
}
