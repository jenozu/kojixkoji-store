"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Eye, EyeOff } from "lucide-react"

import { auth } from "@/lib/firebase"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth"

export default function AccountPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)

  async function handleSignIn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const form = e.currentTarget
    const email = (form.elements.namedItem("email") as HTMLInputElement).value
    const password = (form.elements.namedItem("password") as HTMLInputElement).value
    try {
      await signInWithEmailAndPassword(auth, email, password)
      // TODO: route to account/dashboard if you want
    } catch (err: any) {
      setError(err?.message || "Sign-in failed")
    } finally {
      setLoading(false)
    }
  }

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const form = e.currentTarget
    const name = (form.elements.namedItem("name") as HTMLInputElement).value
    const email = (form.elements.namedItem("email-new") as HTMLInputElement).value
    const password = (form.elements.namedItem("password-new") as HTMLInputElement).value
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password)
      // set display name
      await updateProfile(cred.user, { displayName: name })
      // TODO: route to thank-you/account page
    } catch (err: any) {
      setError(err?.message || "Account creation failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      <section className="kawaii-gradient py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold">Account</h1>
          <p className="text-lg text-muted-foreground">
            Sign in to view orders, favorites, and your profile.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-10">
        <div className="mx-auto w-full max-w-md">
          <Card className="border-border/50">
            <CardContent className="p-6">
              <Tabs defaultValue="signin" className="w-full">
                <TabsList className="grid grid-cols-2 w-full">
                  <TabsTrigger value="signin">Sign In</TabsTrigger>
                  <TabsTrigger value="create">Create Account</TabsTrigger>
                </TabsList>

                {error && (
                  <div className="mt-4 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                    {error}
                  </div>
                )}

                {/* Sign In */}
                <TabsContent value="signin" className="mt-6">
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" name="email" type="email" required placeholder="you@example.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          required
                          className="pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-1 top-1/2 -translate-y-1/2"
                          onClick={() => setShowPassword((s) => !s)}
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    <Button type="submit" disabled={loading} className="w-full">
                      {loading ? "Signing in…" : "Sign In"}
                    </Button>
                  </form>
                </TabsContent>

                {/* Create Account */}
                <TabsContent value="create" className="mt-6">
                  <form onSubmit={handleCreate} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" name="name" required placeholder="Your name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email-new">Email</Label>
                      <Input id="email-new" name="email-new" type="email" required placeholder="you@example.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password-new">Password</Label>
                      <div className="relative">
                        <Input
                          id="password-new"
                          name="password-new"
                          type={showNewPassword ? "text" : "password"}
                          required
                          placeholder="Create a strong password"
                          className="pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-1 top-1/2 -translate-y-1/2"
                          onClick={() => setShowNewPassword((s) => !s)}
                          aria-label={showNewPassword ? "Hide password" : "Show password"}
                        >
                          {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
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
