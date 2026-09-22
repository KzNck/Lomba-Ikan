'use server'

import { revalidatePath } from 'next/cache'
import { isWebImage } from '@/lib/photo/prepare-upload'
import { createClient } from '@/lib/supabase/server'
import { removeAvatar, uploadAvatar } from '@/lib/supabase/avatar'

export type ChangePhotoResult = { status: 'saved' } | { status: 'error'; reason: 'invalid' | 'failed' }

// Batas server action (next.config.ts). Foto sudah diperkecil di browser, jadi ini hanya jaring pengaman.
const MAX_BYTES = 4 * 1024 * 1024

/**
 * "Ubah foto" di halaman Akun, untuk nelayan dan pembeli: simpan foto, catat URL-nya di `user_metadata`, lalu
 * refresh sesi supaya header, sidebar, dan kartu profil (yang membacanya dari token) langsung memakai foto baru.
 */
export async function changeProfilePhoto(formData: FormData): Promise<ChangePhotoResult> {
    const photo = formData.get('foto')
    if (!(photo instanceof Blob) || photo.size === 0 || photo.size > MAX_BYTES || !isWebImage(photo)) {
        return { status: 'error', reason: 'invalid' }
    }

    // getUser, bukan token: ini operasi tulis, jadi sesinya dicek ke Auth server.
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()
    if (!user) return { status: 'error', reason: 'failed' }

    const previous = typeof user.user_metadata?.avatar_url === 'string' ? user.user_metadata.avatar_url : null
    try {
        const url = await uploadAvatar(user.id, photo)
        const { error } = await supabase.auth.updateUser({ data: { avatar_url: url } })
        if (error) throw new Error(`Gagal simpan foto profil: ${error.message}`)
        // updateUser tidak menerbitkan token baru; tanpa refresh foto baru baru tampil saat token berikutnya terbit.
        const { error: refreshError } = await supabase.auth.refreshSession()
        if (refreshError) throw new Error(`Gagal memperbarui sesi: ${refreshError.message}`)
    } catch (error) {
        console.error((error as Error).message)
        return { status: 'error', reason: 'failed' }
    }
    await removeAvatar(user.id, previous)

    // Foto tampil di header dan sidebar semua halaman dashboard, peran mana pun.
    revalidatePath('/nelayan', 'layout')
    revalidatePath('/pembeli', 'layout')
    revalidatePath('/marketplace', 'layout')
    return { status: 'saved' }
}
