import Link from "next/link"
import { Heart } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              KojixKoji
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Bringing kawaii dreams to life with adorable art prints and merchandise featuring your favorite anime
              characters.
            </p>
          </div>

          {/* Shop (links pass a category query that your /shop page should read) */}
          <div className="space-y-4">
            <h3 className="font-semibold">Shop</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href={{ pathname: "/shop", query: { category: "Art Prints" } }}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Art Prints
                </Link>
              </li>
              <li>
                <Link
                  href={{ pathname: "/shop", query: { category: "Apparel" } }}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Apparel
                </Link>
              </li>
              <li>
                <Link
                  href={{ pathname: "/shop", query: { category: "Accessories" } }}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Accessories
                </Link>
              </li>
              <li>
                <Link
                  href={{ pathname: "/shop", query: { category: "Home & Living" } }}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Home &amp; Living
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="font-semibold">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-muted-foreground hover:text-primary transition-colors">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-muted-foreground hover:text-primary transition-colors">
                  Returns
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-primary transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect (use <a> for external links so they don't route back home) */}
          <div className="space-y-4">
            <h3 className="font-semibold">Connect</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://instagram.com/kojixkoji" /* TODO: replace with your real handle */
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://x.com/kojixkoji" /* TODO: replace with your real handle */
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Twitter / X
                </a>
              </li>
              <li>
                <a
                  href="https://tiktok.com/@kojixkoji" /* TODO: replace with your real handle */
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  TikTok
                </a>
              </li>
              <li>
                <a
                  href="https://example.com/newsletter" /* TODO: replace with your newsletter URL or use /newsletter */
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Newsletter
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">© 2024 KojixKoji. All rights reserved.</p>
          <p className="text-sm text-muted-foreground flex items-center gap-1 mt-4 md:mt-0">
            Made with <Heart className="h-4 w-4 text-primary fill-current" /> for kawaii lovers
          </p>
        </div>
      </div>
    </footer>
  )
}
