import { NextRequest, NextResponse } from "next/server"
import { getOrders } from "@/lib/supabase-helpers"

/**
 * GET /api/admin/orders - Fetch all orders for admin dashboard from Supabase
 */
export async function GET(request: NextRequest) {
  try {
    // Check admin auth (simple check via header or session)
    // For now, we'll allow it - in production, add proper auth check
    
    const orders = await getOrders()
    
    // Transform to match expected format (Supabase uses created_at, frontend expects createdAt)
    const transformedOrders = orders.map(order => ({
      id: order.id,
      orderId: order.order_id,
      email: order.email,
      items: order.items,
      subtotal: order.subtotal,
      taxes: order.taxes,
      shipping: order.shipping,
      total: order.total,
      status: order.status,
      shippingAddress: order.shipping_address,
      createdAt: order.created_at,
      updatedAt: order.updated_at,
    }))
    
    return NextResponse.json(transformedOrders)
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    )
  }
}
