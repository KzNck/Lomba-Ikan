// lib/notifications.ts
//
// Isi dropdown notifikasi di header, untuk nelayan dan pembeli. Belum ada tabel
// notifikasi di schema, jadi daftarnya disusun dari kejadian yang memang
// tercatat di `transactions` dan `catches`. Terbaru di atas.
//
// Status "sudah dibaca" disimpan sebagai waktu terakhir dropdown dibuka, di
// cookie per akun (lihat notificationsSeenCookie) — tiap kejadian sesudah
// waktu itu dihitung belum dibaca.

import { cookies } from 'next/headers'
import { getTranslations } from 'next-intl/server'
import type { IconName } from '@/components/ui/icon'
import { categoryLabel, formatRupiah, formatWeight, gradeLabel, timeAgo, timeLeft, type Presenter } from '@/lib/catches/present'
import { getPresenter } from '@/lib/i18n/presenter'
import type { Translator } from '@/lib/i18n/translator'
import { getMyCatches } from '@/lib/supabase/catches'
import { getMyTransactions, type TransactionWithCatch } from '@/lib/supabase/transactions'
import type { Catch } from '@/types/database'

export type NotificationTone = 'success' | 'info' | 'warning'

export type NotificationEntry = {
    // Unik per baris: satu transaksi bisa muncul lagi sebagai kejadian lain (diklaim, lalu terjual).
    id: string
    tone: NotificationTone
    icon: IconName
    title: string
    description: string
    // "2 jam yang lalu"; `at` (epoch ms) dipakai untuk urutan dan status belum dibaca.
    time: string
    at: number
    href: string
}

export type NotificationFeed = {
    items: NotificationEntry[]
    // Epoch ms dropdown terakhir dibuka; 0 kalau belum pernah.
    seenAt: number
    cookieName: string
}

type Role = 'nelayan' | 'pembeli'
type NotificationsT = Translator<'notifications'>

const DAY = 24 * 60 * 60 * 1000
// Kejadian lebih lama dari ini tidak lagi ditampilkan.
const WINDOW = 30 * DAY
const LIMIT = 20
const EXPIRING_WITHIN = 3 * 60 * 60 * 1000

/** Nama cookie per akun, supaya dua akun di satu browser tidak berbagi status baca. */
export const notificationsSeenCookie = (userId: string) => `notif_seen_${userId}`

const time = (iso: string | null | undefined) => (iso ? new Date(iso).getTime() : NaN)

/** "Tongkol 12 kg" — nama dan berat batch yang dibicarakan. */
function subject(p: Presenter, t: NotificationsT, species: string | undefined, kg: number | null | undefined): string {
    const name = species ? categoryLabel(p, species) : t('yourCatch')
    return kg === null || kg === undefined ? name : `${name} ${formatWeight(p, kg)}`
}

