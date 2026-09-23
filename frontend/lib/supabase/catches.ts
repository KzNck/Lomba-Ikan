// lib/supabase/catches.ts
//
// Semua query tabel `catches`. Dipanggil dari Server Component / Server Action,
// jadi memakai client dari server.ts (bawa cookie sesi) — RLS yang menentukan
// baris mana yang kelihatan, bukan filter manual di sini.

import { cache } from 'react'
import { createClient } from './server'
import { cachedForUser, cacheTags, REVALIDATE } from './cached'
import { CATCH_PHOTOS_BUCKET } from './storage'
import type { Catch, CatchStatus, CreateCatchInput } from '@/types/database'

/** Listing yang batas waktu klaimnya sudah lewat, meski job kedaluwarsa (supabase/expire-listings.sql) belum mengubahnya. */
export const isOverdue = (entry: Pick<Catch, 'status' | 'expires_at'>, now = Date.now()) =>
    entry.status === 'LISTED' && entry.expires_at !== null && Date.parse(entry.expires_at) <= now

/**
 * Tangkapan milik nelayan yang sedang login. RLS memfilter berdasarkan auth.uid(). Sekali per request: halaman dan
 * helper-nya (mis. notifikasi di header) yang sama-sama memanggilnya berbagi satu query. Antar request dibaca dari
 * cache server (lib/supabase/cached.ts); aksi yang mengubah tangkapan mengosongkan tag-nya.
 *
 * Listing yang sudah lewat 48 jamnya dikembalikan sebagai EXPIRED, dihitung ulang tiap request: job di database
 * baru mengubahnya beberapa menit kemudian, dan sampai saat itu dashboard, Listing Saya, dan notifikasi harus
 * sudah menampilkannya sebagai kedaluwarsa.
 */
export const getMyCatches = cache(async (): Promise<Catch[]> => {
    const result = await cachedForUser(
        'my-catches',
        { tags: (userId) => [cacheTags.catches(userId)], revalidate: REVALIDATE.catches },
        async (supabase) => {
            const { data, error } = await supabase
                .from('catches')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw new Error(`Gagal ambil data tangkapan: ${error.message}`)
            return data ?? []
        }
    )
    const now = Date.now()
    return (result?.data ?? []).map((entry) => (isOverdue(entry, now) ? { ...entry, status: 'EXPIRED' as CatchStatus } : entry))
})

export async function getCatchById(id: string): Promise<Catch | null> {
    const supabase = await createClient()
    const { data, error } = await supabase.from('catches').select('*').eq('id', id).maybeSingle()

    if (error) throw new Error(`Gagal ambil tangkapan: ${error.message}`)
    return data
}

/** Tangkapan dari antrean offline yang sudah pernah tersimpan, lewat `local_id`-nya; null kalau belum. */
export async function getCatchByLocalId(localId: string): Promise<Pick<Catch, 'id'> | null> {
    const supabase = await createClient()
    const { data, error } = await supabase.from('catches').select('id').eq('local_id', localId).maybeSingle()

    if (error) throw new Error(`Gagal cek tangkapan offline: ${error.message}`)
    return data
}

/**
 * Listing yang tampil di marketplace pembeli: berstatus LISTED dan belum lewat
 * batas waktu klaim. Row yang sudah kedaluwarsa masih berstatus LISTED sampai
 * ada job yang mengubahnya, jadi disaring di sini juga — sekali di query, dan
 * sekali lagi setelah cache, supaya listing yang habis waktunya selama hasilnya
 * tersimpan tidak ikut tampil.
 */
export async function getListedCatches(): Promise<Catch[]> {
    const result = await cachedForUser(
        'listed-catches',
        { tags: () => [cacheTags.marketplace], revalidate: REVALIDATE.marketplace },
        async (supabase) => {
            const { data, error } = await supabase
                .from('catches')
                .select('*')
                .eq('status', 'LISTED')
                .gt('expires_at', new Date().toISOString())
                .order('listed_at', { ascending: false })

            if (error) throw new Error(`Gagal ambil listing: ${error.message}`)
            return data ?? []
        }
    )
    const now = Date.now()
    return (result?.data ?? []).filter((entry) => entry.expires_at !== null && Date.parse(entry.expires_at) > now)
}

/**
 * Simpan tangkapan baru. `local_id` membuat upsert idempotent: sync ulang dari
 * antrean offline dengan local_id yang sama tidak menghasilkan baris ganda.
 */
export async function createCatch(input: CreateCatchInput): Promise<Catch> {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error('User belum login')

    const row = {
        nelayan_id: user.id,
        species: input.species,
        weight_kg: input.weight_kg,
        catch_location: input.catch_location,
        catch_time: input.catch_time,
        storage_method: input.storage_method,
        vessel_name: input.vessel_name,
        // Input model AI, disimpan supaya penilaian bisa diulang dengan data yang sama.
        status_ikan: input.status_ikan ?? null,
        ice_to_fish_ratio: input.ice_to_fish_ratio ?? null,
        ambient_temp_celsius: input.ambient_temp_celsius ?? null,
        fish_category: input.fish_category ?? null,
        price_per_kg: input.price_per_kg ?? null,
        photo_url: input.photo_url ?? null,
        status: 'WAITING_FOR_SYNC' as CatchStatus,
    }

    // onConflict hanya berlaku kalau ada local_id; tanpa itu upsert tanpa key unik
    // akan menimpa baris lain, jadi insert biasa.
    const query = input.local_id
        ? supabase.from('catches').upsert({ ...row, local_id: input.local_id }, { onConflict: 'local_id' })
        : supabase.from('catches').insert(row)

    const { data, error } = await query.select().single()
    if (error) throw new Error(`Gagal simpan tangkapan: ${error.message}`)
    return data
}

