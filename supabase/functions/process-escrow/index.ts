/**
 * Edge Function: process-escrow
 *
 * Dipanggil dari lib/supabase/transactions.ts -> claimCatch()
 *
 * Kenapa Edge Function, bukan langsung dari client:
 * - Perlu update `catches.status` DAN insert ke `transactions` sekaligus
 * - Perlu generate qr_scan_code yang tidak boleh bisa dimanipulasi dari client
 * - Perlu validasi pemanggil pembeli, dan catch masih LISTED & belum expired
 *
 * Nilai transaksi dihitung di sini dari row tangkapan (berat × harga/kg),
 * bukan diambil dari request.
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { crypto } from 'https://deno.land/std@0.208.0/crypto/mod.ts'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

Deno.serve(async (req) => {
  try {
    // Verifikasi user dari JWT yang dikirim frontend
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 })
    }

    const supabaseAuth = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
      global: { headers: { Authorization: authHeader } },
    })

    const {
      data: { user },
      error: authError,
    } = await supabaseAuth.auth.getUser()

    if (authError || !user) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 })
    }

    const { catch_id } = await req.json()

    // Service role client untuk operasi yang perlu bypass RLS
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

    // Hanya akun pembeli yang boleh mengklaim.
    const { data: buyer } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle()
    if (buyer?.role !== 'pembeli') {
      return new Response(JSON.stringify({ message: 'Forbidden' }), { status: 403 })
    }

    // Validasi: catch harus LISTED dan belum expired
    const { data: catchRow, error: catchError } = await supabase
      .from('catches')
      .select('*')
      .eq('id', catch_id)
      .single()

    if (catchError || !catchRow) {
      return new Response(JSON.stringify({ message: 'Tangkapan tidak ditemukan' }), {
        status: 404,
      })
    }

    if (catchRow.status !== 'LISTED') {
      return new Response(
        JSON.stringify({ message: 'Tangkapan sudah tidak tersedia untuk diklaim' }),
        { status: 409 }
      )
    }

    const now = new Date().toISOString()
    if (catchRow.expires_at && catchRow.expires_at < now) {
      return new Response(JSON.stringify({ message: 'Waktu klaim sudah habis' }), {
        status: 409,
      })
    }

    // Klaim dalam satu UPDATE bersyarat: kalau dua pembeli menekan "Beli" bersamaan,
    // hanya satu yang masih menemukan row berstatus LISTED.
    const { data: claimed, error: updateError } = await supabase
      .from('catches')
      .update({ status: 'CLAIMED' })
      .eq('id', catch_id)
      .eq('status', 'LISTED')
      .gt('expires_at', now)
      .select('id')
      .maybeSingle()

    if (updateError) {
      return new Response(JSON.stringify({ message: 'Gagal update status tangkapan' }), {
        status: 500,
      })
    }
    if (!claimed) {
      return new Response(
        JSON.stringify({ message: 'Tangkapan sudah tidak tersedia untuk diklaim' }),
        { status: 409 }
      )
    }

    // Insert transaction baru
    const { data: transaction, error: txError } = await supabase
      .from('transactions')
      .insert({
        catch_id,
        pembeli_id: user.id,
        nelayan_id: catchRow.nelayan_id,
        status: 'ESCROW_PENDING',
        estimated_total: Number(catchRow.weight_kg) * Number(catchRow.price_per_kg ?? 0),
        qr_scan_code: crypto.randomUUID(),
        ppi_location: catchRow.catch_location,
      })
      .select()
      .single()

    if (txError) {
      // Rollback status catch kalau insert transaction gagal. Trigger set_catch_expiry memberi
      // 48 jam baru saat status kembali LISTED, jadi batas waktu aslinya dipasang lagi sesudahnya.
      await supabase.from('catches').update({ status: 'LISTED' }).eq('id', catch_id)
      await supabase
        .from('catches')
        .update({ listed_at: catchRow.listed_at, expires_at: catchRow.expires_at })
        .eq('id', catch_id)
      return new Response(JSON.stringify({ message: 'Gagal buat transaksi' }), { status: 500 })
    }

    return new Response(JSON.stringify(transaction), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (err) {
    console.error('process-escrow error:', err)
    return new Response(JSON.stringify({ message: 'Internal error' }), { status: 500 })
  }
})
