// lib/supabase/display-name.ts
//
// Nama pendek yang tampil di chrome dashboard: sapaan, pill akun di header, dan
// kartu akun di sidebar. Nama lengkap tetap dipakai di tempat yang butuh
// identitas (halaman Akun, transaksi, listing yang dilihat pembeli).
//
// Urutannya: nama panggilan yang diisi sendiri di halaman Akun, lalu nama usaha
// (pembeli — sama seperti sebelum ada nama panggilan), lalu nama depan.
// Nama panggilan disimpan di `user_metadata.nickname`; belum ada kolomnya.

import { cache } from 'react'
import { createClient } from './server'
import type { Profile } from '@/types/database'

type NameMetadata = {
    nickname?: string
    business_name?: string
}

/** "Nathanael Rico Setiawan" → "Nathanael". */
export function firstName(fullName: string): string {
    return fullName.trim().split(/\s+/)[0] ?? ''
}

export function displayNameOf(profile: Pick<Profile, 'full_name' | 'role'>, metadata: unknown): string {
    const meta = (metadata ?? {}) as NameMetadata
    const nickname = meta.nickname?.trim()
    if (nickname) return nickname
    if (profile.role === 'pembeli' && meta.business_name) return meta.business_name
    return firstName(profile.full_name) || profile.full_name
}

// Satu kali per request: layout dan halamannya sama-sama butuh nama ini.
const getMetadata = cache(async (): Promise<unknown> => {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()
    return user?.user_metadata
})

/** Nama pendek untuk profil yang sedang login. */
export async function displayNameFor(profile: Pick<Profile, 'full_name' | 'role'>): Promise<string> {
    return displayNameOf(profile, await getMetadata())
}
