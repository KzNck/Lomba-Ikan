'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { getTranslations } from 'next-intl/server'
import { requireProfile } from '@/lib/supabase/auth'
import { cacheTags, expireTags } from '@/lib/supabase/cached'
import { cancelTransaction, getTransactionById, updatePickup } from '@/lib/supabase/transactions'

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
    // Both parties, so both sides' cached histories can be cleared. RLS returns it only to them.
    const transaction = id ? await getTransactionById(id) : null
    if (!transaction) return { error: t('notActive') }

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
    expireTags(
        cacheTags.transactions(transaction.nelayan_id),
        cacheTags.transactions(transaction.pembeli_id),
        cacheTags.catches(transaction.nelayan_id),
        cacheTags.marketplace
    )
    revalidatePath('/marketplace', 'layout')
    revalidatePath('/nelayan', 'layout')
    revalidatePath('/pembeli', 'layout')

    const back = String(formData.get('kembali') ?? '')
    const home = HISTORY.find((path) => back === path || back.startsWith(`${path}?`))
    redirect(home ? back : `/${profile.role === 'nelayan' ? 'nelayan' : 'pembeli'}/riwayat?transaksi=${id}`)
}

export type PickupState = {
    status: 'idle' | 'saved' | 'error'
    error?: string
}

// How far ahead a pickup can be set: batches don't keep for long, so a week is already generous.
const PICKUP_WINDOW_DAYS = 7

/**
 * "Jadwal pengambilan" in the buyer's transaction drawer. The form sends the chosen local time as ISO (the browser
 * knows the buyer's time zone; the server doesn't). The fisher sees it in their own drawer and notifications.
 */
export async function schedulePickup(_previous: PickupState, formData: FormData): Promise<PickupState> {
    const profile = await requireProfile('pembeli')
    const t = await getTranslations('dashboard.riwayat.pickup')

    const id = String(formData.get('id') ?? '')
    const at = new Date(String(formData.get('jadwal') ?? ''))
    const now = Date.now()
    // A little slack below now, for a time picked a minute ago that has just passed.
    if (Number.isNaN(at.getTime()) || at.getTime() < now - 60 * 60_000 || at.getTime() > now + PICKUP_WINDOW_DAYS * 86_400_000) {
        return { status: 'error', error: t('scheduleInvalid', { days: PICKUP_WINDOW_DAYS }) }
    }

    const transaction = id ? await getTransactionById(id) : null
    if (!transaction) return { status: 'error', error: t('notActive') }
    try {
        if (!(await updatePickup(id, profile.id, { delivery_scheduled_at: at.toISOString() }))) return { status: 'error', error: t('notActive') }
    } catch (error) {
        console.error('schedulePickup:', error)
        return { status: 'error', error: t('failed') }
    }

    expireTags(cacheTags.transactions(transaction.pembeli_id), cacheTags.transactions(transaction.nelayan_id))
    revalidatePath('/pembeli', 'layout')
    revalidatePath('/nelayan', 'layout')
    return { status: 'saved' }
}

/**
 * "Batch sudah diterima" in the buyer's drawer: the buyer's half of the handover. Until it is confirmed the fisher
 * can't mark the transaction done (see confirmHandover). Needs supabase/pickup-confirmation.sql.
 */
export async function confirmReceipt(_previous: PickupState, formData: FormData): Promise<PickupState> {
    const profile = await requireProfile('pembeli')
    const t = await getTranslations('dashboard.riwayat.pickup')

    const id = String(formData.get('id') ?? '')
    const transaction = id ? await getTransactionById(id) : null
    if (!transaction) return { status: 'error', error: t('notActive') }
    // Already confirmed: nothing to do, and the drawer already shows it.
    if (transaction.pembeli_confirmed_at) return { status: 'saved' }

    try {
        if (!(await updatePickup(id, profile.id, { pembeli_confirmed_at: new Date().toISOString() }))) {
            return { status: 'error', error: t('notActive') }
        }
    } catch (error) {
        console.error('confirmReceipt:', error)
        return { status: 'error', error: t('failed') }
    }

    expireTags(cacheTags.transactions(transaction.pembeli_id), cacheTags.transactions(transaction.nelayan_id))
    revalidatePath('/pembeli', 'layout')
    revalidatePath('/nelayan', 'layout')
    return { status: 'saved' }
}
