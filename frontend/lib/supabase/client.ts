// lib/supabase/client.ts
//
// Setup koneksi Supabase. Frontend tinggal import `supabase` dari sini,
// tidak perlu bikin client sendiri di komponen manapun.

import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database' // opsional kalau generate types via Supabase CLI

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Client untuk dipakai di Client Components ('use client')
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)