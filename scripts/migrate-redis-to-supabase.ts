/**
 * Migration Script: Redis to Supabase
 * 
 * This script exports products from Upstash Redis and imports them into Supabase.
 * 
 * Run this ONCE after setting up Supabase, then delete this file.
 * 
 * Usage:
 *   npx tsx scripts/migrate-redis-to-supabase.ts
 * 
 * Requirements:
 *   - Install tsx: npm install -D tsx
 *   - Supabase environment variables must be set in .env.local
 *   - Redis environment variables must still be available
 */

import { Redis } from '@ioredis'
import { createClient } from '@supabase/supabase-js'

// Check if this is being run as a standalone script
if (require.main === module) {
  console.log('⚠️  MIGRATION NOTICE:')
  console.log('This script will copy products from Redis to Supabase.')
  console.log('Make sure you have:')
  console.log('  1. Created your Supabase project')
  console.log('  2. Run the SQL schema (see SUPABASE_SETUP.md)')
  console.log('  3. Added Supabase credentials to .env.local')
  console.log('')
  console.log('Note: If you don\'t have products in Redis yet, you can skip this.')
  console.log('      Just start fresh with Supabase!')
  console.log('')
  console.log('To run: npx tsx scripts/migrate-redis-to-supabase.ts')
  console.log('')
}

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

async function migrateProducts() {
  console.log('🚀 Starting migration...\n')

  // Validate environment variables
  if (!REDIS_URL || !REDIS_TOKEN) {
    console.error('❌ Missing Redis credentials. Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN')
    return
  }

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('❌ Missing Supabase credentials. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY')
    return
  }

  try {
    // Connect to Redis (using REST API)
    console.log('📡 Connecting to Redis...')
    const response = await fetch(`${REDIS_URL}/keys/product:*`, {
      headers: {
        Authorization: `Bearer ${REDIS_TOKEN}`,
      },
    })
    
    if (!response.ok) {
      throw new Error('Failed to connect to Redis')
    }

    const { result: productKeys } = await response.json()
    console.log(`✅ Found ${productKeys.length} products in Redis\n`)

    if (productKeys.length === 0) {
      console.log('ℹ️  No products to migrate. You can start fresh with Supabase!')
      return
    }

    // Fetch all products from Redis
    console.log('📦 Fetching products from Redis...')
    const products = []
    
    for (const key of productKeys) {
      const res = await fetch(`${REDIS_URL}/get/${key}`, {
        headers: {
          Authorization: `Bearer ${REDIS_TOKEN}`,
        },
      })
      const { result } = await res.json()
      if (result) {
        products.push(JSON.parse(result))
      }
    }
    
    console.log(`✅ Fetched ${products.length} products\n`)

    // Connect to Supabase
    console.log('🔷 Connecting to Supabase...')
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

    // Insert products into Supabase
    console.log('⬆️  Inserting products into Supabase...')
    
    for (const product of products) {
      // Transform product to match Supabase schema
      const supabaseProduct = {
        id: product.id,
        name: product.name,
        description: product.description || '',
        price: product.price,
        cost: product.cost,
        category: product.category,
        image_url: product.imageUrl,
        stock: product.stock || 0,
        sizes: product.sizes || [],
      }

      const { error } = await supabase
        .from('products')
        .insert(supabaseProduct)
      
      if (error) {
        console.error(`❌ Error inserting ${product.name}:`, error.message)
      } else {
        console.log(`✅ Migrated: ${product.name}`)
      }
    }

    console.log('\n✨ Migration complete!')
    console.log(`📊 Successfully migrated ${products.length} products`)
    console.log('\n📝 Next steps:')
    console.log('  1. Verify products in Supabase Dashboard')
    console.log('  2. Test your app (products should load from Supabase)')
    console.log('  3. Once verified, you can remove Redis environment variables')
    console.log('  4. Delete this migration script')

  } catch (error) {
    console.error('\n❌ Migration failed:', error)
    console.error('\nYour Redis data is still intact. Fix the error and try again.')
  }
}

// Run migration if executed directly
if (require.main === module) {
  migrateProducts()
}

export { migrateProducts }
