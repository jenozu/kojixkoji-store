"use client"

import { createContext, useContext, useEffect, useMemo, useState } from "react"

export type FavItem = {
  id: string
  name: string
  price: number
  image?: string
  category?: string
  originalPrice?: number
}

type FavoritesContextValue = {
  favorites: FavItem[]
  isFavorited: (id: string) => boolean
  toggleFavorite: (item: FavItem) => void
  clearFavorites: () => void
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null)
const STORAGE_KEY = "kojixkoji:favorites"

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<FavItem[]>([])

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setFavorites(JSON.parse(raw))
    } catch {}
  }, [])

  // Persist to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
    } catch {}
  }, [favorites])

  const isFavorited = (id: string) => favorites.some(f => f.id === id)

  const toggleFavorite = (item: FavItem) => {
    setFavorites(prev =>
      prev.some(f => f.id === item.id)
        ? prev.filter(f => f.id !== item.id)
        : [...prev, item]
    )
  }

  const clearFavorites = () => setFavorites([])

  const value = useMemo(
    () => ({ favorites, isFavorited, toggleFavorite, clearFavorites }),
    [favorites]
  )

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext)
  if (!ctx) throw new Error("useFavorites must be used within <FavoritesProvider>")
  return ctx
}
