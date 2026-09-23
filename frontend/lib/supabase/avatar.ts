// Foto profil, untuk nelayan dan pembeli. `profiles` tidak punya kolomnya, jadi URL-nya disimpan di `user_metadata`
// (seperti nama panggilan dan bahasa) dan dibaca dari token sesi. Filenya di bucket foto tangkapan, di folder milik
// user sendiri — policy storage yang sama (lihat supabase/storage.sql) sudah mengizinkan upload dan hapus di sana.
//
// Selain foto jadi (`avatar_url`, persegi 512px), foto aslinya (`avatar_source_url`) dan posisinya di lingkaran
// (`avatar_crop`) ikut disimpan, supaya "Atur foto" bisa menggeser ulang tanpa kehilangan tepi yang sudah terpotong.

import { parseCrop, type AvatarCrop } from '@/lib/photo/avatar-crop'
import { CATCH_PHOTOS_BUCKET } from './storage'
import { getClaims } from './auth'
import { createClient } from './server'

export type CurrentAvatar = {
    url: string
    // Foto asli untuk diatur ulang. Foto yang diunggah sebelum ada editor tidak punya; foto jadinya dipakai.
    sourceUrl: string
    crop: AvatarCrop | null
}

const text = (value: unknown) => (typeof value === 'string' && value ? value : null)

/** Foto profil user yang login, dari token sesi; null kalau belum ada. */
export async function currentAvatar(): Promise<CurrentAvatar | null> {
    const claims = await getClaims()
    const metadata = (claims?.user_metadata ?? {}) as Record<string, unknown>
    const url = text(metadata.avatar_url)
    if (!url) return null
    const source = text(metadata.avatar_source_url)
    // Tanpa foto asli, posisi lama tidak berlaku: foto jadinya sudah terpotong, jadi mulai lagi dari tengah.
    return { url, sourceUrl: source ?? url, crop: source ? parseCrop(metadata.avatar_crop) : null }
}

/** URL foto profil user yang login; null kalau belum ada. */
export async function currentAvatarUrl(): Promise<string | null> {
    return (await currentAvatar())?.url ?? null
}

/**
 * Simpan foto profil baru dan kembalikan URL publiknya. Setiap upload dapat nama file baru — next/image hanya menerima
 * URL bucket tanpa query string (next.config.ts), jadi `?v=` tidak bisa dipakai untuk menembus cache browser.
 */
export async function uploadAvatar(userId: string, photo: Blob, kind: 'avatar' | 'source' = 'avatar'): Promise<string> {
    const supabase = await createClient()
    const path = `${userId}/avatar-${kind === 'source' ? 'source-' : ''}${Date.now()}.jpg`
    const { error } = await supabase.storage
        .from(CATCH_PHOTOS_BUCKET)
        .upload(path, photo, { contentType: photo.type || 'image/jpeg', upsert: false })
    if (error) throw new Error(`Gagal upload foto profil: ${error.message}`)
    return supabase.storage.from(CATCH_PHOTOS_BUCKET).getPublicUrl(path).data.publicUrl
}

/** Hapus foto profil lama (foto jadi maupun aslinya). Upaya terbaik: foto baru sudah tersimpan, jadi kegagalan di sini hanya meninggalkan file. */
export async function removeAvatar(userId: string, url: string | null): Promise<void> {
    const marker = `/object/public/${CATCH_PHOTOS_BUCKET}/`
    const path = url?.split(marker)[1]
    // Hanya file foto profil di folder user sendiri; jangan sampai menghapus foto tangkapan.
    if (!path || !path.startsWith(`${userId}/avatar-`)) return
    const supabase = await createClient()
    const { error } = await supabase.storage.from(CATCH_PHOTOS_BUCKET).remove([path])
    if (error) console.error(`Gagal hapus foto profil lama: ${error.message}`)
}
