// lib/supabase/client.ts
//
// Setup koneksi Supabase. Frontend tinggal import `supabase` dari sini,
// tidak perlu bikin client sendiri di komponen manapun.

import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database' // opsional kalau generate types via Supabase CLI
import { requireSupabaseEnv } from './env'

const { url, key } = requireSupabaseEnv()

// Client untuk dipakai di Client Components ('use client')
export const supabase = createBrowserClient<Database>(url, key)
