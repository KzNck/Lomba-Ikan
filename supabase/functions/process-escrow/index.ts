/**
 * Edge Function: process-escrow
 *
 * Dipanggil dari lib/supabase/transactions.ts -> claimCatch()
 *
 * Kenapa Edge Function, bukan langsung dari client:
 * - Perlu update `catches.status` DAN insert ke `transactions` sekaligus (atomik)
 * - Perlu generate qr_scan_code yang tidak boleh bisa dimanipulasi dari client
 * - Perlu validasi catch masih LISTED & belum expired sebelum diklaim
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

    const { catch_id, estimated_total } = await req.json()

    // Service role client untuk operasi yang perlu bypass RLS
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

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

    if (catchRow.expires_at && new Date(catchRow.expires_at) < new Date()) {
      return new Response(JSON.stringify({ message: 'Waktu klaim sudah habis' }), {
        status: 409,
      })
    }

    // Generate QR code unik untuk serah terima nanti
    const qrScanCode = crypto.randomUUID()

    // Update catch status -> CLAIMED
    const { error: updateError } = await supabase
      .from('catches')
      .update({ status: 'CLAIMED' })
      .eq('id', catch_id)

    if (updateError) {
      return new Response(JSON.stringify({ message: 'Gagal update status tangkapan' }), {
        status: 500,
      })
    }

    // Insert transaction baru
    const { data: transaction, error: txError } = await supabase
      .from('transactions')
      .insert({
        catch_id,
        pembeli_id: user.id,
        nelayan_id: catchRow.nelayan_id,
        status: 'ESCROW_PENDING',
        estimated_total,
        qr_scan_code: qrScanCode,
        ppi_location: catchRow.catch_location,
      })
      .select()
      .single()

    if (txError) {
      // Rollback status catch kalau insert transaction gagal
      await supabase.from('catches').update({ status: 'LISTED' }).eq('id', catch_id)
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