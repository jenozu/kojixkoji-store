"use client"

import { useState } from "react"

export default function ContactPage() {
  const [sent, setSent] = useState(false)

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-2xl space-y-8">
        <header className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold">Contact Us</h1>
          <p className="text-muted-foreground">We usually reply within 1–2 business days</p>
        </header>

        {!sent ? (
          <form
            className="rounded-xl border p-6 grid gap-4"
            onSubmit={(e) => {
              e.preventDefault()
              setSent(true) // demo success; wire an API later
            }}
          >
            <div>
              <label className="text-sm block mb-1">Your email</label>
              <input className="w-full rounded-md border px-3 py-2" type="email" required placeholder="you@example.com" />
            </div>
            <div>
              <label className="text-sm block mb-1">Subject</label>
              <input className="w-full rounded-md border px-3 py-2" required placeholder="How can we help?" />
            </div>
            <div>
              <label className="text-sm block mb-1">Message</label>
              <textarea className="w-full rounded-md border px-3 py-2" rows={5} required placeholder="Write your message..." />
            </div>
            <button className="rounded-md bg-primary text-primary-foreground px-4 py-2 hover:opacity-90" type="submit">
              Send message
            </button>
          </form>
        ) : (
          <div className="rounded-xl border p-6 text-center space-y-2">
            <h2 className="text-xl font-semibold">Thanks! 💌</h2>
            <p className="text-muted-foreground">Your message was sent. We’ll get back to you soon.</p>
          </div>
        )}

        <div className="rounded-xl border p-6">
          <h2 className="font-semibold text-lg">Email</h2>
          <p className="text-muted-foreground">support@example.com</p>
        </div>
      </div>
    </div>
  )
}
