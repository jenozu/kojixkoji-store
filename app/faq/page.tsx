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
              We typically offer S, M, L, and XL print sizes. Exact dimensions are listed on each product page.
            </p>
          </section>

          <section className="rounded-xl border p-6">
            <h2 className="font-semibold text-lg">How long will my order take to ship?</h2>
            <p className="text-muted-foreground mt-2">
              Orders ship within 2–3 business days. Delivery times depend on your location (see Shipping Info).
            </p>
          </section>

          <section className="rounded-xl border p-6">
            <h2 className="font-semibold text-lg">Do you accept returns?</h2>
            <p className="text-muted-foreground mt-2">
              Yes—unused items in original packaging within 14 days. See our Return Policy for details.
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
