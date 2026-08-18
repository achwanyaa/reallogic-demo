// Reallogic — Supabase Browser Client
// Uses the public anon key — safe for client-side components

import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Helper to check if Supabase is configured
export const isSupabaseConfigured = () => {
  return supabaseUrl.length > 0 && supabaseAnonKey.length > 0
}

// Only create the client if credentials are configured
// This prevents "supabaseUrl is required" errors during build/dev without Supabase
let _supabase: SupabaseClient | null = null

export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    if (!_supabase) {
      if (!isSupabaseConfigured()) {
        // Return a dummy that won't crash — data layer falls back to mock data
        return () => ({
          data: null,
          error: { message: 'Supabase not configured' },
          select: () => ({ eq: () => ({ single: () => ({ data: null, error: { message: 'Supabase not configured' } }) }) }),
        })
      }
      _supabase = createClient(supabaseUrl, supabaseAnonKey)
    }
    return (_supabase as unknown as Record<string, unknown>)[prop as string]
  },
})
