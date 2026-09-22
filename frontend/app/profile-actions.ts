'use server'

import { revalidatePath } from 'next/cache'
import { isWebImage } from '@/lib/photo/prepare-upload'
import { parseCrop } from '@/lib/photo/avatar-crop'
import { createClient } from '@/lib/supabase/server'
import { removeAvatar, uploadAvatar } from '@/lib/supabase/avatar'

export type ChangePhotoResult = { status: 'saved' } | { status: 'error'; reason: 'invalid' | 'failed' }

// Batas server action (next.config.ts), untuk foto jadi dan foto aslinya berdua. Keduanya sudah diperkecil di browser,
// jadi ini hanya jaring pengaman.
const MAX_BYTES = 4 * 1024 * 1024

const isPhoto = (value: FormDataEntryValue | null): value is File =>
    value instanceof Blob && value.size > 0 && isWebImage(value)

/**
 * "Ubah foto" dan "Atur foto" di halaman Akun, untuk nelayan dan pembeli. `foto` adalah foto jadi yang sudah dipotong
 * di browser, `crop` posisinya; `sumber` (foto asli) hanya dikirim kalau user memilih foto baru — saat mengatur ulang,
 * foto asli yang lama tetap dipakai. URL-nya dicatat di `user_metadata`, lalu sesi di-refresh supaya header, sidebar,
 * dan kartu profil (yang membacanya dari token) langsung memakai foto baru.
 */
export async function changeProfilePhoto(formData: FormData): Promise<ChangePhotoResult> {
    const photo = formData.get('foto')
    const sent = formData.get('sumber')
    const source = sent === null ? null : isPhoto(sent) ? sent : undefined
    const crop = parseCrop(formData.get('crop'))
    if (!isPhoto(photo) || !crop || source === undefined) return { status: 'error', reason: 'invalid' }
    if (photo.size + (source?.size ?? 0) > MAX_BYTES) return { status: 'error', reason: 'invalid' }

    // getUser, bukan token: ini operasi tulis, jadi sesinya dicek ke Auth server.
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()
    if (!user) return { status: 'error', reason: 'failed' }

    const text = (value: unknown) => (typeof value === 'string' && value ? value : null)
    const previousUrl = text(user.user_metadata?.avatar_url)
    // Foto dari sebelum ada editor tidak punya foto asli; foto jadinya yang dipakai sebagai asli.
    const previousSource = text(user.user_metadata?.avatar_source_url) ?? previousUrl
    if (!source && !previousSource) return { status: 'error', reason: 'invalid' }

    let sourceUrl = previousSource
    try {
        const url = await uploadAvatar(user.id, photo)
        if (source) sourceUrl = await uploadAvatar(user.id, source, 'source')
        const { error } = await supabase.auth.updateUser({
            data: { avatar_url: url, avatar_source_url: sourceUrl, avatar_crop: crop },
        })
        if (error) throw new Error(`Gagal simpan foto profil: ${error.message}`)
        // updateUser tidak menerbitkan token baru; tanpa refresh foto baru baru tampil saat token berikutnya terbit.
        const { error: refreshError } = await supabase.auth.refreshSession()
        if (refreshError) throw new Error(`Gagal memperbarui sesi: ${refreshError.message}`)
    } catch (error) {
        console.error((error as Error).message)
        return { status: 'error', reason: 'failed' }
    }
    // File lama yang tidak lagi dipakai — kecuali yang masih jadi foto asli.
    for (const old of new Set([previousUrl, previousSource])) {
        if (old && old !== sourceUrl) await removeAvatar(user.id, old)
    }

    // Foto tampil di header dan sidebar semua halaman dashboard, peran mana pun.
    revalidatePath('/nelayan', 'layout')
    revalidatePath('/pembeli', 'layout')
    revalidatePath('/marketplace', 'layout')
    return { status: 'saved' }
}
