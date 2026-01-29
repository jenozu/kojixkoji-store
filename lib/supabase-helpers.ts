// lib/supabase-helpers.ts
// Helper functions for Supabase database operations

import { supabase } from './supabase-client'

// ============================================
// PRODUCTS
// ============================================

export interface Product {
  id: string
  name: string
  description: string
  price: number
  cost?: number
  category: string
  image_url: string
  stock: number
  sizes?: Array<{
    label: string
    price: number
  }>
  created_at?: string
  updated_at?: string
}

/**
 * Get all products from Supabase
 */
export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching products:', error)
    throw error
  }
  
  return data || []
}

/**
 * Get a single product by ID
 */
export async function getProduct(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) {
    console.error('Error fetching product:', error)
    return null
  }
  
  return data
}

/**
 * Create a new product
 */
export async function createProduct(productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> {
  console.log('Creating product with data:', productData)
  
  const { data, error } = await supabase
    .from('products')
    .insert({
      ...productData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single()
  
  if (error) {
    console.error('Supabase error creating product:', {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    })
    throw new Error(`Database error: ${error.message} ${error.hint ? `(${error.hint})` : ''}`)
  }
  
  if (!data) {
    throw new Error('No data returned from product creation')
  }
  
  console.log('Product created successfully:', data.id)
  return data
}

/**
 * Update an existing product
 */
export async function updateProduct(id: string, productData: Partial<Product>): Promise<Product> {
  const { data, error } = await supabase
    .from('products')
    .update({
      ...productData,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()
  
  if (error) {
    console.error('Error updating product:', error)
    throw error
  }
  
  return data
}

/**
 * Delete a product
 */
export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)
  
  if (error) {
    console.error('Error deleting product:', error)
    throw error
  }
}

// ============================================
// ORDERS
// ============================================

export interface Order {
  id?: string
  order_id: string
  email: string
  items: Array<{
    id: string
    name: string
    price: number
    quantity: number
    image?: string
    size?: string
  }>
  subtotal: number
  taxes: number
  shipping: number
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  shipping_address: {
    firstName: string
    lastName: string
    address1: string
    address2?: string
    city: string
    province: string
    postal: string
    country?: string
  }
  payment_intent_id?: string
  payment_status?: 'pending' | 'succeeded' | 'failed' | 'refunded'
  payment_method?: string
  created_at?: string
  updated_at?: string
}

/**
 * Create a new order
 */
export async function createOrder(orderData: Omit<Order, 'id' | 'created_at' | 'updated_at'>): Promise<Order> {
  const { data, error } = await supabase
    .from('orders')
    .insert({
      ...orderData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single()
  
  if (error) {
    console.error('Error creating order:', error)
    throw error
  }
  
  return data
}

/**
 * Get all orders (for admin)
 */
export async function getOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching orders:', error)
    throw error
  }
  
  return data || []
}

/**
 * Get a single order by order_id
 */
export async function getOrder(orderId: string): Promise<Order | null> {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('order_id', orderId)
    .single()
  
  if (error) {
    console.error('Error fetching order:', error)
    return null
  }
  
  return data
}

/**
 * Update order status
 */
export async function updateOrderStatus(orderId: string, status: Order['status']): Promise<Order> {
  const { data, error } = await supabase
    .from('orders')
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq('order_id', orderId)
    .select()
    .single()
  
  if (error) {
    console.error('Error updating order status:', error)
    throw error
  }
  
  return data
}

/**
 * Get orders by email (for customer order history)
 */
export async function getOrdersByEmail(email: string): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('email', email)
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching orders by email:', error)
    throw error
  }
  
  return data || []
}
