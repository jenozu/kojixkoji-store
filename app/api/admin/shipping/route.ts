import { NextRequest, NextResponse } from 'next/server'
import { getShippingRates, createShippingRate } from '@/lib/supabase-helpers'

export async function GET() {
  try {
    const rates = await getShippingRates()
    return NextResponse.json(rates)
  } catch (error) {
    console.error('Error fetching shipping rates:', error)
    return NextResponse.json({ error: 'Failed to fetch shipping rates' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, country_code, price } = body
    if (!name || country_code === undefined || price === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: name, country_code, price' },
        { status: 400 }
      )
    }
    const rate = await createShippingRate({
      name: String(name),
      country_code: String(country_code).toUpperCase().trim() || '*',
      price: parseFloat(price),
    })
    return NextResponse.json(rate)
  } catch (error: any) {
    console.error('Error creating shipping rate:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create shipping rate' },
      { status: 500 }
    )
  }
}
