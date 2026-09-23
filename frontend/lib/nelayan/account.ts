// Baca dan simpan "Info Pribadi" nelayan.
//
// Nama, telepon, rekening, dan PPI punya kolom di `profiles`. Kolom
// `ppi_location` menyimpan *nama* PPI — itu yang dipakai listing dan
// marketplace — jadi pilihan persisnya (id pelabuhan, provinsi, kab/kota)
// disimpan di `user_metadata` supaya form bisa dibuka lagi di pilihan yang sama.
// Nama panggilan juga di sana, karena belum ada kolomnya.

import type { AccountValues } from '@/components/nelayan/akun-content'
import { createClient } from '@/lib/supabase/server'
import { getProfile, getSessionUser } from '@/lib/supabase/auth'
import { getPelabuhanById, searchPelabuhan } from '@/lib/wilayah'
import type { Profile } from '@/types/database'

/** Pilihan lokasi yang tidak muat di kolom `ppi_location`. */
type AccountMetadata = {
    // Nama pendek untuk chrome dashboard — lihat lib/supabase/display-name.ts.
    nickname?: string
    ppi_id?: string
    // Pelabuhan di perbatasan terdaftar di lebih dari satu kab/kota; ini yang dipilih nelayannya.
    ppi_kab_kota?: string
}

/** Provinsi dan kab/kota diturunkan dari pelabuhannya: "35.10" → provinsi "35". */
function locationOf(ppiId: string, chosenKabKota?: string): Pick<AccountValues, 'provinsi' | 'kabKota' | 'ppi'> {
    const pelabuhan = getPelabuhanById(ppiId)
    if (!pelabuhan) return { provinsi: '', kabKota: '', ppi: '' }
    const kabKota = chosenKabKota && pelabuhan.kabKota.includes(chosenKabKota) ? chosenKabKota : pelabuhan.kabKota[0]
    return { provinsi: kabKota.split('.')[0], kabKota, ppi: pelabuhan.id }
}

/**
 * Isi form dari profil + metadata user. Dibaca dari token sesi dan profil yang sudah dimuat layout (keduanya sekali
 * per request), jadi membuka halaman Akun tidak menambah round trip ke Supabase.
 */
export async function getAccountValues(): Promise<AccountValues> {
    const [user, profile] = await Promise.all([getSessionUser(), getProfile()])
    if (!user) throw new Error('User belum login')

    const meta = user.metadata as AccountMetadata

    // Registrasi hanya menyimpan nama PPI; cari pelabuhannya lewat nama kalau id-nya belum pernah disimpan.
    const ppiName = profile?.ppi_location ?? ''
    const ppiId = meta.ppi_id ?? searchPelabuhan(ppiName).find(({ nama }) => nama === ppiName)?.id ?? ''

    return {
        fullName: profile?.full_name ?? '',
        nickname: meta.nickname ?? '',
        // Email milik akun auth; diubah lewat alur verifikasi email, bukan form ini.
        email: user.email ?? '',
        phone: profile?.phone ?? '',
        ...locationOf(ppiId, meta.ppi_kab_kota),
        bankAccount: profile?.bank_account ?? '',
    }
}

/** Simpan form: yang ada kolomnya ke `profiles`, id pelabuhannya ke `user_metadata`. */
export async function saveAccountValues(values: AccountValues): Promise<void> {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error('User belum login')

    const updates: Partial<Profile> = {
        full_name: values.fullName,
        phone: values.phone || null,
        bank_account: values.bankAccount || null,
        ppi_location: getPelabuhanById(values.ppi)?.nama ?? null,
    }

    const { error: profileError } = await supabase.from('profiles').update(updates).eq('id', user.id)
    if (profileError) throw new Error(`Gagal simpan profil: ${profileError.message}`)

    // Merge: field lain di metadata (mis. role dari registrasi) tidak ikut terhapus.
    const metadata: AccountMetadata = { nickname: values.nickname, ppi_id: values.ppi, ppi_kab_kota: values.kabKota }
    const { error: metaError } = await supabase.auth.updateUser({ data: metadata })
    if (metaError) throw new Error(`Gagal simpan lokasi: ${metaError.message}`)

    // updateUser tidak menerbitkan token baru; tanpa refresh, nama panggilan di chrome dashboard (dibaca dari
    // token — lihat lib/supabase/display-name.ts) baru berubah saat token berikutnya diterbitkan.
    const { error: refreshError } = await supabase.auth.refreshSession()
    if (refreshError) throw new Error(`Gagal memperbarui sesi: ${refreshError.message}`)
}
