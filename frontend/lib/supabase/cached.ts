// lib/supabase/cached.ts
//
// Cache data sisi server (unstable_cache) untuk query yang dibaca di hampir
// setiap halaman dashboard. Tanpa ini, tiap render — termasuk load pertama
// setelah refresh — bertanya ke Supabase lagi; dengan ini, render yang datang
// sebelum datanya berubah cukup membaca hasil yang tersimpan di server.
//
// RLS tetap berlaku. Fungsi yang di-cache tidak boleh membaca cookie, jadi
// query-nya dijalankan dengan access token user itu sendiri (bukan service
// role), dan kunci cache-nya memuat id user dari token yang sudah diverifikasi.
// Satu user tidak pernah membaca entri milik user lain.
//
// Setelah data berubah, server action memanggil revalidateTag untuk tag yang
// terdampak (lihat expireTags), termasuk tag milik pihak lain dalam transaksi.

import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { revalidateTag, unstable_cache } from 'next/cache'
import type { Database } from '@/types/database'
import { getClaims } from './auth'
import { requireSupabaseEnv } from './env'
import { createClient } from './server'

/** Tag cache. Yang per user memuat id-nya, supaya perubahan satu akun tidak mengosongkan cache akun lain. */
export const cacheTags = {
    profile: (userId: string) => `profile:${userId}`,
    catches: (userId: string) => `catches:${userId}`,
    transactions: (userId: string) => `transactions:${userId}`,
    // Listing di marketplace dilihat semua pembeli; berubah saat nelayan mana pun memasang, mengubah, atau
    // membatalkan listing, atau saat batch dibeli.
    marketplace: 'marketplace',
}

/**
 * Berapa detik data boleh dibaca dari cache sebelum diambil ulang. Perubahan lewat aplikasi ini langsung
 * mengosongkan tag-nya; jendela ini hanya batas atas untuk perubahan dari luar (job kedaluwarsa listing, edit
 * langsung di Supabase).
 */
export const REVALIDATE = {
    // Kartu statistik dashboard, Listing Saya, Riwayat, notifikasi.
    catches: 60,
    transactions: 60,
    // Daftar listing marketplace; batas waktu klaim tetap disaring ulang setiap request.
    marketplace: 300,
    // Nama, telepon, PPI: hanya berubah dari halaman Akun, yang mengosongkan tag-nya sendiri.
    profile: 3600,
}

type Supabase = ReturnType<typeof createSupabaseClient<Database>>

/**
 * Jalankan `load` lewat cache server, atas nama user yang sedang login. `null` kalau belum login — pemanggil
 * memperlakukannya seperti hasil query tanpa sesi.
 *
 * Token-nya sengaja tidak ikut kunci cache (berganti tiap refresh sesi); kuncinya id user, yang menentukan baris
 * mana yang dikembalikan RLS.
 */
export async function cachedForUser<T>(
    name: string,
    options: { tags: (userId: string) => string[]; revalidate: number },
    load: (supabase: Supabase, userId: string) => Promise<T>
): Promise<{ data: T } | null> {
    const claims = await getClaims()
    if (!claims) return null
    const userId = claims.sub

    const {
        data: { session },
    } = await (await createClient()).auth.getSession()
    const token = session?.access_token
    if (!token) return null

    const { url, key } = requireSupabaseEnv()
    const run = unstable_cache(
        () => load(createSupabaseClient<Database>(url, key, { accessToken: async () => token }), userId),
        [name, userId],
        { tags: options.tags(userId), revalidate: options.revalidate }
    )
    return { data: await run() }
}

/**
 * Kosongkan tag cache setelah data berubah. `expire: 0`: request berikutnya menunggu data baru, bukan menerima
 * data lama sambil diperbarui di belakang — user langsung melihat hasil aksinya sendiri.
 */
export function expireTags(...tags: string[]): void {
    for (const tag of new Set(tags)) revalidateTag(tag, { expire: 0 })
}
