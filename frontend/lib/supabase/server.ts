// lib/supabase/server.ts
//
// Untuk dipakai di Server Components / Server Actions (Next.js App Router).
// Beda dari client.ts karena perlu handle cookies buat session auth.

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database'
import { requireSupabaseEnv } from './env'

export async function createClient() {
    const cookieStore = await cookies()
    const { url, key } = requireSupabaseEnv()

    return createServerClient<Database>(
        url,
        key,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        )
                    } catch {
                        // Dipanggil dari Server Component tanpa middleware — aman diabaikan
                    }
                },
            },
        }
    )
}