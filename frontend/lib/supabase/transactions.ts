// lib/supabase/transactions.ts
//
// Alur transaksi: klaim → escrow → serah terima.
// Logic sensitif (escrow, disbursement) dijalankan Edge Function dengan service
// role, bukan langsung dari client — lihat supabase/functions/.

import { cache } from 'react'
import { createClient } from './server'
import { cachedForUser, cacheTags, REVALIDATE } from './cached'
import type { Catch, Transaction } from '@/types/database'

// Kolom tangkapan yang dibaca dari sebuah transaksi (riwayat, notifikasi) — bukan seluruh row-nya. Tambahkan di
// kedua tempat kalau ada tampilan yang butuh kolom lain.
const TRANSACTION_CATCH_COLUMNS =
    'id, created_at, species, weight_kg, catch_location, catch_time, storage_method, freshness_grade, photo_url, price_per_kg, listed_at'
export type TransactionCatch = Pick<
    Catch,
    | 'id'
    | 'created_at'
    | 'species'
    | 'weight_kg'
    | 'catch_location'
    | 'catch_time'
    | 'storage_method'
    | 'freshness_grade'
    | 'photo_url'
    | 'price_per_kg'
    | 'listed_at'
>
export type TransactionWithCatch = Transaction & { catches: TransactionCatch | null }

/**
 * Transaksi yang melibatkan user yang login, sebagai nelayan maupun pembeli. Sekali per request: halaman dan
 * helper-nya (mis. loadRiwayat) yang sama-sama memanggilnya berbagi satu query. Antar request dibaca dari cache
 * server (lib/supabase/cached.ts); aksi transaksi mengosongkan tag kedua pihaknya.
 */
export const getMyTransactions = cache(async (): Promise<TransactionWithCatch[]> => {
    const result = await cachedForUser(
        'my-transactions',
        { tags: (userId) => [cacheTags.transactions(userId)], revalidate: REVALIDATE.transactions },
        async (supabase) => {
            const { data, error } = await supabase
                .from('transactions')
                .select(`*, catches(${TRANSACTION_CATCH_COLUMNS})`)
                .order('created_at', { ascending: false })

            if (error) throw new Error(`Gagal ambil transaksi: ${error.message}`)
            return (data ?? []) as TransactionWithCatch[]
        }
    )
    return result?.data ?? []
})

export async function getTransactionById(id: string): Promise<TransactionWithCatch | null> {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('transactions')
        .select(`*, catches(${TRANSACTION_CATCH_COLUMNS})`)
        .eq('id', id)
        .maybeSingle()

    if (error) throw new Error(`Gagal ambil transaksi: ${error.message}`)
    return data as TransactionWithCatch | null
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

export type CancelOutcome = 'relisted' | 'expired' | 'cancelled'

/**
 * Batalkan transaksi yang masih berjalan, lewat fungsi SQL `cancel_transaction`
 * (supabase/cancel-transaction.sql): transaksi jadi CANCELLED dan batch-nya
 * kembali ke marketplace dengan batas waktu lamanya. Melempar 'not_in_progress'
 * kalau transaksinya sudah selesai atau dibatalkan.
 */
export async function cancelTransaction(transactionId: string): Promise<CancelOutcome> {
    const supabase = await createClient()
    const { data, error } = await supabase.rpc('cancel_transaction', { p_transaction_id: transactionId })

    if (error) throw new Error(error.message)
    return data as CancelOutcome
}

/**
 * Ubah data pengambilan dari sisi pembeli: jadwal (`delivery_scheduled_at`) atau konfirmasi batch sudah diterima
 * (`pembeli_confirmed_at`, dari supabase/pickup-confirmation.sql). Hanya transaksi milik pembeli ini yang masih
 * berjalan yang tersentuh; false kalau tidak ada (sudah selesai, dibatalkan, atau bukan miliknya).
 */
export async function updatePickup(
    transactionId: string,
    pembeliId: string,
    changes: { delivery_scheduled_at?: string; pembeli_confirmed_at?: string }
): Promise<boolean> {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('transactions')
        .update(changes)
        .eq('id', transactionId)
        .eq('pembeli_id', pembeliId)
        .not('status', 'in', '(COMPLETED,CANCELLED)')
        .select('id')

    if (error) throw new Error(`Gagal ubah pengambilan: ${error.message}`)
    return (data ?? []).length > 0
}
