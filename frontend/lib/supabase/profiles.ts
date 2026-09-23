// lib/supabase/profiles.ts
//
// Query tabel `profiles`. Helper auth (kirim/verifikasi OTP, sesi) ada di auth.ts.

import { createClient } from './server'
import { cachedForUser, cacheTags, REVALIDATE } from './cached'
import type { Profile } from '@/types/database'

/** Ubah profil user yang sedang login. RLS membatasi ke row miliknya sendiri. */
export async function updateProfile(updates: Partial<Profile>): Promise<Profile> {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error('User belum login')

    const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single()

    if (error) throw new Error(`Gagal update profil: ${error.message}`)
    return data
}

/**
 * Nama nelayan pemilik tiap tangkapan, untuk ditampilkan di marketplace.
 * Dikembalikan sebagai Map id → nama supaya pemanggilnya tidak perlu query per baris.
 */
export type ProfileName = Pick<Profile, 'id' | 'full_name'>

export async function getProfileNames(ids: string[]): Promise<Map<string, ProfileName>> {
    if (ids.length === 0) return new Map()

    const unique = [...new Set(ids)].sort()
    // Lewat cache server; hasilnya disimpan sebagai array (cache hanya menyimpan JSON), Map-nya dibuat sesudahnya.
    const result = await cachedForUser(
        `profile-names:${unique.join(',')}`,
        // Nama berubah hanya dari halaman Akun pemiliknya, yang mengosongkan tag profilnya.
        { tags: () => unique.map(cacheTags.profile), revalidate: REVALIDATE.profile },
        async (supabase) => {
            // Hanya nama yang ditampilkan; kolom lain (telepon, rekening) tidak perlu ikut terkirim.
            const { data, error } = await supabase.from('profiles').select('id, full_name').in('id', unique)
            if (error) throw new Error(`Gagal ambil profil penjual: ${error.message}`)
            return data ?? []
        }
    )
    return new Map((result?.data ?? []).map((profile) => [profile.id, profile]))
}
