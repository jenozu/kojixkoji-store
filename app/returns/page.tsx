export default function ReturnsPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-3xl space-y-8">
        <header className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold">Return Policy</h1>
          <p className="text-muted-foreground">Hassle-free returns within 14 days</p>
        </header>

        <section className="rounded-xl border p-6 space-y-4">
          <p className="text-muted-foreground">
            If you’re not in love with your purchase, you can return most items within <strong>14 days</strong> of
            delivery. Items must be unused, in original packaging, and in the same condition you received them.
          </p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-2">
            <li>Contact us first with your order number to initiate a return.</li>
            <li>Customer is responsible for return shipping unless the item arrived damaged/incorrect.</li>
            <li>Refunds are issued to the original payment method once approved.</li>
          </ul>
        </section>

        <section className="rounded-xl border p-6 space-y-2">
          <h2 className="font-semibold text-lg">Non-returnable items</h2>
          <p className="text-muted-foreground">Gift cards, final sale items, and used goods cannot be returned.</p>
        </section>

        <section className="rounded-xl border p-6 space-y-2">
          <h2 className="font-semibold text-lg">Damaged or wrong item?</h2>
          <p className="text-muted-foreground">
            Email us within 7 days of delivery with photos and your order number and we’ll make it right.
          </p>
        </section>
      </div>
    </div>
  )
}
