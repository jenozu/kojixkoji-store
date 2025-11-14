"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Eye, EyeOff } from "lucide-react"
import { auth } from "@/lib/firebase-client"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth"

export default function AccountPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // toggles
  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)

  // form state
  const [signinEmail, setSigninEmail] = useState("")
  const [signinPassword, setSigninPassword] = useState("")

  const [name, setName] = useState("")
  const [signupEmail, setSignupEmail] = useState("")
  const [signupPassword, setSignupPassword] = useState("")

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await signInWithEmailAndPassword(auth, signinEmail, signinPassword)
      // success -> navigate or show toast
      // e.g., window.location.href = "/"
    } catch (err: any) {
      setError(humanizeFirebaseError(err))
    } finally {
      setLoading(false)
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const cred = await createUserWithEmailAndPassword(auth, signupEmail, signupPassword)
      if (name.trim()) {
        await updateProfile(cred.user, { displayName: name.trim() })
      }
      // success -> navigate or show toast
      // e.g., window.location.href = "/"
    } catch (err: any) {
      setError(humanizeFirebaseError(err))
    } finally {
      setLoading(false)
    }
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

                {/* error banner */}
                {error && (
                  <div className="mt-4 rounded-md bg-destructive/10 text-destructive p-3 text-sm">
                    {error}
                  </div>
                )}

                {/* Sign In */}
                <TabsContent value="signin" className="mt-6">
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        placeholder="you@example.com"
                        value={signinEmail}
                        onChange={(e) => setSigninEmail(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          required
                          className="pr-10"
                          value={signinPassword}
                          onChange={(e) => setSigninPassword(e.target.value)}
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
                    <div className="text-sm text-muted-foreground text-center">
                      Forgot your password? <span className="underline">Reset</span>
                    </div>
                  </form>
                </TabsContent>

                {/* Create Account */}
                <TabsContent value="create" className="mt-6">
                  <form onSubmit={handleCreate} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        required
                        placeholder="Your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email-new">Email</Label>
                      <Input
                        id="email-new"
                        type="email"
                        required
                        placeholder="you@example.com"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password-new">Password</Label>
                      <div className="relative">
                        <Input
                          id="password-new"
                          type={showNewPassword ? "text" : "password"}
                          required
                          placeholder="Create a strong password"
                          className="pr-10"
                          value={signupPassword}
                          onChange={(e) => setSignupPassword(e.target.value)}
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

function humanizeFirebaseError(err: any) {
  const code = err?.code || ""
  switch (code) {
    case "auth/email-already-in-use":
      return "That email is already in use."
    case "auth/invalid-email":
      return "Please enter a valid email."
    case "auth/weak-password":
      return "Password is too weak."
    case "auth/user-not-found":
    case "auth/wrong-password":
      return "Invalid email or password."
    default:
      return err?.message || "Something went wrong."
  }
}
