// Satu tempat untuk baca kredensial Supabase, dipakai browser client, server
// client, dan proxy. Next.js hanya mengganti `process.env.X` secara literal di
// bundle browser, jadi setiap nama variabel harus ditulis utuh — bukan lewat
// variabel perantara.

// Publishable key (`sb_publishable_…`) adalah format baru Supabase; anon JWT
// tetap didukung supaya project lama tidak perlu ikut diubah.
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
export const SUPABASE_KEY = PUBLISHABLE_KEY || ANON_KEY

/** Kredensial lengkap — dipakai proxy untuk melewati refresh sesi saat env belum diisi. */
export const hasSupabaseEnv = Boolean(SUPABASE_URL && SUPABASE_KEY)

/**
 * Kredensial yang dijamin ada. Dipanggil saat membuat client: kalau `.env.local`
 * belum diisi, error-nya menyebut nama variabelnya alih-alih gagal di dalam
 * supabase-js dengan pesan yang tidak jelas.
 */
export function requireSupabaseEnv(): { url: string; key: string } {
    if (!SUPABASE_URL || !SUPABASE_KEY) {
        const missing = [
            !SUPABASE_URL && 'NEXT_PUBLIC_SUPABASE_URL',
            !SUPABASE_KEY && 'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY',
        ].filter(Boolean)
        throw new Error(
            `Kredensial Supabase belum lengkap: ${missing.join(', ')}. ` +
                'Salin .env.example ke .env.local lalu isi dari Supabase dashboard (Settings > API Keys).'
        )
    }
    return { url: SUPABASE_URL, key: SUPABASE_KEY }
}
