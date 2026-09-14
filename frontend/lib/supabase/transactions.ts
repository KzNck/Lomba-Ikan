// lib/supabase/transactions.ts
//
// Semua fungsi terkait alur transaksi: klaim → escrow → serah terima.
// Sebagian besar logic sensitif (escrow, disbursement) dipanggil lewat
// Edge Function, bukan langsung dari client — lihat supabase/functions/.

import { supabase } from './client'
import type { Transaction } from '@/types/database'

/**
 * Ambil semua transaksi milik user yang login (baik sebagai nelayan atau pembeli).
 */
export async function getMyTransactions(): Promise<Transaction[]> {
    const { data, error } = await supabase
        .from('transactions')
        .select('*, catches(*)')
        .order('created_at', { ascending: false })

    if (error) throw new Error(`Gagal ambil transaksi: ${error.message}`)
    return data
}

export async function getTransactionById(id: string): Promise<Transaction | null> {
    const { data, error } = await supabase
        .from('transactions')
        .select('*, catches(*)')
        .eq('id', id)
        .single()

    if (error) {
        if (error.code === 'PGRST116') return null
        throw new Error(`Gagal ambil transaksi: ${error.message}`)
    }
    return data
}

/**
 * Klaim tangkapan sebagai pembeli. Ini memanggil Edge Function `process-escrow`
 * karena butuh update dua tabel sekaligus (catches.status + insert transactions)
 * secara atomik dengan service role — tidak aman dilakukan langsung dari client.
 */
export async function claimCatch(catchId: string, estimatedTotal: number): Promise<Transaction> {
    const { data, error } = await supabase.functions.invoke<Transaction>('process-escrow', {
        body: { catch_id: catchId, estimated_total: estimatedTotal },
    })

    if (error) throw new Error(error.message ?? 'Gagal klaim tangkapan')
    if (!data) throw new Error('Response kosong dari server')
    return data
}

/**
 * Konfirmasi serah terima via scan QR. Memanggil Edge Function `confirm-handover`
 * yang handle: update berat final, rekonsiliasi nilai, dan trigger disbursement.
 */
export async function confirmHandover(
    qrScanCode: string,
    finalWeightKg: number
): Promise<Transaction> {
    const { data, error } = await supabase.functions.invoke<Transaction>('confirm-handover', {
        body: { qr_scan_code: qrScanCode, final_weight_kg: finalWeightKg },
    })

    if (error) throw new Error(error.message ?? 'Gagal konfirmasi serah terima')
    if (!data) throw new Error('Response kosong dari server')
    return data
}

/**
 * Subscribe realtime ke perubahan status transaksi tertentu.
 */
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