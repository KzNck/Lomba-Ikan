// lib/supabase/profiles.ts
//
// Query tabel `profiles`. Helper auth (kirim/verifikasi OTP, sesi) ada di auth.ts.

import { createClient } from './server'
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

    const supabase = await createClient()
    // Hanya nama yang ditampilkan; kolom lain (telepon, rekening) tidak perlu ikut terkirim.
    const { data, error } = await supabase.from('profiles').select('id, full_name').in('id', [...new Set(ids)])

    if (error) throw new Error(`Gagal ambil profil penjual: ${error.message}`)
    return new Map((data ?? []).map((profile) => [profile.id, profile]))
}
