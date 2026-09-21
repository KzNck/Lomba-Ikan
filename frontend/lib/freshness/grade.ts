// lib/freshness/grade.ts
//
// Penilaian kesegaran lewat Edge Function `grade-catch` (supabase/functions):
// fungsi itu mengambil foto yang tersimpan, memanggil Freshness API, dan
// menyimpan grade-nya sendiri. URL API-nya jadi secret Supabase, tidak
// bergantung pada env Vercel.

import { createClient } from '@/lib/supabase/server'

/**
 * Nilai tangkapan yang fotonya sudah tersimpan (catches.photo_url). True kalau
 * grade-nya sudah tersimpan; false kalau gagal atau fungsinya belum dideploy —
 * pemanggil lalu mencoba memanggil Freshness API langsung.
 */
export async function gradeCatch(catchId: string): Promise<boolean> {
    const supabase = await createClient()
    const { error } = await supabase.functions.invoke('grade-catch', { body: { catch_id: catchId } })
    if (error) {
        console.error(`grade-catch gagal untuk ${catchId}: ${error.message}`)
        return false
    }
    return true
}
