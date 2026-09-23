'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { requireProfile } from '@/lib/supabase/auth'
import type { Profile } from '@/types/database'
import { cacheTags, expireTags } from '@/lib/supabase/cached'
import {
    cancelListing as cancel,
    deleteCatch,
    createCatch,
    getCatchById,
    getCatchByLocalId,
    publishCatch,
    setCatchPhoto,
    updateListing,
} from '@/lib/supabase/catches'
import { editListing, LISTING_PATH } from '@/components/nelayan/listing-content'
import { getTranslations } from 'next-intl/server'
import { uploadCatchPhoto } from '@/lib/supabase/storage'
import { confirmHandover as completeHandover, getTransactionById } from '@/lib/supabase/transactions'
import { RIWAYAT_PATH, STATE_OF } from '@/components/nelayan/riwayat-content'
import { WEIGHT_LIMITS } from '@/components/nelayan/listing-content'
import { catchTimestamp, toModelInputs } from '@/lib/catches/model-inputs'
import { gradeCatch } from '@/lib/freshness/grade'
import { waNumber } from '@/lib/contact/whatsapp'
import { OTHER_NAME_MAX } from '@/components/nelayan/catch-content'
import { getKabupatenKota, getPelabuhan, PROVINSI } from '@/lib/wilayah'
import { infoPribadi, validation, type AccountValues } from '@/components/nelayan/akun-content'
import { saveAccountValues } from '@/lib/nelayan/account'

/**
 * Simpan tangkapan dari wizard "Tambah Tangkapan", lalu minta penilaian
 * kesegaran. Row dibuat lebih dulu supaya tangkapan tidak hilang kalau AI-nya
 * sedang tidak bisa dihubungi — grade-nya menyusul, statusnya tetap tersimpan.
 */
export async function submitCatch(formData: FormData): Promise<void> {
    const profile = await requireProfile('nelayan')
    const id = await recordCatch(profile, formData)

    // The new catch shows on the dashboard and in Listing Saya.
    expireTags(cacheTags.catches(profile.id))
    revalidatePath('/nelayan', 'layout')
    redirect(`/nelayan/catat/hasil?id=${id}`)
}

export type SyncResult = { status: 'synced'; id: string } | { status: 'invalid' }

/**
 * Kirim satu tangkapan dari antrean offline (components/nelayan/offline-sync.tsx), lewat jalur simpan yang sama
 * dengan submitCatch, tapi tanpa redirect: sinkronisasi berjalan di latar belakang, di halaman mana pun.
 * `catch_time` dihitung saat dicatat di laut; `local_id` membuat pengiriman ulang tidak membuat baris ganda.
 */
export async function syncOfflineCatch(formData: FormData): Promise<SyncResult> {
    const profile = await requireProfile('nelayan')

    const localId = String(formData.get('local_id') ?? '')
    const caughtAt = new Date(String(formData.get('catch_time') ?? ''))
    // Tidak ada tangkapan dari masa depan; sedikit kelonggaran untuk jam perangkat yang tidak tepat.
    if (!localId || Number.isNaN(caughtAt.getTime()) || caughtAt.getTime() > Date.now() + 5 * 60_000) {
        return { status: 'invalid' }
    }

    // Sudah pernah terkirim (jawabannya hilang di jalan, lalu perangkat mengirim ulang): jangan simpan dan nilai lagi.
    const existing = await getCatchByLocalId(localId)
    if (existing) return { status: 'synced', id: existing.id }

    let id: string
    try {
        id = await recordCatch(profile, formData, caughtAt)
    } catch (error) {
        if ((error as Error).message === INCOMPLETE) return { status: 'invalid' }
        throw error
    }

    expireTags(cacheTags.catches(profile.id))
    revalidatePath('/nelayan', 'layout')
    return { status: 'synced', id }
}

const INCOMPLETE = 'Data tangkapan belum lengkap.'

/**
 * Simpan satu tangkapan dari jawaban wizard dan nilai kesegarannya. `caughtAt` diisi untuk tangkapan dari antrean
 * offline: waktu tangkapnya sudah dihitung saat dicatat, dan jam sejak ditarik dihitung dari situ sampai sekarang.
 */
