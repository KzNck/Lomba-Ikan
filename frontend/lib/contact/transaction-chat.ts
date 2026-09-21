// lib/contact/transaction-chat.ts
//
// Tombol "Chat di WhatsApp" di drawer riwayat, untuk transaksi yang masih
// berjalan: pembeli ke nelayannya, nelayan ke pembelinya.

import { getTranslations } from 'next-intl/server'
import { getTransactionContact } from '@/lib/supabase/transactions'
import { whatsappHref } from '@/lib/contact/whatsapp'
import type { TransactionDetailContent } from '@/lib/nelayan/riwayat'

export type TransactionChat = {
    // null when the other party has no usable number, or the contact lookup isn't set up.
    href: string | null
    label: string
    unavailable: string
}

/** Tombol chat untuk transaksi `detail`, dilihat dari sisi `role`; `me` adalah nama yang memperkenalkan diri. */
export async function transactionChat(
    detail: TransactionDetailContent,
    role: 'nelayan' | 'pembeli',
    me: string
): Promise<TransactionChat | undefined> {
    if (detail.state !== 'diproses') return undefined

    const [contact, t, message] = await Promise.all([
        getTransactionContact(detail.id),
        getTranslations('dashboard.riwayat.contact'),
        // Nelayan dan pembeli di sini saling menyapa dalam bahasa Indonesia, apa pun bahasa antarmukanya.
        getTranslations({ locale: 'id', namespace: 'dashboard.riwayat.contact' }),
    ])
    const name = contact?.name ?? detail.partner.name

    return {
        href: whatsappHref(contact?.phone, message('message', { name, me, batch: detail.batch ?? '—' })),
        label: role === 'pembeli' ? t('chatFisher') : t('chatBuyer'),
        unavailable: t('unavailable', { name }),
    }
}