function nelayanItems(p: Presenter, t: NotificationsT, catches: Catch[], transactions: TransactionWithCatch[], now: Date) {
    const byId = new Map(catches.map((entry) => [entry.id, entry]))
    const items: Omit<NotificationEntry, 'time'>[] = []
    const href = (tx: TransactionWithCatch) => `/nelayan/riwayat?transaksi=${tx.id}`
    // Transaksi terbaru tiap tangkapan (getMyTransactions mengurutkan dari yang terbaru).
    const latestTx = new Map<string, TransactionWithCatch>()
    for (const tx of transactions) if (!latestTx.has(tx.catch_id)) latestTx.set(tx.catch_id, tx)
    // Tujuan notifikasi sebuah tangkapan, sama seperti kartunya di Listing Saya: drawer-nya selama masih punya (aktif,
    // draft, kedaluwarsa), atau transaksinya di Riwayat kalau sudah diklaim atau terjual.
    const catchHref = (entry: Catch) => {
        const tx = latestTx.get(entry.id)
        if (entry.status === 'CLAIMED' || entry.status === 'COMPLETED') return tx ? href(tx) : '/nelayan/riwayat'
        return `/nelayan/listing?detail=${entry.id}`
    }

    for (const tx of transactions) {
        const entry = byId.get(tx.catch_id)
        const species = tx.catches?.species ?? entry?.species
        const estimate = subject(p, t, species, tx.catches?.weight_kg ?? entry?.weight_kg)

        // Klaimnya tetap tercatat sebagai kejadian sendiri, meski transaksinya kemudian selesai atau batal.
        items.push({
            id: `claimed-${tx.id}`,
            tone: 'info',
            icon: 'shopping-cart',
            title: t('nelayan.claimedTitle'),
            description: t('nelayan.claimed', { subject: estimate, price: formatRupiah(p, Number(tx.estimated_total)) }),
            at: time(tx.created_at),
            href: href(tx),
        })

        if (tx.status === 'COMPLETED') {
            items.push({
                id: `completed-${tx.id}`,
                tone: 'success',
                icon: 'coins',
                title: t('nelayan.soldTitle'),
                description: t('nelayan.sold', {
                    subject: subject(p, t, species, tx.final_weight_kg ?? tx.catches?.weight_kg),
                    price: formatRupiah(p, Number(tx.final_total ?? tx.estimated_total)),
                }),
                at: time(tx.handover_confirmed_at ?? tx.updated_at),
                href: href(tx),
            })
        } else if (tx.status === 'CANCELLED') {
            // Batch yang batal kembali ke marketplace, kecuali batas waktunya sudah lewat.
            const outcome = entry?.status === 'LISTED' ? 'cancelledRelisted' : entry?.status === 'EXPIRED' ? 'cancelledExpired' : 'cancelled'
            items.push({
                id: `cancelled-${tx.id}`,
                tone: 'warning',
                icon: 'circle-alert',
                title: t('nelayan.cancelledTitle'),
                description: t(`nelayan.${outcome}`, { subject: estimate }),
                at: time(tx.updated_at),
                href: href(tx),
            })
        }
    }

    for (const entry of catches) {
        const batch = subject(p, t, entry.species, entry.weight_kg)
        if (entry.listed_at) {
            items.push({
                id: `listed-${entry.id}`,
                tone: 'info',
                icon: 'badge-check',
                title: t('nelayan.listedTitle'),
                description: t('nelayan.listed', {
                    subject: batch,
                    grade: gradeLabel(p, entry.freshness_grade),
                    price: formatRupiah(p, entry.price_per_kg),
                }),
                at: time(entry.listed_at),
                href: catchHref(entry),
            })
        }
        if (!entry.expires_at) continue
        const expiresAt = time(entry.expires_at)
        if (entry.status === 'LISTED' && expiresAt > now.getTime() && expiresAt - now.getTime() <= EXPIRING_WITHIN) {
            items.push({
                id: `expiring-${entry.id}`,
                tone: 'warning',
                icon: 'clock',
                title: t('nelayan.expiringTitle'),
                description: t('nelayan.expiring', { subject: batch, time: timeLeft(p, entry.expires_at, now) ?? '' }),
                // Dihitung sejak listing masuk tiga jam terakhirnya, bukan "sekarang" — kalau tidak, peringatan
                // ini selalu jadi yang terbaru dan tak pernah terbaca.
                at: expiresAt - EXPIRING_WITHIN,
                href: catchHref(entry),
            })
        } else if (entry.status === 'EXPIRED') {
            items.push({
                id: `expired-${entry.id}`,
                tone: 'warning',
                icon: 'clock',
                title: t('nelayan.expiredTitle'),
                description: t('nelayan.expired', { subject: batch }),
                at: expiresAt,
                href: catchHref(entry),
            })
        }
    }
    return items
}

function pembeliItems(p: Presenter, t: NotificationsT, transactions: TransactionWithCatch[]) {
    const items: Omit<NotificationEntry, 'time'>[] = []

    for (const tx of transactions) {
        const href = `/pembeli/riwayat?transaksi=${tx.id}`
        const species = tx.catches?.species
        const estimate = subject(p, t, species, tx.catches?.weight_kg)

        items.push({
            id: `claimed-${tx.id}`,
            tone: 'info',
            icon: 'tag',
            title: t('pembeli.claimedTitle'),
            description: t(tx.ppi_location ? 'pembeli.claimedAt' : 'pembeli.claimed', {
                subject: estimate,
                price: formatRupiah(p, Number(tx.estimated_total)),
                place: tx.ppi_location ?? '',
            }),
            at: time(tx.created_at),
            href,
        })

        if (tx.status === 'COMPLETED') {
            items.push({
                id: `completed-${tx.id}`,
                tone: 'success',
                icon: 'handshake',
                title: t('pembeli.completedTitle'),
                description: t('pembeli.completed', {
                    subject: subject(p, t, species, tx.final_weight_kg ?? tx.catches?.weight_kg),
                    price: formatRupiah(p, Number(tx.final_total ?? tx.estimated_total)),
                }),
                at: time(tx.handover_confirmed_at ?? tx.updated_at),
                href,
            })
        } else if (tx.status === 'CANCELLED') {
            items.push({
                id: `cancelled-${tx.id}`,
                tone: 'warning',
                icon: 'circle-alert',
                title: t('pembeli.cancelledTitle'),
                description: t('pembeli.cancelled', { subject: estimate }),
                at: time(tx.updated_at),
                href,
            })
        }
    }
    return items
}

/** Notifikasi user yang login, untuk layout area `role`. */
export async function loadNotifications(role: Role, userId: string): Promise<NotificationFeed> {
    const [transactions, catches, p, t, store] = await Promise.all([
        getMyTransactions(),
        role === 'nelayan' ? getMyCatches() : Promise.resolve([]),
        getPresenter(),
        getTranslations('notifications'),
        cookies(),
    ])
    const now = new Date()
    const raw = role === 'nelayan' ? nelayanItems(p, t, catches, transactions, now) : pembeliItems(p, t, transactions)
    const cookieName = notificationsSeenCookie(userId)
    const seenAt = Number(store.get(cookieName)?.value) || 0

    const items = raw
        .filter((item) => Number.isFinite(item.at) && item.at <= now.getTime() && now.getTime() - item.at <= WINDOW)
        .sort((a, b) => b.at - a.at)
        .slice(0, LIMIT)
        .map((item) => ({ ...item, time: timeAgo(p, new Date(item.at).toISOString(), now) }))

    return { items, seenAt, cookieName }
}
