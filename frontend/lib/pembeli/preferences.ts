// lib/pembeli/preferences.ts
//
// Baca dan simpan "Preferensi" pembeli: jenis bahan, grade, dan PPI prioritas.
//
// Registrasi (bagian 2) menitipkannya di `user_metadata` dengan kunci jenis_bahan, grade, dan ppi_prioritas —
// belum ada kolomnya di `profiles`. Halaman Akun membaca dan menulis kunci yang sama, jadi isi awalnya adalah
// pilihan saat mendaftar.

import { createClient } from '@/lib/supabase/server'

export type PreferenceValues = {
    jenisBahan: string[]
    grade: string[]
    // Id pelabuhan dari lib/wilayah.
    ppiPrioritas: string[]
}

type PreferenceMetadata = {
    jenis_bahan?: string[]
    grade?: string[]
    ppi_prioritas?: string[]
}

const list = (value: unknown) => (Array.isArray(value) ? value.map(String) : [])

export async function getPreferenceValues(): Promise<PreferenceValues> {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error('User belum login')

    const meta = (user.user_metadata ?? {}) as PreferenceMetadata
    return { jenisBahan: list(meta.jenis_bahan), grade: list(meta.grade), ppiPrioritas: list(meta.ppi_prioritas) }
}

export async function savePreferenceValues(values: PreferenceValues): Promise<void> {
    const supabase = await createClient()
    // Merge: field lain di metadata (data usaha, nama panggilan) tidak ikut terhapus.
    const metadata: PreferenceMetadata = { jenis_bahan: values.jenisBahan, grade: values.grade, ppi_prioritas: values.ppiPrioritas }
    const { error } = await supabase.auth.updateUser({ data: metadata })
    if (error) throw new Error(`Gagal simpan preferensi: ${error.message}`)
}