/**
 * Terbitkan tangkapan ke marketplace. Trigger `trg_catch_expiry` di database
 * yang mengisi listed_at dan expires_at (+48 jam).
 */
export async function publishCatch(catchId: string, pricePerKg: number | null): Promise<Catch> {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('catches')
        .update({
            status: 'LISTED' as CatchStatus,
            price_per_kg: pricePerKg,
            synced_at: new Date().toISOString(),
        })
        .eq('id', catchId)
        .select()
        .single()

    if (error) throw new Error(`Gagal pasang listing: ${error.message}`)
    return data
}

/**
 * Ubah berat dan harga listing yang masih aktif. Hanya baris LISTED yang
 * tersentuh: kalau pembeli sudah mengklaimnya sementara form terbuka, tidak ada
 * yang berubah dan fungsi ini mengembalikan false.
 */
export async function updateListing(catchId: string, changes: { weightKg: number; pricePerKg: number | null }): Promise<boolean> {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('catches')
        .update({ weight_kg: changes.weightKg, price_per_kg: changes.pricePerKg })
        .eq('id', catchId)
        .eq('status', 'LISTED' as CatchStatus)
        .select('id')

    if (error) throw new Error(`Gagal ubah listing: ${error.message}`)
    return (data ?? []).length > 0
}

/** Batalkan listing. Row-nya tetap disimpan sebagai riwayat, statusnya jadi EXPIRED. */
export async function cancelListing(catchId: string): Promise<void> {
    const supabase = await createClient()
    const { error } = await supabase
        .from('catches')
        .update({ status: 'EXPIRED' as CatchStatus })
        .eq('id', catchId)

    if (error) throw new Error(`Gagal batalkan listing: ${error.message}`)
}

/**
 * Status yang boleh dihapus: draft yang belum dipasang, dan listing yang sudah kedaluwarsa atau dibatalkan —
 * termasuk listing LISTED yang batas waktunya sudah lewat tapi belum diubah job kedaluwarsa.
 */
export const DELETABLE_STATUSES: CatchStatus[] = ['WAITING_FOR_SYNC', 'EXPIRED']

/**
 * Hapus tangkapan secara permanen, beserta fotonya. Hanya status di DELETABLE_STATUSES yang dihapus, dan
 * transactions.catch_id ON DELETE RESTRICT menolak tangkapan yang pernah diklaim — riwayat transaksi tidak ikut
 * hilang. Mengembalikan false kalau tidak ada yang terhapus (status lain, sudah dihapus, atau ada transaksinya).
 */
export async function deleteCatch(nelayanId: string, catchId: string): Promise<boolean> {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('catches')
        .delete()
        .eq('id', catchId)
        .or(`status.in.(${DELETABLE_STATUSES.join(',')}),and(status.eq.LISTED,expires_at.lte."${new Date().toISOString()}")`)
        .select('id')

    // 23503: masih dirujuk transaksi. Itu penolakan yang diharapkan, bukan galat.
    if (error && error.code !== '23503') throw new Error(`Gagal hapus listing: ${error.message}`)
    if (error || (data ?? []).length === 0) return false

    // Fotonya disimpan di <nelayan>/<catch>.jpg (lihat uploadCatchPhoto). Kalau gagal, row-nya sudah terhapus;
    // foto yang tertinggal hanya memakan tempat, jadi cukup dicatat.
    const { error: photoError } = await supabase.storage.from(CATCH_PHOTOS_BUCKET).remove([`${nelayanId}/${catchId}.jpg`])
    if (photoError) console.error(`Foto listing ${catchId} tidak terhapus: ${photoError.message}`)
    return true
}

/** Tempelkan URL foto yang sudah diupload ke row tangkapannya — foto ini yang tampil di listing. */
export async function setCatchPhoto(catchId: string, photoUrl: string): Promise<void> {
    const supabase = await createClient()
    const { error } = await supabase.from('catches').update({ photo_url: photoUrl }).eq('id', catchId)
    if (error) throw new Error(`Gagal simpan foto tangkapan: ${error.message}`)
}

/** Simpan hasil penilaian AI ke row tangkapan. */
export async function saveFreshness(
    catchId: string,
    result: {
        grade: Catch['freshness_grade']
        score: number | null
        notes: string | null
        recommendation: string | null
        overrideApplied: boolean
    }
): Promise<Catch> {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('catches')
        .update({
            freshness_grade: result.grade,
            freshness_score: result.score,
            freshness_notes: result.notes,
            hilirisasi_recommendation: result.recommendation,
            ai_override_applied: result.overrideApplied,
        })
        .eq('id', catchId)
        .select()
        .single()

    if (error) throw new Error(`Gagal simpan hasil kesegaran: ${error.message}`)
    return data
}
