// lib/firestore-helpers.ts
// Optional Firestore integration for favorites and order persistence

import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  query,
  orderBy,
  limit,
  Timestamp,
} from "firebase/firestore"
import { db } from "./firebase-client"

// ============================================
// FAVORITES
// ============================================

export type FavoriteItem = {
  id: string
  name: string
  price: number
  image?: string
  category?: string
  originalPrice?: number
  addedAt: Timestamp
}

/**
 * Save a user's favorites to Firestore
 */
export async function saveFavorites(userId: string, favorites: Omit<FavoriteItem, "addedAt">[]) {
  const favoritesRef = collection(db, `users/${userId}/favorites`)
  
  // Clear old favorites and add new ones
  const batch: Promise<void>[] = []
  
  for (const fav of favorites) {
    const docRef = doc(favoritesRef, fav.id)
    batch.push(
      setDoc(docRef, {
        ...fav,
        addedAt: Timestamp.now(),
      })
    )
  }
  
  await Promise.all(batch)
}

/**
 * Load a user's favorites from Firestore
 */
export async function loadFavorites(userId: string): Promise<FavoriteItem[]> {
  const favoritesRef = collection(db, `users/${userId}/favorites`)
  const snapshot = await getDocs(favoritesRef)
  
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as FavoriteItem[]
}

/**
 * Toggle a single favorite (add or remove)
 */
export async function toggleFavorite(
  userId: string,
  favorite: Omit<FavoriteItem, "addedAt">
): Promise<void> {
  const docRef = doc(db, `users/${userId}/favorites`, favorite.id)
  const docSnap = await getDoc(docRef)
  
  if (docSnap.exists()) {
    // Remove
    await deleteDoc(docRef)
  } else {
    // Add
    await setDoc(docRef, {
      ...favorite,
      addedAt: Timestamp.now(),
    })
  }
}

// ============================================
// ORDERS
// ============================================

export type Order = {
  orderId: string
  userId: string
  email: string
  items: {
    id: string
    name: string
    price: number
    quantity: number
    image?: string
    size?: string
  }[]
  subtotal: number
  taxes: number
  shipping: number
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  shippingAddress: {
    firstName: string
    lastName: string
    address1: string
    address2?: string
    city: string
    province: string
    postal: string
    country: string
  }
  createdAt: Timestamp
  updatedAt: Timestamp
}

/**
 * Save an order to Firestore
 */
export async function saveOrder(order: Omit<Order, "createdAt" | "updatedAt">): Promise<void> {
  const orderRef = doc(db, "orders", order.orderId)
  
  await setDoc(orderRef, {
    ...order,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  })
  
  // Also save to user's order history
  const userOrderRef = doc(db, `users/${order.userId}/orders`, order.orderId)
  await setDoc(userOrderRef, {
    orderId: order.orderId,
    total: order.total,
    status: order.status,
    createdAt: Timestamp.now(),
  })
}

/**
 * Load user's order history
 */
export async function loadUserOrders(userId: string, maxResults = 10): Promise<Order[]> {
  const ordersRef = collection(db, `users/${userId}/orders`)
  const q = query(ordersRef, orderBy("createdAt", "desc"), limit(maxResults))
  const snapshot = await getDocs(q)
  
  // Fetch full order details
  const orderPromises = snapshot.docs.map(async (docSnap) => {
    const orderId = docSnap.data().orderId
    const orderRef = doc(db, "orders", orderId)
    const orderSnap = await getDoc(orderRef)
    return orderSnap.data() as Order
  })
  
  return Promise.all(orderPromises)
}

/**
 * Get a single order by ID
 */
export async function getOrder(orderId: string): Promise<Order | null> {
  const orderRef = doc(db, "orders", orderId)
  const orderSnap = await getDoc(orderRef)
  
  if (!orderSnap.exists()) {
    return null
  }
  
  return orderSnap.data() as Order
}

// ============================================
// USAGE EXAMPLES
// ============================================

/*
// In a component with useAuth():

import { useAuth } from "@/lib/auth-context"
import { saveFavorites, loadFavorites } from "@/lib/firestore-helpers"

const { user } = useAuth()

// Save favorites when user signs in
useEffect(() => {
  if (user && favorites.length > 0) {
    saveFavorites(user.uid, favorites)
  }
}, [user, favorites])

// Load favorites when user signs in
useEffect(() => {
  if (user) {
    loadFavorites(user.uid).then(setFavorites)
  }
}, [user])

// Save order after checkout
await saveOrder({
  orderId: "ABC123",
  userId: user.uid,
  email: user.email,
  items: cartItems,
  subtotal: 100,
  taxes: 0,
  shipping: 10,
  total: 110,
  status: "pending",
  shippingAddress: { ... },
})
*/

