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
    const {
        data: { session },
    } = await supabase.auth.getSession()

    if (!session) throw new Error('User belum login')

    const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/process-escrow`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${session.access_token}`,
            },
            body: JSON.stringify({ catch_id: catchId, estimated_total: estimatedTotal }),
        }
    )

    if (!response.ok) {
        const err = await response.json()
        throw new Error(err.message ?? 'Gagal klaim tangkapan')
    }

    return response.json()
}

/**
 * Konfirmasi serah terima via scan QR. Memanggil Edge Function `confirm-handover`
 * yang handle: update berat final, rekonsiliasi nilai, dan trigger disbursement.
 */
export async function confirmHandover(
    qrScanCode: string,
    finalWeightKg: number
): Promise<Transaction> {
    const {
        data: { session },
    } = await supabase.auth.getSession()

    if (!session) throw new Error('User belum login')

    const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/confirm-handover`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${session.access_token}`,
            },
            body: JSON.stringify({ qr_scan_code: qrScanCode, final_weight_kg: finalWeightKg }),
        }
    )

    if (!response.ok) {
        const err = await response.json()
        throw new Error(err.message ?? 'Gagal konfirmasi serah terima')
    }

    return response.json()
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