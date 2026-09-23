/**
 * Edge Function: confirm-handover
 *
 * Dipanggil dari lib/supabase/transactions.ts -> confirmHandover()
 *
 * Alur: scan QR nelayan di dermaga -> rekonsiliasi berat & nilai ->
 *       tandai COMPLETED -> "cairkan" dana ke rekening BRI nelayan.
 *
 * Catatan: bagian disbursement di sini masih placeholder (belum
 * terhubung ke payment gateway/bank API asli). Untuk hackathon,
 * cukup catat disbursed_at sebagai bukti alur selesai.
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

Deno.serve(async (req) => {
  try {
    const token = req.headers.get('Authorization')?.replace(/^Bearer\s+/i, '')
    if (!token) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 })
    }

    // Tanpa header Authorization user: kalau dipasang di global headers, query
    // berjalan sebagai user itu (kena RLS, yang sejak transactions-lockdown.sql
    // hanya mengizinkan baca), bukan sebagai service role. Pemanggil tetap
    // dicek di bawah: hanya nelayan atau pembeli transaksinya.
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 })
    }

    const { qr_scan_code, final_weight_kg } = await req.json()

    if (typeof final_weight_kg !== 'number' || !(final_weight_kg > 0)) {
      return new Response(JSON.stringify({ message: 'Berat akhir tidak valid' }), { status: 400 })
    }

    // Cari transaksi berdasarkan QR code
    const { data: transaction, error: txError } = await supabase
      .from('transactions')
      .select('*, catches(*)')
      .eq('qr_scan_code', qr_scan_code)
      .single()

    if (txError || !transaction) {
      return new Response(JSON.stringify({ message: 'QR code tidak valid' }), { status: 404 })
    }

    // Klien service role melewati RLS, jadi cek di sini: hanya nelayan atau pembeli
    // transaksi ini yang boleh menyelesaikannya.
    if (user.id !== transaction.nelayan_id && user.id !== transaction.pembeli_id) {
      return new Response(JSON.stringify({ message: 'Forbidden' }), { status: 403 })
    }

    if (transaction.status === 'COMPLETED') {
      return new Response(JSON.stringify({ message: 'Transaksi sudah selesai' }), {
        status: 409,
      })
    }

    if (transaction.status === 'CANCELLED') {
      return new Response(JSON.stringify({ message: 'Transaksi sudah dibatalkan' }), {
        status: 409,
      })
    }

    // Rekonsiliasi nilai akhir berdasarkan berat aktual
    const pricePerKg = transaction.catches.price_per_kg ?? 0
    const finalTotal = final_weight_kg * pricePerKg

    const now = new Date().toISOString()

    // Update transaction: rekonsiliasi + handover + disbursement
    const { data: updated, error: updateError } = await supabase
      .from('transactions')
      .update({
        status: 'COMPLETED',
        final_weight_kg,
        final_total: finalTotal,
        weighing_done_at: now,
        handover_confirmed_at: now,
        disbursed_at: now, // placeholder — integrasikan API bank di sini nanti
      })
      .eq('id', transaction.id)
      .select()
      .single()

    if (updateError) {
      return new Response(JSON.stringify({ message: 'Gagal update transaksi' }), {
        status: 500,
      })
    }

    // Update catch status -> COMPLETED
    await supabase.from('catches').update({ status: 'COMPLETED' }).eq('id', transaction.catch_id)

    return new Response(JSON.stringify(updated), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (err) {
    console.error('confirm-handover error:', err)
    return new Response(JSON.stringify({ message: 'Internal error' }), { status: 500 })
  }
})