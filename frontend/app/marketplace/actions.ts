'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { getTranslations } from 'next-intl/server'
import { requireProfile } from '@/lib/supabase/auth'
import { getCatchById } from '@/lib/supabase/catches'
import { claimCatch, getTransactionContact } from '@/lib/supabase/transactions'
import { displayNameFor } from '@/lib/supabase/display-name'
import { categoryLabel, formatRupiah, formatWeight } from '@/lib/catches/present'
import { getPresenter } from '@/lib/i18n/presenter'
import { batchNumber } from '@/lib/marketplace/batches'
import { whatsappHref } from '@/lib/contact/whatsapp'

/**
 * Beli satu batch: batch-nya dipesan untuk pembeli ini, lalu pembeli langsung
 * diantar ke WhatsApp nelayannya untuk mengatur pembayaran dan serah terima.
 * `slug` dari form adalah id row `catches`.
 *
 * Pesanannya tetap dicatat di aplikasi (Edge Function `process-escrow`): batch
 * hilang dari marketplace sehingga tidak terjual dua kali, dan transaksinya
 * muncul di riwayat kedua pihak sampai nelayan mengonfirmasi serah terima.
 * Pembayaran terjadi langsung di antara mereka — aplikasi tidak menahan dana.
 *
 * Nilainya dihitung ulang di server dari row-nya, bukan diambil dari form.
 *
 * Kalau batch-nya sudah keburu diklaim pembeli lain, ini tidak melempar error:
 * Next.js menyembunyikan pesan error Server Action di production, jadi yang
 * terlihat cuma halaman error tanpa jalan keluar. Pembeli dikembalikan ke
 * marketplace, tempat batch itu sudah tidak ada lagi di daftar.
 */
export async function buyBatch(formData: FormData): Promise<void> {
    const profile = await requireProfile('pembeli')

    const catchId = String(formData.get('slug') ?? '')
    const entry = catchId ? await getCatchById(catchId) : null

    // RLS menyembunyikan tangkapan yang tidak berstatus LISTED dari pembeli,
    // jadi row yang hilang dan row yang sudah diklaim sama-sama berakhir di sini.
    if (!entry || entry.status !== 'LISTED') {
        revalidatePath('/marketplace')
        redirect('/marketplace')
    }

    const transaction = await claimCatch(catchId, Number(entry.weight_kg) * Number(entry.price_per_kg ?? 0))

    revalidatePath('/marketplace')
    revalidatePath('/pembeli', 'layout')

    // Nomor nelayan hanya terbuka untuk pembeli transaksi ini. Tanpa nomor (atau
    // tanpa fungsi SQL-nya), pembeli mendarat di riwayat pembeliannya.
    const contact = await getTransactionContact(transaction.id)
    // Pesannya untuk nelayan, jadi selalu dalam bahasa Indonesia.
    const [p, t, buyer] = await Promise.all([
        getPresenter('id'),
        getTranslations({ locale: 'id', namespace: 'dashboard.pembeli.marketplace' }),
        displayNameFor(profile),
    ])
    const price = entry.price_per_kg === null ? t('batch.auctionPrice') : t('batch.perKg', { price: formatRupiah(p, entry.price_per_kg) })
    const chat = whatsappHref(
        contact?.phone,
        t('whatsappMessage', {
            fisher: contact?.name ?? '',
            buyer,
            batch: batchNumber(entry),
            category: categoryLabel(p, entry.species),
            weight: formatWeight(p, entry.weight_kg),
            price,
            ppi: entry.catch_location,
        })
    )

    redirect(chat ?? `/pembeli/riwayat?transaksi=${transaction.id}`)
}
