// lib/supabase/transactions.ts
//
// Alur transaksi: klaim → escrow → serah terima.
// Logic sensitif (escrow, disbursement) dijalankan Edge Function dengan service
// role, bukan langsung dari client — lihat supabase/functions/.

import { createClient } from './server'
import type { Catch, Transaction } from '@/types/database'

/** Transaksi yang melibatkan user yang login, sebagai nelayan maupun pembeli. */
export async function getMyTransactions(): Promise<(Transaction & { catches: Catch | null })[]> {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('transactions')
        .select('*, catches(*)')
        .order('created_at', { ascending: false })

    if (error) throw new Error(`Gagal ambil transaksi: ${error.message}`)
    return (data ?? []) as (Transaction & { catches: Catch | null })[]
}

export async function getTransactionById(
    id: string
): Promise<(Transaction & { catches: Catch | null }) | null> {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('transactions')
        .select('*, catches(*)')
        .eq('id', id)
        .maybeSingle()

    if (error) throw new Error(`Gagal ambil transaksi: ${error.message}`)
    return data as (Transaction & { catches: Catch | null }) | null
}

/**
 * Klaim tangkapan sebagai pembeli. Lewat Edge Function `process-escrow` karena
 * perlu mengubah catches.status dan menulis row transactions sekaligus, secara
 * atomik — tidak aman dikerjakan dari client.
 */
export async function claimCatch(catchId: string, estimatedTotal: number): Promise<Transaction> {
    const supabase = await createClient()
    const { data, error } = await supabase.functions.invoke<Transaction>('process-escrow', {
        body: { catch_id: catchId, estimated_total: estimatedTotal },
    })

    if (error) throw new Error(error.message ?? 'Gagal klaim tangkapan')
    if (!data) throw new Error('Response kosong dari server')
    return data
}

/**
 * Konfirmasi serah terima via scan QR. Edge Function `confirm-handover` yang
 * mengurus berat final, rekonsiliasi nilai, dan disbursement.
 */
export async function confirmHandover(
    qrScanCode: string,
    finalWeightKg: number
): Promise<Transaction> {
    const supabase = await createClient()
    const { data, error } = await supabase.functions.invoke<Transaction>('confirm-handover', {
        body: { qr_scan_code: qrScanCode, final_weight_kg: finalWeightKg },
    })

    if (error) throw new Error(error.message ?? 'Gagal konfirmasi serah terima')
    if (!data) throw new Error('Response kosong dari server')
    return data
}

/**
 * Nama dan nomor telepon pihak lain dari satu transaksi (nelayan untuk pembeli,
 * pembeli untuk nelayan), lewat fungsi SQL `get_transaction_contact` — profil
 * orang lain tidak bisa dibaca langsung. Null kalau fungsinya belum dibuat di
 * project ini (supabase/transaction-contact.sql) atau user bukan pihak transaksi.
 */
export async function getTransactionContact(
    transactionId: string
): Promise<{ name: string; phone: string | null } | null> {
    const supabase = await createClient()
    const { data, error } = await supabase.rpc('get_transaction_contact', { p_transaction_id: transactionId })

    if (error) {
        console.error(`Gagal ambil kontak transaksi (jalankan supabase/transaction-contact.sql?): ${error.message}`)
        return null
    }
    const contact = data?.[0]
    return contact ? { name: contact.full_name, phone: contact.phone } : null
}
