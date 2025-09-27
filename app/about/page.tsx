import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Sparkles, Star, Users } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="kawaii-gradient py-16">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <Badge variant="secondary" className="mb-4">
              <Heart className="h-4 w-4 mr-2" />
              Our Story
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight text-balance">
              Bringing Kawaii Dreams to{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Life</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed text-pretty">
              For over 11 years, we've been creating magical kawaii art that celebrates the beauty of anime culture and
              the joy of cute, dreamy aesthetics.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">The Magic Behind KojixKoji</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  What started as a passion project in 2013 has blossomed into a beloved brand that brings kawaii magic
                  to anime fans worldwide. Our journey began with a simple dream: to create art that captures the
                  whimsical, dreamy essence of our favorite anime characters.
                </p>
                <p>
                  Every piece in our collection is carefully crafted with love, featuring soft pastel colors, dreamy
                  cloud-filled skies, and the adorable charm that makes kawaii culture so special. We believe that art
                  should bring joy, comfort, and a touch of magic to everyday life.
                </p>
                <p>
                  From our signature Hello Kitty crossovers to our unique interpretations of beloved anime characters,
                  each design tells a story of friendship, dreams, and the beauty found in cute, simple moments.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square relative overflow-hidden rounded-3xl kawaii-shadow">
                <Image
                  src="/kawaii-art-studio-workspace-with-anime-posters-pas.jpg"
                  alt="KojixKoji art studio"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">What We Believe In</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-pretty">
              Our core values guide everything we create and every interaction we have with our community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="kawaii-shadow border-0">
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Made with Love</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Every design is created with genuine passion and care, ensuring each piece brings joy and warmth to
                  your space.
                </p>
              </CardContent>
            </Card>

            <Card className="kawaii-shadow border-0">
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto">
                  <Sparkles className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="text-xl font-bold">Dreamy Quality</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We use premium materials and printing techniques to ensure your kawaii treasures maintain their
                  magical beauty for years to come.
                </p>
              </CardContent>
            </Card>

            <Card className="kawaii-shadow border-0">
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
                  <Users className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-xl font-bold">Community First</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Our amazing customers are at the heart of everything we do. Your happiness and satisfaction inspire us
                  to keep creating.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Our Journey in Numbers</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-pretty">
              Over a decade of spreading kawaii joy across the globe
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center space-y-2">
              <div className="text-4xl font-bold text-primary">11+</div>
              <p className="text-muted-foreground">Years Creating</p>
            </div>

            <div className="text-center space-y-2">
              <div className="text-4xl font-bold text-secondary">98</div>
              <p className="text-muted-foreground">Happy Customers</p>
            </div>

            <div className="text-center space-y-2">
              <div className="text-4xl font-bold text-accent">5.0</div>
              <div className="flex items-center justify-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-primary fill-current" />
                ))}
              </div>
              <p className="text-muted-foreground">Average Rating</p>
            </div>

            <div className="text-center space-y-2">
              <div className="text-4xl font-bold text-primary">25+</div>
              <p className="text-muted-foreground">Unique Designs</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 kawaii-gradient">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">Our Mission</h2>
            <p className="text-xl leading-relaxed text-pretty">
              To create a world where kawaii culture brings people together, where anime art sparks joy, and where every
              day feels a little more magical through the power of cute, dreamy design.
            </p>
            <div className="flex items-center justify-center gap-2 pt-4">
              <Heart className="h-6 w-6 text-primary fill-current" />
              <Sparkles className="h-6 w-6 text-secondary" />
              <Heart className="h-6 w-6 text-accent fill-current" />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
