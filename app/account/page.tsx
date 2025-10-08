"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Eye, EyeOff } from "lucide-react"
import { useAuth } from "@/lib/auth-context" // ✅ make sure this exists

export default function AccountPage() {
  const router = useRouter()
  const { user, signIn, signUp } = useAuth() // from auth-context
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // password visibility
  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)

  // fields
  const [signInEmail, setSignInEmail] = useState("")
  const [signInPassword, setSignInPassword] = useState("")
  const [name, setName] = useState("")
  const [signUpEmail, setSignUpEmail] = useState("")
  const [signUpPassword, setSignUpPassword] = useState("")

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await signIn(signInEmail.trim(), signInPassword)
      router.push("/") // success route (change if you prefer /account)
    } catch (err: any) {
      setError(err?.message || "Sign in failed")
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await signUp(signUpEmail.trim(), signUpPassword, { displayName: name.trim() })
      router.push("/") // success route
    } catch (err: any) {
      setError(err?.message || "Account creation failed")
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
            {user ? "You're signed in." : "Sign in to view orders, favorites, and your profile."}
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

                {/* Shared error */}
                {error && (
                  <div className="mt-4 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
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
                        value={signInEmail}
                        onChange={(e) => setSignInEmail(e.target.value)}
                        autoComplete="email"
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
                          value={signInPassword}
                          onChange={(e) => setSignInPassword(e.target.value)}
                          autoComplete="current-password"
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
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        required
                        placeholder="Your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        autoComplete="name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email-new">Email</Label>
                      <Input
                        id="email-new"
                        type="email"
                        required
                        placeholder="you@example.com"
                        value={signUpEmail}
                        onChange={(e) => setSignUpEmail(e.target.value)}
                        autoComplete="email"
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
                          value={signUpPassword}
                          onChange={(e) => setSignUpPassword(e.target.value)}
                          autoComplete="new-password"
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
