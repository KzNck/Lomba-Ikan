// Penilaian kesegaran lewat Edge Function `grade-catch` (supabase/functions):
// fungsi itu memanggil Freshness API dan menyimpan grade-nya sendiri. URL
// API-nya jadi secret Supabase, dan hanya fungsi itu yang boleh menulis hasil
// penilaian ke `catches` (supabase/catches-lockdown.sql).

import { createClient } from '@/lib/supabase/server'

/**
 * Nilai satu tangkapan. Tanpa `photo`, fungsi memakai foto yang tersimpan di
 * catches.photo_url; foto yang tidak disimpan (HEIC di Chrome) dikirim di sini.
 * True kalau grade-nya sudah tersimpan; false kalau gagal, dan tangkapannya
 * tetap tercatat tanpa grade ("Belum dinilai").
 */
export async function gradeCatch(catchId: string, photo?: Blob): Promise<boolean> {
    const supabase = await createClient()
    let body: FormData | { catch_id: string } = { catch_id: catchId }
    if (photo) {
        body = new FormData()
        body.set('catch_id', catchId)
        body.set('photo', photo, 'catch.jpg')
    }
    const { error } = await supabase.functions.invoke('grade-catch', { body })
    if (error) {
        console.error(`grade-catch gagal untuk ${catchId}: ${error.message}`)
        return false
    }
    return true
}
