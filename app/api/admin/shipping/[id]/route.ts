import { NextRequest, NextResponse } from 'next/server'
import { updateShippingRate, deleteShippingRate } from '@/lib/supabase-helpers'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const updates: { name?: string; country_code?: string; price?: number } = {}
    if (body.name !== undefined) updates.name = String(body.name)
    if (body.country_code !== undefined) updates.country_code = String(body.country_code).toUpperCase().trim()
    if (body.price !== undefined) updates.price = parseFloat(body.price)
    const rate = await updateShippingRate(id, updates)
    return NextResponse.json(rate)
  } catch (error: any) {
    console.error('Error updating shipping rate:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update shipping rate' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await deleteShippingRate(id)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting shipping rate:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete shipping rate' },
      { status: 500 }
    )
  }
}
