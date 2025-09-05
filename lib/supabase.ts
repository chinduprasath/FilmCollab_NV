import { createBrowserClient } from '@supabase/ssr'

// Check if environment variables are available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(`
    ⚠️  Supabase environment variables are missing!
    
    Please create a .env.local file with:
    
    NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
    NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
    
    Get these values from: https://supabase.com/dashboard/project/_/settings/api
  `)
}

export function createClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(`
      Supabase configuration is missing!
      
      Please create a .env.local file with:
      NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
      NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
      
      Get these values from: https://supabase.com/dashboard/project/_/settings/api
    `)
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

export function createServerClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(`
      Supabase configuration is missing!
      
      Please create a .env.local file with:
      NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
      NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
      
      Get these values from: https://supabase.com/dashboard/project/_/settings/api
    `)
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
