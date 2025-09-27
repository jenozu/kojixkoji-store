"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

export default function AccountPage() {
  const [loading, setLoading] = useState(false)

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => setLoading(false), 600) // demo only
  }

  return (
    <div className="min-h-screen">
      {/* Page header */}
      <section className="kawaii-gradient py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold">Account</h1>
          <p className="text-lg text-muted-foreground">
            Sign in to view orders, favorites, and your profile.
          </p>
        </div>
      </section>

      {/* Centered auth card */}
      <div className="container mx-auto px-4 py-10">
        <div className="mx-auto w-full max-w-md">
          <Card className="border-border/50">
            <CardContent className="p-6">
              <Tabs defaultValue="signin" className="w-full">
                <TabsList className="grid grid-cols-2 w-full">
                  <TabsTrigger value="signin">Sign In</TabsTrigger>
                  <TabsTrigger value="create">Create Account</TabsTrigger>
                </TabsList>

                {/* Sign In */}
                <TabsContent value="signin" className="mt-6">
                  <form onSubmit={onSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" required placeholder="you@example.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input id="password" type="password" required />
                    </div>
                    <Button type="submit" disabled={loading} className="w-full">
                      {loading ? "Signing in…" : "Sign In"}
                    </Button>
                    <div className="text-sm text-muted-foreground text-center">
                      Forgot your password? <span className="underline">Reset</span>
                    </div>
                  </form>
                </TabsContent>

                {/* Create Account */}
                <TabsContent value="create" className="mt-6">
                  <form onSubmit={onSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" required placeholder="Your name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email-new">Email</Label>
                      <Input id="email-new" type="email" required placeholder="you@example.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password-new">Password</Label>
                      <Input id="password-new" type="password" required />
                    </div>
                    <Button type="submit" disabled={loading} className="w-full">
                      {loading ? "Creating…" : "Create Account"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
