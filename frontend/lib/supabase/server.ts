// lib/supabase/server.ts
//
// Untuk dipakai di Server Components / Server Actions (Next.js App Router).
// Beda dari client.ts karena perlu handle cookies buat session auth.

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
    const cookieStore = await cookies()

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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