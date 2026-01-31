import { NextRequest, NextResponse } from 'next/server'
import { getShippingRates, getShippingRateByCountry } from '@/lib/supabase-helpers'

/**
 * GET /api/shipping/rates
 * Optional ?country=CA returns rate for that country (or default).
 * No query returns all rates (for admin or display).
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const country = searchParams.get('country')

    if (country) {
      const rate = await getShippingRateByCountry(country)
      const defaultPrice = 9.99
      return NextResponse.json({
        price: rate ? rate.price : defaultPrice,
        name: rate?.name ?? 'Standard',
        country_code: rate?.country_code ?? '*',
      })
    }

    const rates = await getShippingRates()
    const defaultRate = rates.find((r) => r.country_code === '*')
    const defaultPrice = defaultRate?.price ?? 9.99

    return NextResponse.json({
      rates: rates.map((r) => ({ id: r.id, name: r.name, country_code: r.country_code, price: r.price })),
      defaultPrice,
    })
  } catch (error) {
    console.error('Error fetching shipping rates:', error)
    return NextResponse.json(
      { error: 'Failed to fetch shipping rates', rates: [], defaultPrice: 9.99 },
      { status: 500 }
    )
  }
}
