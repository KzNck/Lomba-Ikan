// lib/supabase/catches.ts
//
// Semua fungsi terkait tabel `catches`.
// Frontend tinggal import & panggil — tidak perlu tahu query SQL/Supabase-nya.

import { supabase } from './client'
import type { Catch, CreateCatchInput, CatchStatus } from '@/types/database'

/**
 * Ambil semua tangkapan milik nelayan yang sedang login.
 * RLS otomatis filter berdasarkan auth.uid() — tidak perlu pass user id manual.
 */
export async function getMyCatches(): Promise<Catch[]> {
    const { data, error } = await supabase
        .from('catches')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) throw new Error(`Gagal ambil data tangkapan: ${error.message}`)
    return data
}

/**
 * Ambil satu tangkapan by ID.
 */
export async function getCatchById(id: string): Promise<Catch | null> {
    const { data, error } = await supabase
        .from('catches')
        .select('*')
        .eq('id', id)
        .single()

    if (error) {
        if (error.code === 'PGRST116') return null // not found
        throw new Error(`Gagal ambil tangkapan: ${error.message}`)
    }
    return data
}

/**
 * Ambil semua tangkapan berstatus LISTED — buat marketplace pembeli.
 */
export async function getListedCatches(): Promise<Catch[]> {
    const { data, error } = await supabase
        .from('catches')
        .select('*')
        .eq('status', 'LISTED')
        .order('listed_at', { ascending: false })

    if (error) throw new Error(`Gagal ambil listing: ${error.message}`)
    return data
}

/**
 * Buat entri tangkapan baru. Dipanggil saat nelayan submit form
 * "Catat Tangkapan Baru" — baik online maupun setelah offline sync.
 *
 * `local_id` dipakai untuk idempotent upsert: kalau sync ulang
 * dengan local_id yang sama, tidak akan duplikat.
 */
export async function createCatch(input: CreateCatchInput): Promise<Catch> {
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) throw new Error('User belum login')

    const { data, error } = await supabase
        .from('catches')
        .upsert(
            {
                nelayan_id: user.id,
                species: input.species,
                weight_kg: input.weight_kg,
                catch_location: input.catch_location,
                catch_time: input.catch_time,
                storage_method: input.storage_method,
                vessel_name: input.vessel_name,
                price_per_kg: input.price_per_kg ?? null,
                local_id: input.local_id ?? null,
                photo_url: input.photo_url ?? null,
                status: 'WAITING_FOR_SYNC' as CatchStatus,
            },
            { onConflict: 'local_id' } // idempotent: re-sync tidak duplikat
        )
        .select()
        .single()

    if (error) throw new Error(`Gagal simpan tangkapan: ${error.message}`)
    return data
}

/**
 * Update status tangkapan ke LISTED setelah berhasil sync ke cloud.
 * Trigger di DB otomatis set listed_at & expires_at (+48 jam).
 */
export async function markAsListed(catchId: string): Promise<Catch> {
    const { data, error } = await supabase
        .from('catches')
        .update({ status: 'LISTED' as CatchStatus, synced_at: new Date().toISOString() })
        .eq('id', catchId)
        .select()
        .single()

    if (error) throw new Error(`Gagal update status listing: ${error.message}`)
    return data
}

/**
 * Subscribe realtime ke perubahan status tangkapan tertentu.
 * Berguna untuk notifikasi "Status: CLAIMED" muncul live di UI nelayan.
 *
 * Return function unsubscribe — panggil di useEffect cleanup.
 */
export function subscribeToCatchStatus(
    catchId: string,
    onUpdate: (updated: Catch) => void
): () => void {
    const channel = supabase
        .channel(`catch-${catchId}`)
        .on(
            'postgres_changes',
            { event: 'UPDATE', schema: 'public', table: 'catches', filter: `id=eq.${catchId}` },
            (payload) => onUpdate(payload.new as Catch)
        )
        .subscribe()

    return () => {
        supabase.removeChannel(channel)
    }
}

/**
 * Subscribe realtime ke semua listing baru — buat halaman marketplace pembeli.
 */
export function subscribeToNewListings(onNewListing: (newCatch: Catch) => void): () => void {
    const channel = supabase
        .channel('marketplace-listings')
        .on(
            'postgres_changes',
            { event: 'INSERT', schema: 'public', table: 'catches', filter: `status=eq.LISTED` },
            (payload) => onNewListing(payload.new as Catch)
        )
        .subscribe()

    return () => {
        supabase.removeChannel(channel)
    }
}