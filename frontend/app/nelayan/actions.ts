'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { requireProfile } from '@/lib/supabase/auth'
import { cancelListing as cancel, createCatch, publishCatch, saveFreshness } from '@/lib/supabase/catches'
import { uploadCatchPhoto } from '@/lib/supabase/storage'
import { catchTimestamp, predictFreshness } from '@/lib/freshness/client'

/**
 * Simpan tangkapan dari wizard "Tambah Tangkapan", lalu minta penilaian
 * kesegaran. Row dibuat lebih dulu supaya tangkapan tidak hilang kalau AI-nya
 * sedang tidak bisa dihubungi — grade-nya menyusul, statusnya tetap tersimpan.
 */
export async function submitCatch(formData: FormData): Promise<void> {
    const profile = await requireProfile('nelayan')

    const category = String(formData.get('category') ?? '')
    const time = String(formData.get('time') ?? '')
    const ice = String(formData.get('ice') ?? '')
    const weight = Number(formData.get('weight') ?? 0)
    const photo = formData.get('photo')

    if (!category || !time || !ice || !(weight > 0)) {
        throw new Error('Data tangkapan belum lengkap.')
    }

    const entry = await createCatch({
        species: category,
        weight_kg: weight,
        // PPI dari profil nelayan adalah titik pengambilannya.
        catch_location: profile.ppi_location ?? 'Belum diatur',
        catch_time: catchTimestamp(time),
        storage_method: ice,
        // Nama kapal belum ditanyakan di wizard; diisi setelah ada kolomnya di form.
        vessel_name: '-',
        local_id: String(formData.get('local_id') ?? '') || undefined,
    })

    if (photo instanceof Blob && photo.size > 0) {
        const photoUrl = await uploadCatchPhoto(profile.id, entry.id, photo)
        const result = await predictFreshness({
            catchId: entry.id,
            category,
            time,
            ice,
            photo,
        })

        if (result || photoUrl) {
            await saveFreshness(entry.id, {
                grade: result?.grade ?? null,
                score: result?.score ?? null,
                notes: result ? `${result.rationale} Rekomendasi: ${result.recommendation}` : null,
            })
        }
    }

    revalidatePath('/nelayan')
    redirect(`/nelayan/catat/hasil?id=${entry.id}`)
}

/** Terbitkan tangkapan yang sudah dinilai ke marketplace, dengan harga opsional dari form. */
export async function publishListing(formData: FormData): Promise<void> {
    await requireProfile('nelayan')

    const id = String(formData.get('id') ?? '')
    if (!id) throw new Error('Tangkapan tidak ditemukan.')

    // "8.000" dari field harga → 8000. Kosong berarti mengikuti harga lelang.
    const raw = String(formData.get('harga') ?? '').replace(/[^\d]/g, '')
    await publishCatch(id, raw ? Number(raw) : null)

    revalidatePath('/nelayan')
    revalidatePath('/nelayan/listing')
    redirect('/nelayan/listing')
}

/** Batalkan listing dari dialog konfirmasi di "Listing Saya". */
export async function cancelListing(formData: FormData): Promise<void> {
    await requireProfile('nelayan')

    const id = String(formData.get('id') ?? '')
    if (id) await cancel(id)

    revalidatePath('/nelayan/listing')
    redirect('/nelayan/listing')
}
