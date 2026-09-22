'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { getTranslations } from 'next-intl/server'
import { requireProfile } from '@/lib/supabase/auth'
import { cancelTransaction } from '@/lib/supabase/transactions'

export type CancelReservationState = {
    error?: string
}

// Where each role's history lives; the form sends the exact view to return to.
const HISTORY = ['/nelayan/riwayat', '/pembeli/riwayat']

/**
 * "Batalkan pesanan" / "Batalkan reservasi" in either history drawer. Both the buyer and the fisher of a transaction
 * that is still in progress can cancel it; cancel_transaction (supabase/cancel-transaction.sql) checks that, marks it
 * cancelled and puts the batch back on the marketplace.
 */
export async function cancelReservation(
    _previous: CancelReservationState,
    formData: FormData
): Promise<CancelReservationState> {
    const profile = await requireProfile()
    const t = await getTranslations('dashboard.riwayat.cancel')

    const id = String(formData.get('id') ?? '')
    if (!id) return { error: t('notActive') }

    try {
        await cancelTransaction(id)
    } catch (error) {
        const message = (error as Error).message
        // Already finished or cancelled, or not this user's: nothing left to cancel.
        if (message.includes('not_in_progress') || message.includes('not_found')) return { error: t('notActive') }
        console.error('cancelReservation:', error)
        return { error: t('failed') }
    }

    // The batch is back on the marketplace, and both sides' dashboards and histories changed.
    revalidatePath('/marketplace', 'layout')
    revalidatePath('/nelayan', 'layout')
    revalidatePath('/pembeli', 'layout')

    const back = String(formData.get('kembali') ?? '')
    const home = HISTORY.find((path) => back === path || back.startsWith(`${path}?`))
    redirect(home ? back : `/${profile.role === 'nelayan' ? 'nelayan' : 'pembeli'}/riwayat?transaksi=${id}`)
}
