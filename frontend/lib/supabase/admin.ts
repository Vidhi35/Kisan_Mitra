import { createClient as createSupabaseClient } from "@supabase/supabase-js"

/**
 * Admin Supabase client that bypasses RLS
 * Use this ONLY for server-side operations in development
 * when authentication is bypassed
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

  if (!serviceRoleKey) {
    console.warn("[v0] SUPABASE_SERVICE_ROLE_KEY not set, falling back to anon key")
    return createSupabaseClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
  }

  return createSupabaseClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
