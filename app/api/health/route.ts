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
    storage: {
      configured: false,
      bucketExists: false,
      canUpload: false,
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

    // Check storage bucket
    try {
      checks.storage.configured = true
      
      // Try to list files in bucket (will fail if bucket doesn't exist)
      const { data, error } = await supabase.storage
        .from('product-images')
        .list('', { limit: 1 })

      if (error) {
        if (error.message.includes('not found') || error.message.includes('does not exist')) {
          checks.storage.error = 'Bucket "product-images" does not exist. Create it in Supabase Dashboard → Storage'
        } else if (error.message.includes('permission') || error.message.includes('policy')) {
          checks.storage.bucketExists = true
          checks.storage.error = 'Bucket exists but RLS policies may be blocking access'
        } else {
          checks.storage.error = error.message
        }
      } else {
        checks.storage.bucketExists = true
        checks.storage.canUpload = true // If we can list, we should be able to upload (depends on policies)
      }
    } catch (err) {
      checks.storage.error = err instanceof Error ? err.message : 'Unknown storage error'
    }
  } else {
    checks.supabase.error = 'Environment variables not set'
  }

  const allGood = checks.supabase.configured && checks.supabase.connected && checks.storage.bucketExists

  return NextResponse.json(checks, { 
    status: allGood ? 200 : 500 
  })
}
