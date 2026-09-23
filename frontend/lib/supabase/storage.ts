// Upload foto tangkapan ke Supabase Storage.

import { isWebImage } from '@/lib/photo/prepare-upload'
import { createClient } from './server'

/** Bucket tempat foto tangkapan disimpan. Buat sekali lewat dashboard Supabase (Storage > New bucket, public). */
export const CATCH_PHOTOS_BUCKET = 'catch-photos'

/**
 * Simpan foto dan kembalikan URL publiknya.
 *
 * Mengembalikan null kalau upload gagal — termasuk saat bucket-nya belum dibuat.
 * Foto bersifat pelengkap: tangkapan tetap tercatat dan tetap bisa dinilai
 * (foto dikirim langsung ke Freshness API), jadi kegagalan di sini tidak boleh
 * menggagalkan pencatatan.
 */
export async function uploadCatchPhoto(userId: string, catchId: string, photo: Blob): Promise<string | null> {
    // Foto yang tidak bisa diubah ke JPEG di browser (HEIC di Chrome) tetap dinilai, tapi tidak disimpan sebagai foto
    // listing: kebanyakan browser tidak bisa menampilkannya, jadi listing memakai ilustrasi kategori.
    if (!isWebImage(photo)) return null

    const supabase = await createClient()
    const path = `${userId}/${catchId}.jpg`

    const { error } = await supabase.storage
        .from(CATCH_PHOTOS_BUCKET)
        .upload(path, photo, { contentType: photo.type || 'image/jpeg', upsert: true })

    if (error) {
        // Penyebab paling sering: bucket-nya belum dibuat di project ini.
        console.error(
            `Gagal upload foto tangkapan (bucket "${CATCH_PHOTOS_BUCKET}"): ${error.message}. ` +
                'Kalau pesannya "Bucket not found", jalankan supabase/storage.sql di SQL Editor.'
        )
        return null
    }

    const {
        data: { publicUrl },
    } = supabase.storage.from(CATCH_PHOTOS_BUCKET).getPublicUrl(path)
    return publicUrl
}
