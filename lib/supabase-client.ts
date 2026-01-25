// lib/supabase-client.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Validate Supabase environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  const errorMessage = `
╔════════════════════════════════════════════════════════════════╗
║                  ❌ SUPABASE CONFIGURATION ERROR               ║
╚════════════════════════════════════════════════════════════════╝

Missing Supabase environment variables:
${!supabaseUrl ? '  • NEXT_PUBLIC_SUPABASE_URL' : ''}
${!supabaseAnonKey ? '  • NEXT_PUBLIC_SUPABASE_ANON_KEY' : ''}

🔧 TO FIX THIS:

1. Copy .env.local.example to .env.local
2. Go to https://supabase.com/dashboard
3. Select your project → Settings → API
4. Copy your Project URL and anon/public key
5. Add them to .env.local
6. Restart your development server

📚 See SUPABASE_SETUP.md for detailed instructions
  `
  console.error(errorMessage)
  
  // In development, throw an error to make it very obvious
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    throw new Error('Supabase is not configured. Please add environment variables to .env.local')
  }
}

// Debug: Log config status (only in development)
if (process.env.NODE_ENV === 'development') {
  console.log('🔷 Supabase Config Status:', {
    url: supabaseUrl ? '✅ Set' : '❌ Missing',
    anonKey: supabaseAnonKey ? '✅ Set' : '❌ Missing',
  })
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // We're using simple password auth for admin
  },
})

export default supabase
