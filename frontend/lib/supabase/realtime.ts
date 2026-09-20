// lib/supabase/realtime.ts
//
// Langganan realtime — hanya jalan di browser, jadi terpisah dari query di
// catches.ts/transactions.ts yang dipanggil dari server.
//
// Tabel `catches` dan `transactions` sudah masuk publication supabase_realtime
// (lihat bagian REALTIME di supabase/schema.sql).

import { supabase } from './client'
import type { Catch, Transaction } from '@/types/database'

/**
 * Pantau perubahan status satu tangkapan — misalnya supaya nelayan melihat
 * "Diklaim" muncul tanpa refresh. Mengembalikan fungsi unsubscribe; panggil di
 * cleanup useEffect.
 */
export function subscribeToCatchStatus(catchId: string, onUpdate: (updated: Catch) => void): () => void {
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

/** Listing baru yang masuk ke marketplace pembeli. */
export function subscribeToNewListings(onNewListing: (newCatch: Catch) => void): () => void {
    const channel = supabase
        .channel('marketplace-listings')
        .on(
            'postgres_changes',
            { event: 'INSERT', schema: 'public', table: 'catches', filter: 'status=eq.LISTED' },
            (payload) => onNewListing(payload.new as Catch)
        )
        .subscribe()

    return () => {
        supabase.removeChannel(channel)
    }
}

/** Perubahan status satu transaksi (escrow → timbang → serah terima). */
export function subscribeToTransactionStatus(
    transactionId: string,
    onUpdate: (updated: Transaction) => void
): () => void {
    const channel = supabase
        .channel(`transaction-${transactionId}`)
        .on(
            'postgres_changes',
            {
                event: 'UPDATE',
                schema: 'public',
                table: 'transactions',
                filter: `id=eq.${transactionId}`,
            },
            (payload) => onUpdate(payload.new as Transaction)
        )
        .subscribe()

    return () => {
        supabase.removeChannel(channel)
    }
}
