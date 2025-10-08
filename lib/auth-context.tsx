// lib/auth-context.tsx
"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { onAuthStateChanged, type User } from "firebase/auth"
import { auth } from "./firebase.client"

type AuthValue = { user: User | null; loading: boolean }
const AuthCtx = createContext<AuthValue>({ user: null, loading: true })

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u ?? null)
      setLoading(false)
    })
    return () => unsub()
  }, [])

  return <AuthCtx.Provider value={{ user, loading }}>{children}</AuthCtx.Provider>
}

export function useAuth() {
  return useContext(AuthCtx)
}
