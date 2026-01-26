import Link from "next/link"

export default function FAQPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 space-y-8">
        <header className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold">FAQ</h1>
          <p className="text-muted-foreground">Answers to common questions</p>
        </header>

        <div className="grid gap-6">
          <section className="rounded-xl border p-6">
            <h2 className="font-semibold text-lg">What sizes do your prints come in?</h2>
            <p className="text-muted-foreground mt-2">
              We offer prints in the following sizes: 5" x 7", 8" x 10", 11" x 14", 12" x 18", 16" x 20", 18" x 24", 20" x 30", 24" x 32", and 24" x 36". Exact dimensions are listed on each product page.
            </p>
          </section>

          <section className="rounded-xl border p-6">
            <h2 className="font-semibold text-lg">How long will my order take to ship?</h2>
            <p className="text-muted-foreground mt-2">
              Orders ship within 2–3 business days. Delivery times depend on your location (see{" "}
              <Link href="/shipping" className="text-primary hover:underline font-medium">
                Shipping Info
              </Link>
              ).
            </p>
          </section>

          <section className="rounded-xl border p-6">
            <h2 className="font-semibold text-lg">Do you accept returns?</h2>
            <p className="text-muted-foreground mt-2">
              Yes—unused items in original packaging within 14 days. See our{" "}
              <Link href="/returns" className="text-primary hover:underline font-medium">
                Return Policy
              </Link>{" "}
              for details.
            </p>
          </section>

          <section className="rounded-xl border p-6">
            <h2 className="font-semibold text-lg">Where are you based?</h2>
            <p className="text-muted-foreground mt-2">We ship from Canada 🇨🇦.</p>
          </section>
        </div>
      </div>
    </div>
  )
}
