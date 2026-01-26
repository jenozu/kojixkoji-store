import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-client'

/**
 * GET /api/health - Check API and Supabase connectivity
 */
export async function GET() {
  const checks = {
    api: 'OK',
    supabase: {
      configured: false,
      connected: false,
      error: null as string | null,
    },
    env: {
      url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      key: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    }
  }

  // Check if Supabase is configured
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    checks.supabase.configured = true

    // Try to query products table
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id')
        .limit(1)

      if (error) {
        checks.supabase.error = `${error.message} (${error.code})`
      } else {
        checks.supabase.connected = true
      }
    } catch (err) {
      checks.supabase.error = err instanceof Error ? err.message : 'Unknown error'
    }
  } else {
    checks.supabase.error = 'Environment variables not set'
  }

  const allGood = checks.supabase.configured && checks.supabase.connected

  return NextResponse.json(checks, { 
    status: allGood ? 200 : 500 
  })
}
