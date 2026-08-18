// Reallogic — Supabase Server Client
// Uses the service role key — NEVER exposed client-side.
// Used in API routes and server actions only.

import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

let _supabaseServer: SupabaseClient | null = null

export const supabaseServer = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    if (!_supabaseServer) {
      if (!supabaseUrl || !supabaseServiceKey) {
        return () => ({
          data: null,
          error: { message: 'Supabase server not configured' },
        })
      }
      _supabaseServer = createClient(supabaseUrl, supabaseServiceKey)
    }
    return (_supabaseServer as unknown as Record<string, unknown>)[prop as string]
  },
})