async function recordCatch(profile: Profile, formData: FormData, caughtAt?: Date): Promise<string> {
    const category = String(formData.get('category') ?? '')
    const time = String(formData.get('time') ?? '')
    const ice = String(formData.get('ice') ?? '')
    const condition = String(formData.get('kondisi') ?? '')
    const weight = Number(formData.get('weight') ?? 0)
    const photo = formData.get('photo')

    if (!category || !time || !ice || !condition || !(weight > 0)) {
        throw new Error(INCOMPLETE)
    }

    // Jawaban wizard diterjemahkan sekali ke kosakata model; hasilnya ikut
    // disimpan di row-nya, lalu dipakai grade-catch saat memanggil Freshness API.
    const inputs = toModelInputs({ category, time, ice, condition })

    // "Lainnya" disimpan dengan nama yang diketik nelayan, supaya listing dan
    // marketplace menampilkannya; model tetap menerima kategori "lainnya" (rucah).
    const otherName = String(formData.get('lainnya') ?? '').replace(/\s+/g, ' ').trim().slice(0, OTHER_NAME_MAX)
    const species = category === 'lainnya' && otherName ? otherName : category

    const entry = await createCatch({
        species,
        weight_kg: weight,
        // PPI dari profil nelayan adalah titik pengambilannya.
        catch_location: profile.ppi_location ?? 'Belum diatur',
        catch_time: caughtAt ? caughtAt.toISOString() : catchTimestamp(time),
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
        // The uploaded photo's URL goes on the row: it's what the listing shows instead of the category illustration,
        // and what the grade-catch Edge Function grades from.
        const photoUrl = await uploadCatchPhoto(profile.id, entry.id, photo)
        if (photoUrl) await setCatchPhoto(entry.id, photoUrl)

        // grade-catch grades and saves the result; it is the only path that may write a grade. A photo that wasn't
        // stored (HEIC from Chrome isn't kept) is sent along with the request instead.
        await gradeCatch(entry.id, photoUrl ? undefined : photo)
    }

    return entry.id
}

/**
 * "Nilai ulang" di Hasil Kesegaran, untuk tangkapan yang belum bergrade karena
 * Freshness API gagal saat dicatat. Foto yang tersimpan dikirim lagi dengan
 * input model yang tersimpan di row-nya; jam sejak ditarik dihitung ulang dari
 * `catch_time`, karena kesegarannya dinilai untuk saat ini.
 */
export async function regradeCatch(formData: FormData): Promise<void> {
    const profile = await requireProfile('nelayan')

    const id = String(formData.get('id') ?? '')
    // RLS hanya mengembalikan tangkapan milik nelayan ini.
    const entry = id ? await getCatchById(id) : null
    if (!entry) throw new Error('Tangkapan tidak ditemukan.')

    const resultHref = `/nelayan/catat/hasil?id=${entry.id}`
    if (entry.freshness_grade || !entry.photo_url) redirect(resultHref)

    // grade-catch refetches the stored photo and recomputes the hours since haul from `catch_time`.
    const graded = await gradeCatch(entry.id)
    if (graded) {
        expireTags(cacheTags.catches(profile.id))
        revalidatePath('/nelayan')
        revalidatePath('/nelayan/listing')
    }

    // `gagal` tells the result page this retry failed too, so it can say so rather than look unchanged.
    redirect(graded ? resultHref : `${resultHref}&gagal=1`)
}

/** Terbitkan tangkapan yang sudah dinilai ke marketplace, dengan harga opsional dari form. */
export async function publishListing(formData: FormData): Promise<void> {
    const profile = await requireProfile('nelayan')

    const id = String(formData.get('id') ?? '')
    if (!id) throw new Error('Tangkapan tidak ditemukan.')

    // Pembeli diantar ke WhatsApp nelayan setelah membeli, jadi listing tanpa
    // nomor tidak dipasang. Halaman hasil menjelaskannya dan menautkan ke Akun.
    if (!waNumber(profile.phone)) redirect(`/nelayan/catat/hasil?id=${id}`)

    // "8.000" dari field harga → 8000. Kosong berarti mengikuti harga lelang.
    const raw = String(formData.get('harga') ?? '').replace(/[^\d]/g, '')
    await publishCatch(id, raw ? Number(raw) : null)

    // The batch appears in Listing Saya, on the dashboard, and in the buyers' marketplace.
    expireTags(cacheTags.catches(profile.id), cacheTags.marketplace)
    revalidatePath('/nelayan', 'layout')
    revalidatePath('/marketplace', 'layout')
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
    const profile = await requireProfile('nelayan')

    const id = String(formData.get('id') ?? '')
    const values = { berat: String(formData.get('berat') ?? '').trim(), harga: String(formData.get('harga') ?? '').trim() }
    const { minWeight, maxWeight, errors: messages } = editListing(await getTranslations('dashboard.nelayan.listing'))

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

    // The new weight and price show in Listing Saya, on the dashboard, and in the marketplace.
    expireTags(cacheTags.catches(profile.id), cacheTags.marketplace)
    revalidatePath('/nelayan', 'layout')
    revalidatePath('/marketplace', 'layout')
    redirect(`${LISTING_PATH}?detail=${id}`)
}

/** Batalkan listing dari dialog konfirmasi di "Listing Saya". */
export async function cancelListing(formData: FormData): Promise<void> {
    const profile = await requireProfile('nelayan')

    const id = String(formData.get('id') ?? '')
    if (id) await cancel(id)

    // The listing leaves Listing Saya's active tab, the dashboard's panel and stats, and the marketplace.
    expireTags(cacheTags.catches(profile.id), cacheTags.marketplace)
    revalidatePath('/nelayan', 'layout')
    revalidatePath('/marketplace', 'layout')
    redirect('/nelayan/listing')
}

/**
 * Hapus listing secara permanen dari dialog konfirmasi di "Listing Saya". `back` adalah tampilan yang dibuka
 * sebelumnya (filter dan urutan); kalau gagal, drawer-nya dibuka lagi dengan pesan galat.
 */
export async function deleteListing(formData: FormData): Promise<void> {
    const profile = await requireProfile('nelayan')

    const id = String(formData.get('id') ?? '')
    const requested = String(formData.get('back') ?? '')
    // Hanya kembali ke halaman ini sendiri, supaya field ini tidak bisa dipakai untuk redirect ke tempat lain.
    const back = requested === LISTING_PATH || requested.startsWith(`${LISTING_PATH}?`) ? requested : LISTING_PATH

    const deleted = id ? await deleteCatch(profile.id, id) : false

    expireTags(cacheTags.catches(profile.id))
    revalidatePath('/nelayan/listing')
    revalidatePath('/nelayan')
    if (deleted) redirect(back)
    const failed = new URL(back, 'http://x')
    failed.searchParams.set('detail', id)
    failed.searchParams.set('gagal', 'hapus')
    redirect(`${failed.pathname}${failed.search}`)
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
    const profile = await requireProfile('nelayan')

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

    const [t, register] = await Promise.all([getTranslations('dashboard.akun'), getTranslations('auth.register')])
    const { fields } = infoPribadi(t, register)
    const VALIDATION = validation(t)
    const errors: AccountFormState['errors'] = {}
    if (!values.fullName) errors.fullName = VALIDATION.required(fields.fullName.label)
    if (values.nickname.length > NICKNAME_MAX) errors.nickname = VALIDATION.nickname(NICKNAME_MAX)
    // Required: buyers are sent to this number on WhatsApp once they buy.
    if (!values.phone) errors.phone = VALIDATION.required(fields.phone.label)
    else if (!PHONE.test(values.phone.replace(/[\s-]/g, ''))) errors.phone = VALIDATION.phone
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
    expireTags(cacheTags.profile(profile.id))
    revalidatePath('/nelayan', 'layout')
    return { status: 'saved', values, errors }
}

export type HandoverState = {
    // What was submitted, so the form keeps it after an error.
    weight: string
    error?: string
}

/**
 * "Konfirmasi serah terima" di drawer Riwayat Transaksi: berat akhir dari
 * timbangan di PPI, lalu Edge Function `confirm-handover` menandai transaksi
 * selesai, menghitung ulang nilainya, dan mencatat pencairan. Kode QR-nya
 * diambil dari row transaksi — nelayan tidak perlu memindai apa pun.
 */
export async function confirmHandover(_previous: HandoverState, formData: FormData): Promise<HandoverState> {
    const profile = await requireProfile('nelayan')
    const t = await getTranslations('dashboard.riwayat.handover')

    const id = String(formData.get('id') ?? '')
    const weight = String(formData.get('berat') ?? '').trim()
    // "9,5" dan "9.5" sama-sama sembilan setengah kilo.
    const weightKg = Number(weight.replace(',', '.'))
    if (!weight || !Number.isFinite(weightKg) || weightKg <= 0 || weightKg > WEIGHT_LIMITS.max) {
        return { weight, error: t('weightError') }
    }

    // RLS hanya mengembalikan transaksi yang melibatkan user ini.
    const transaction = id ? await getTransactionById(id) : null
    if (
        !transaction ||
        transaction.nelayan_id !== profile.id ||
        STATE_OF[transaction.status] !== 'diproses' ||
        !transaction.qr_scan_code
    ) {
        return { weight, error: t('notActive') }
    }
    // Both sides confirm the pickup (PRD story 9): the buyer first, from their drawer. `undefined` means the column
    // isn't there yet (supabase/pickup-confirmation.sql not run), and completing works as it did before.
    if (transaction.pembeli_confirmed_at === null) return { weight, error: t('awaitingBuyer') }

    try {
        await completeHandover(transaction.qr_scan_code, Math.round(weightKg * 100) / 100)
    } catch (error) {
        console.error('confirmHandover:', error)
        return { weight, error: t('failed') }
    }

    // Selesai di kedua sisi: riwayat nelayan dan pembelinya, dan status batch-nya di Listing Saya.
    expireTags(
        cacheTags.transactions(transaction.nelayan_id),
        cacheTags.transactions(transaction.pembeli_id),
        cacheTags.catches(transaction.nelayan_id)
    )
    revalidatePath('/nelayan', 'layout')
    // Kembali ke tampilan yang sama, yang sekarang menunjukkan transaksi ini selesai.
    const back = String(formData.get('kembali') ?? '')
    redirect(back.startsWith(`${RIWAYAT_PATH}?`) || back === RIWAYAT_PATH ? back : `${RIWAYAT_PATH}?transaksi=${transaction.id}`)
}
