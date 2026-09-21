'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { requireProfile } from '@/lib/supabase/auth'
import { cancelListing as cancel, createCatch, publishCatch, saveFreshness, setCatchPhoto, updateListing } from '@/lib/supabase/catches'
import { EDIT_LISTING, LISTING_PATH } from '@/components/nelayan/listing-content'
import { uploadCatchPhoto } from '@/lib/supabase/storage'
import { catchTimestamp, toModelInputs } from '@/lib/catches/model-inputs'
import { predictFreshness } from '@/lib/freshness/client'
import { getKabupatenKota, getPelabuhan, PROVINSI } from '@/lib/wilayah'
import { INFO_PRIBADI, VALIDATION, type AccountValues } from '@/components/nelayan/akun-content'
import { saveAccountValues } from '@/lib/nelayan/account'

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
    const condition = String(formData.get('kondisi') ?? '')
    const weight = Number(formData.get('weight') ?? 0)
    const photo = formData.get('photo')

    if (!category || !time || !ice || !condition || !(weight > 0)) {
        throw new Error('Data tangkapan belum lengkap.')
    }

    // Jawaban wizard diterjemahkan sekali ke kosakata model; hasilnya ikut
    // disimpan di row-nya, lalu dipakai lagi saat memanggil Freshness API.
    const inputs = toModelInputs({ category, time, ice, condition })

    const entry = await createCatch({
        species: category,
        weight_kg: weight,
        // PPI dari profil nelayan adalah titik pengambilannya.
        catch_location: profile.ppi_location ?? 'Belum diatur',
        catch_time: catchTimestamp(time),
        storage_method: inputs.storage_method,
        // Nama kapal belum ditanyakan di wizard; diisi setelah ada kolomnya di form.
        vessel_name: '-',
        status_ikan: inputs.status_ikan,
        ice_to_fish_ratio: inputs.ice_to_fish_ratio,
        ambient_temp_celsius: inputs.ambient_temp_celsius,
        fish_category: inputs.fish_category,
        local_id: String(formData.get('local_id') ?? '') || undefined,
    })

    if (photo instanceof Blob && photo.size > 0) {
        // The upload and the assessment both take the same photo and neither needs the other, so they run together.
        // The uploaded photo's URL goes on the row: it's what the listing shows instead of the category illustration.
        const [photoUrl, result] = await Promise.all([
            uploadCatchPhoto(profile.id, entry.id, photo),
            predictFreshness({ catchId: entry.id, inputs, photo }),
        ])
        if (photoUrl) await setCatchPhoto(entry.id, photoUrl)

        if (result) {
            await saveFreshness(entry.id, {
                grade: result.grade,
                score: result.score,
                notes: result.rationale,
                recommendation: result.recommendation,
                overrideApplied: result.overrideApplied,
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

export type ListingEditState = {
    // What was submitted, so the form keeps it after an error.
    values: { berat: string; harga: string }
    errors: { berat?: string; harga?: string }
    // Not tied to a field: the listing stopped being active, or the save failed.
    formError?: string
}

/** Simpan edit listing dari drawer "Listing Saya", lalu kembali ke tampilan detailnya. */
export async function saveListingEdit(_previous: ListingEditState, formData: FormData): Promise<ListingEditState> {
    await requireProfile('nelayan')

    const id = String(formData.get('id') ?? '')
    const values = { berat: String(formData.get('berat') ?? '').trim(), harga: String(formData.get('harga') ?? '').trim() }
    const { minWeight, maxWeight, errors: messages } = EDIT_LISTING

    // "5,5" and "5.5" both mean five and a half kilos.
    const weightKg = Number(values.berat.replace(',', '.'))
    // "8.000" or "Rp 8000" → 8000. Empty means following the auction price.
    const priceDigits = values.harga.replace(/[^\d]/g, '')

    const errors: ListingEditState['errors'] = {}
    if (!values.berat || !Number.isFinite(weightKg) || weightKg < minWeight || weightKg > maxWeight) errors.berat = messages.weight
    if (values.harga && (!priceDigits || /[a-zA-Z]/.test(values.harga.replace(/^rp/i, '')))) errors.harga = messages.price
    if (!id || Object.keys(errors).length > 0) return { values, errors }

    try {
        const updated = await updateListing(id, { weightKg: Math.round(weightKg * 100) / 100, pricePerKg: priceDigits ? Number(priceDigits) : null })
        if (!updated) return { values, errors: {}, formError: messages.notListed }
    } catch (error) {
        console.error('saveListingEdit:', error)
        return { values, errors: {}, formError: messages.saveFailed }
    }

    revalidatePath('/nelayan', 'layout')
    redirect(`${LISTING_PATH}?detail=${id}`)
}

/** Batalkan listing dari dialog konfirmasi di "Listing Saya". */
export async function cancelListing(formData: FormData): Promise<void> {
    await requireProfile('nelayan')

    const id = String(formData.get('id') ?? '')
    if (id) await cancel(id)

    revalidatePath('/nelayan/listing')
    redirect('/nelayan/listing')
}

export type AccountFormState = {
    status: 'idle' | 'saved' | 'error'
    // What was submitted, so the form keeps showing it after React resets it.
    values: AccountValues
    errors: Partial<Record<keyof AccountValues, string>>
    // Set when the checks passed but the save itself failed.
    saveError?: string
}

// Indonesian mobile or landline: +62/62/0, then 8–12 more digits. Spaces and dashes are ignored.
const PHONE = /^(\+62|62|0)\d{8,12}$/

// Long enough for "Pak Dulmatin" or "Bu Sri Wahyuni", short enough for the header pill and sidebar card.
const NICKNAME_MAX = 24

/** Cek dan simpan form Info Pribadi di /nelayan/akun. Lihat lib/nelayan/account.ts untuk tempat tiap field disimpan. */
export async function saveAccount(previous: AccountFormState, formData: FormData): Promise<AccountFormState> {
    await requireProfile('nelayan')

    const text = (name: keyof AccountValues) => String(formData.get(name) ?? '').trim()
    const values: AccountValues = {
        fullName: text('fullName'),
        nickname: text('nickname'),
        // The email is locked: keep the account's, whatever was posted.
        email: previous.values.email,
        phone: text('phone'),
        provinsi: text('provinsi'),
        kabKota: text('kabKota'),
        ppi: text('ppi'),
        bankAccount: text('bankAccount'),
    }

    const { fields } = INFO_PRIBADI
    const errors: AccountFormState['errors'] = {}
    if (!values.fullName) errors.fullName = VALIDATION.required(fields.fullName.label)
    if (values.nickname.length > NICKNAME_MAX) errors.nickname = VALIDATION.nickname(NICKNAME_MAX)
    if (values.phone && !PHONE.test(values.phone.replace(/[\s-]/g, ''))) errors.phone = VALIDATION.phone
    if (!PROVINSI.some(({ kode }) => kode === values.provinsi)) errors.provinsi = VALIDATION.provinsi
    if (!getKabupatenKota(values.provinsi).some(({ kode }) => kode === values.kabKota)) {
        errors.kabKota = VALIDATION.kabKota
    }
    if (!getPelabuhan(values.kabKota).some(({ id }) => id === values.ppi)) errors.ppi = VALIDATION.ppi

    if (Object.keys(errors).length > 0) return { status: 'error', values, errors }

    try {
        await saveAccountValues(values)
    } catch (error) {
        console.error('saveAccount (nelayan):', error)
        return { status: 'error', values, errors: {}, saveError: VALIDATION.saveFailed }
    }

    // The sidebar and header print the name, so the whole area re-renders.
    revalidatePath('/nelayan', 'layout')
    return { status: 'saved', values, errors }
}
