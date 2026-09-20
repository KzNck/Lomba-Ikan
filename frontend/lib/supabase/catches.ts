// lib/supabase/catches.ts
//
// Semua query tabel `catches`. Dipanggil dari Server Component / Server Action,
// jadi memakai client dari server.ts (bawa cookie sesi) — RLS yang menentukan
// baris mana yang kelihatan, bukan filter manual di sini.

import { createClient } from './server'
import type { Catch, CatchStatus, CreateCatchInput } from '@/types/database'

/** Tangkapan milik nelayan yang sedang login. RLS memfilter berdasarkan auth.uid(). */
export async function getMyCatches(): Promise<Catch[]> {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('catches')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) throw new Error(`Gagal ambil data tangkapan: ${error.message}`)
    return data ?? []
}

export async function getCatchById(id: string): Promise<Catch | null> {
    const supabase = await createClient()
    const { data, error } = await supabase.from('catches').select('*').eq('id', id).maybeSingle()

    if (error) throw new Error(`Gagal ambil tangkapan: ${error.message}`)
    return data
}

/**
 * Listing yang tampil di marketplace pembeli: berstatus LISTED dan belum lewat
 * batas waktu klaim. Row yang sudah kedaluwarsa masih berstatus LISTED sampai
 * ada job yang mengubahnya, jadi disaring di sini juga.
 */
export async function getListedCatches(): Promise<Catch[]> {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('catches')
        .select('*')
        .eq('status', 'LISTED')
        .gt('expires_at', new Date().toISOString())
        .order('listed_at', { ascending: false })

    if (error) throw new Error(`Gagal ambil listing: ${error.message}`)
    return data ?? []
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

/** Batalkan listing. Row-nya tetap disimpan sebagai riwayat, statusnya jadi EXPIRED. */
export async function cancelListing(catchId: string): Promise<void> {
    const supabase = await createClient()
    const { error } = await supabase
        .from('catches')
        .update({ status: 'EXPIRED' as CatchStatus })
        .eq('id', catchId)

    if (error) throw new Error(`Gagal batalkan listing: ${error.message}`)
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
