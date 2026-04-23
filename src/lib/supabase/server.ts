import { createClient } from "@supabase/supabase-js";

/**
 * Server-side Supabase client.
 * Uses the service role key when available (bypasses RLS for server-side queries),
 * falls back to anon key for read-only public data.
 */
export function createServerClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
