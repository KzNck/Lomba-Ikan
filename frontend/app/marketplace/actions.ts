'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { requireProfile } from '@/lib/supabase/auth'
import { getCatchById } from '@/lib/supabase/catches'
import { claimCatch } from '@/lib/supabase/transactions'

/**
 * Beli satu batch. `slug` dari form adalah id row `catches`.
 *
 * Nilainya dihitung ulang di server dari row-nya, bukan diambil dari form —
 * harga yang dikirim client tidak boleh menentukan berapa dana escrow yang
 * ditahan. Penulisan transaksinya sendiri dikerjakan Edge Function
 * `process-escrow` dengan service role.
 *
 * Kalau batch-nya sudah keburu diklaim pembeli lain, ini tidak melempar error:
 * Next.js menyembunyikan pesan error Server Action di production, jadi yang
 * terlihat cuma halaman error tanpa jalan keluar. Pembeli dikembalikan ke
 * marketplace, tempat batch itu sudah tidak ada lagi di daftar.
 */
export async function buyBatch(formData: FormData): Promise<void> {
    await requireProfile('pembeli')

    const catchId = String(formData.get('slug') ?? '')
    const entry = catchId ? await getCatchById(catchId) : null

    // RLS menyembunyikan tangkapan yang tidak berstatus LISTED dari pembeli,
    // jadi row yang hilang dan row yang sudah diklaim sama-sama berakhir di sini.
    if (!entry || entry.status !== 'LISTED') {
        revalidatePath('/marketplace')
        redirect('/marketplace')
    }

    await claimCatch(catchId, Number(entry.weight_kg) * Number(entry.price_per_kg ?? 0))

    revalidatePath('/marketplace')
    revalidatePath('/pembeli')
    redirect('/pembeli')
}
