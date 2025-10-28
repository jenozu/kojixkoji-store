"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Eye, EyeOff, LogOut } from "lucide-react"

import { auth } from "@/lib/firebase-client"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
} from "firebase/auth"
import { useAuth } from "@/lib/auth-context"

function humanize(code: string) {
  const map: Record<string, string> = {
    "auth/invalid-credential": "Wrong email or password.",
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/email-already-in-use": "An account already exists with this email.",
    "auth/weak-password": "Password should be at least 6 characters.",
    "auth/too-many-requests": "Too many attempts. Please try again later.",
  }
  return map[code] ?? `Firebase: ${code.replace("auth/", "")}`
}

export default function AccountPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()

  // password visibility
  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)

  // form state
  const [signinEmail, setSigninEmail] = useState("")
  const [signinPassword, setSigninPassword] = useState("")
  const [name, setName] = useState("")
  const [signupEmail, setSignupEmail] = useState("")
  const [signupPassword, setSignupPassword] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // If we're already signed in, you can either: (A) redirect away automatically, or (B) show account UI.
  // Choose ONE behavior:
  const autoRedirectWhenSignedIn = true
  const redirectTo = "/account/dashboard"

  useEffect(() => {
    if (!authLoading && user && autoRedirectWhenSignedIn) {
      router.replace(redirectTo)
    }
  }, [authLoading, user, router])

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      await signInWithEmailAndPassword(auth, signinEmail.trim(), signinPassword)
      // If not using auto redirect by auth-state effect, do it here:
      if (!autoRedirectWhenSignedIn) router.replace(redirectTo)
    } catch (err: any) {
      setError(humanize(err?.code ?? "auth/unknown-error"))
    } finally {
      setSubmitting(false)
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const cred = await createUserWithEmailAndPassword(
        auth,
        signupEmail.trim(),
        signupPassword
      )
      // set display name (optional)
      if (name.trim()) {
        await updateProfile(cred.user, { displayName: name.trim() })
      }
      if (!autoRedirectWhenSignedIn) router.replace(redirectTo)
    } catch (err: any) {
      setError(humanize(err?.code ?? "auth/unknown-error"))
    } finally {
      setSubmitting(false)
    }
  }

  const SignedInPanel = useMemo(() => {
    if (!user || autoRedirectWhenSignedIn) return null
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="mx-auto w-full max-w-md">
          <Card className="border-border/50">
            <CardContent className="p-6 space-y-4">
              <div>
                <h2 className="text-xl font-semibold">You’re signed in</h2>
                <p className="text-sm text-muted-foreground">
                  {user.displayName ? `${user.displayName} · ` : ""}{user.email}
                </p>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => router.push("/")}>Go to Home</Button>
                <Button
                  variant="outline"
                  onClick={async () => {
                    await signOut(auth)
                  }}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign out
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }, [user, router, autoRedirectWhenSignedIn])

  if (!authLoading && user && !autoRedirectWhenSignedIn) {
    return SignedInPanel
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

                {/* Error banner */}
                {error && (
                  <div className="mt-4 rounded-md bg-destructive/10 text-destructive text-sm px-3 py-2">
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

                    <Button type="submit" disabled={submitting} className="w-full">
                      {submitting ? "Signing in…" : "Sign In"}
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

                    <Button type="submit" disabled={submitting} className="w-full">
                      {submitting ? "Creating…" : "Create Account"}
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
