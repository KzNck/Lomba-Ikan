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
import { getListedCatches, getMyCatches } from '@/lib/supabase/catches'
import { getMyTransactions, type TransactionWithCatch } from '@/lib/supabase/transactions'
import { getNotificationSettings, type NotificationTopic } from '@/lib/notification-settings'
import { getPreferenceValues, marketplaceDefaults } from '@/lib/pembeli/preferences'
import { GRADES, type MarketplaceDefaults } from '@/components/pembeli/marketplace-content'
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
// A notification before its "2 jam yang lalu", with the Akun › Notifikasi group that can switch it off.
type Item = Omit<NotificationEntry, 'time'> & { topic: NotificationTopic }

const DAY = 24 * 60 * 60 * 1000
// Kejadian lebih lama dari ini tidak lagi ditampilkan.
const WINDOW = 30 * DAY
const LIMIT = 20
const EXPIRING_WITHIN = 3 * 60 * 60 * 1000

/** Nama cookie per akun, supaya dua akun di satu browser tidak berbagi status baca. */
export const notificationsSeenCookie = (userId: string) => `notif_seen_${userId}`

const time = (iso: string | null | undefined) => (iso ? new Date(iso).getTime() : NaN)
// "23 Sep 2026, 14.30".
const dateTime = ({ format }: Presenter, iso: string) => `${format.dateTime(new Date(iso), 'day')}, ${format.dateTime(new Date(iso), 'time')}`

/** "Tongkol 12 kg" — nama dan berat batch yang dibicarakan. */
function subject(p: Presenter, t: NotificationsT, species: string | undefined, kg: number | null | undefined): string {
    const name = species ? categoryLabel(p, species) : t('yourCatch')
    return kg === null || kg === undefined ? name : `${name} ${formatWeight(p, kg)}`
}

function nelayanItems(p: Presenter, t: NotificationsT, catches: Catch[], transactions: TransactionWithCatch[], now: Date) {
    const byId = new Map(catches.map((entry) => [entry.id, entry]))
    const items: Item[] = []
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
            topic: 'sales',
            tone: 'info',
            icon: 'shopping-cart',
            title: t('nelayan.claimedTitle'),
            description: t('nelayan.claimed', { subject: estimate, price: formatRupiah(p, Number(tx.estimated_total)) }),
            at: time(tx.created_at),
            href: href(tx),
        })

        // Pickup (designv2 §9). The schedule has no timestamp of its own; the row's last change before the buyer's
        // confirmation or the handover is when it was set, near enough for ordering.
        if (tx.delivery_scheduled_at) {
            const later = [tx.pembeli_confirmed_at, tx.handover_confirmed_at].map(time).filter(Number.isFinite)
            items.push({
                id: `scheduled-${tx.id}`,
                topic: 'sales',
                tone: 'info',
                icon: 'calendar',
                title: t('nelayan.scheduledTitle'),
                description: t('nelayan.scheduled', { subject: estimate, time: dateTime(p, tx.delivery_scheduled_at) }),
                at: later.length > 0 ? Math.min(time(tx.updated_at), ...later) - 1000 : time(tx.updated_at),
                href: href(tx),
            })
        }
        if (tx.pembeli_confirmed_at) {
            items.push({
                id: `received-${tx.id}`,
                topic: 'sales',
                tone: 'success',
                icon: 'package-check',
                title: t('nelayan.receivedTitle'),
                description: t(tx.status === 'COMPLETED' ? 'nelayan.receivedDone' : 'nelayan.received', { subject: estimate }),
                at: time(tx.pembeli_confirmed_at),
                href: href(tx),
            })
        }

        if (tx.status === 'COMPLETED') {
            items.push({
                id: `completed-${tx.id}`,
                topic: 'sales',
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
                topic: 'sales',
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
                topic: 'listings',
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
                topic: 'listings',
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
                topic: 'listings',
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
    const items: Item[] = []

    for (const tx of transactions) {
        const href = `/pembeli/riwayat?transaksi=${tx.id}`
        const species = tx.catches?.species
        const estimate = subject(p, t, species, tx.catches?.weight_kg)

        items.push({
            id: `claimed-${tx.id}`,
            topic: 'orders',
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
                topic: 'orders',
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
                topic: 'orders',
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

// "A1" freshest … "B3" least fresh, as the marketplace's grade filter reads it.
const gradeRank = (grade: string | null) => (grade ? GRADES.indexOf(grade as (typeof GRADES)[number]) : -1)

/** Listing yang cocok dengan Preferensi pembeli, dengan aturan yang sama seperti filter awal marketplace-nya. */
function matchesPreferences(entry: Catch, { categories, maxGrade, priorityPpis }: MarketplaceDefaults) {
    if (categories.length > 0 && !categories.includes(entry.species)) return false
    if (maxGrade && (gradeRank(entry.freshness_grade) < 0 || gradeRank(entry.freshness_grade) > gradeRank(maxGrade))) return false
    if (priorityPpis.length > 0 && !priorityPpis.includes(entry.catch_location)) return false
    return true
}

// Enough new listings to act on, without pushing order updates out of the list.
const NEW_LISTINGS_LIMIT = 8

/** Listing baru sesuai Preferensi (PRD story 6): muncul selama masih bisa dibeli, terbaru dulu. */
function newListingItems(p: Presenter, t: NotificationsT, listed: Catch[], defaults: MarketplaceDefaults): Item[] {
    return listed
        .filter((entry) => entry.listed_at && matchesPreferences(entry, defaults))
        .slice(0, NEW_LISTINGS_LIMIT)
        .map((entry) => ({
            id: `new-listing-${entry.id}`,
            topic: 'newListings' as const,
            tone: 'info' as const,
            icon: 'fish' as const,
            title: t('pembeli.newListingTitle'),
            description: t('pembeli.newListing', {
                subject: subject(p, t, entry.species, entry.weight_kg),
                grade: gradeLabel(p, entry.freshness_grade),
                price: formatRupiah(p, entry.price_per_kg),
                place: entry.catch_location,
            }),
            at: time(entry.listed_at),
            href: `/marketplace/${entry.id}`,
        }))
}

/** Notifikasi user yang login, untuk layout area `role`. */
export async function loadNotifications(role: Role, userId: string): Promise<NotificationFeed> {
    const [transactions, catches, listed, preferences, settings, p, t, store] = await Promise.all([
        getMyTransactions(),
        role === 'nelayan' ? getMyCatches() : Promise.resolve([]),
        role === 'pembeli' ? getListedCatches() : Promise.resolve([]),
        role === 'pembeli' ? getPreferenceValues() : null,
        getNotificationSettings(),
        getPresenter(),
        getTranslations('notifications'),
        cookies(),
    ])
    const now = new Date()
    const raw = (
        role === 'nelayan'
            ? nelayanItems(p, t, catches, transactions, now)
            : [
                  ...pembeliItems(p, t, transactions),
                  ...(preferences ? newListingItems(p, t, listed, marketplaceDefaults(preferences)) : []),
              ]
    ).filter((item) => settings[item.topic])
    const cookieName = notificationsSeenCookie(userId)
    const seenAt = Number(store.get(cookieName)?.value) || 0

    const items = raw
        .filter((item) => Number.isFinite(item.at) && item.at <= now.getTime() && now.getTime() - item.at <= WINDOW)
        .sort((a, b) => b.at - a.at)
        .slice(0, LIMIT)
        .map((item) => ({ ...item, time: timeAgo(p, new Date(item.at).toISOString(), now) }))

    return { items, seenAt, cookieName }
}
