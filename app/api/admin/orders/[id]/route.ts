import { NextRequest, NextResponse } from "next/server"
import { updateOrderStatus } from "@/lib/supabase-helpers"

/**
 * PATCH /api/admin/orders/[id] - Update order status
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { status } = body

    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      )
    }

    // Validate status
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      )
    }

    const updatedOrder = await updateOrderStatus(params.id, status)

    // Transform to match expected format
    const transformedOrder = {
      id: updatedOrder.id,
      orderId: updatedOrder.order_id,
      email: updatedOrder.email,
      items: updatedOrder.items,
      subtotal: updatedOrder.subtotal,
      taxes: updatedOrder.taxes,
      shipping: updatedOrder.shipping,
      total: updatedOrder.total,
      status: updatedOrder.status,
      shippingAddress: updatedOrder.shipping_address,
      createdAt: updatedOrder.created_at,
      updatedAt: updatedOrder.updated_at,
    }

    return NextResponse.json(transformedOrder)
  } catch (error) {
    console.error("Error updating order:", error)
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    )
  }
}
