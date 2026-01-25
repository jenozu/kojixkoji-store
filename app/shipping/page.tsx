export default function ShippingInfoPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-3xl space-y-8">
        <header className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold">Shipping Info</h1>
          <p className="text-muted-foreground">Processing times & delivery estimates</p>
        </header>

        <section className="rounded-xl border p-6 space-y-3">
          <h2 className="font-semibold text-lg">Processing</h2>
          <p className="text-muted-foreground">
            Orders ship in <strong>2-4 business days</strong>. You’ll receive a tracking link when your
            order ships.
          </p>
        </section>

        <section className="rounded-xl border p-6 space-y-3">
          <h2 className="font-semibold text-lg">Estimated delivery</h2>
          <ul className="list-disc pl-6 text-muted-foreground space-y-2">
            <li>Canada: 4–7 business days</li>
            <li>USA: 2–5 business days</li>
            <li>International: 3–10 business days</li>
          </ul>
          <p className="text-xs text-muted-foreground">Estimates exclude customs processing and carrier delays.</p>
        </section>
      </div>
    </div>
  )
}
