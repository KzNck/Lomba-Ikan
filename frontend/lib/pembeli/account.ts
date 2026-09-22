// lib/pembeli/account.ts
//
// Baca dan simpan "Info Pribadi" pembeli.
//
// Tabel `profiles` baru punya kolom full_name, phone, bank_account, dan
// ppi_location. Data usaha (nama usaha, alamat, wilayah, jenis usaha) belum ada
// kolomnya, jadi disimpan di `user_metadata` milik auth.users — tempat yang sama
// yang dipakai registrasi. Pindahkan ke kolom sendiri kalau schema-nya nanti
// ditambah; `toAccountValues` adalah satu-satunya tempat yang perlu berubah.

import type { AccountValues } from '@/components/pembeli/akun-content'
import { createClient } from '@/lib/supabase/server'
import { getProfile, getSessionUser } from '@/lib/supabase/auth'
import type { Profile } from '@/types/database'

/** Bagian akun yang belum punya kolom di `profiles`. */
type AccountMetadata = {
    // Nama pendek untuk chrome dashboard — lihat lib/supabase/display-name.ts.
    nickname?: string
    business_name?: string
    address?: string
    provinsi?: string
    kab_kota?: string
    kecamatan?: string
    kode_pos?: string
    jenis_usaha?: string[]
}

/**
 * Isi form dari profil + metadata user. Dibaca dari token sesi dan profil yang sudah dimuat layout (keduanya sekali
 * per request), jadi membuka halaman Akun tidak menambah round trip ke Supabase.
 */
export async function getAccountValues(): Promise<AccountValues> {
    const [user, profile] = await Promise.all([getSessionUser(), getProfile()])
    if (!user) throw new Error('User belum login')

    const meta = user.metadata as AccountMetadata

    return {
        contactName: profile?.full_name ?? '',
        nickname: meta.nickname ?? '',
        businessName: meta.business_name ?? '',
        // Email milik akun auth; diubah lewat alur verifikasi email, bukan form ini.
        email: user.email ?? '',
        phone: profile?.phone ?? '',
        address: meta.address ?? '',
        provinsi: meta.provinsi ?? '',
        kabKota: meta.kab_kota ?? '',
        kecamatan: meta.kecamatan ?? '',
        kodePos: meta.kode_pos ?? '',
        jenisUsaha: meta.jenis_usaha ?? [],
    }
}

/** Simpan form: yang ada kolomnya ke `profiles`, sisanya ke `user_metadata`. */
export async function saveAccountValues(values: AccountValues): Promise<void> {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error('User belum login')

    const updates: Partial<Profile> = {
        full_name: values.contactName,
        phone: values.phone || null,
    }

    const { error: profileError } = await supabase.from('profiles').update(updates).eq('id', user.id)
    if (profileError) throw new Error(`Gagal simpan profil: ${profileError.message}`)

    const metadata: AccountMetadata = {
        nickname: values.nickname,
        business_name: values.businessName,
        address: values.address,
        provinsi: values.provinsi,
        kab_kota: values.kabKota,
        kecamatan: values.kecamatan,
        kode_pos: values.kodePos,
        jenis_usaha: values.jenisUsaha,
    }

    // Merge: field lain di metadata (mis. role dari registrasi) tidak ikut terhapus.
    const { error: metaError } = await supabase.auth.updateUser({ data: metadata })
    if (metaError) throw new Error(`Gagal simpan data usaha: ${metaError.message}`)

    // updateUser tidak menerbitkan token baru; tanpa refresh, nama panggilan di chrome dashboard (dibaca dari
    // token — lihat lib/supabase/display-name.ts) baru berubah saat token berikutnya diterbitkan.
    const { error: refreshError } = await supabase.auth.refreshSession()
    if (refreshError) throw new Error(`Gagal memperbarui sesi: ${refreshError.message}`)
}
