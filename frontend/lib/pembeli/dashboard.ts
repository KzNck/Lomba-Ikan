// lib/pembeli/dashboard.ts
//
// Merakit data dashboard pembeli: rekomendasi batch, notifikasi dari transaksi,
// dan ringkasan aktivitas.

import type { ProductCardContent } from '@/components/pembeli/product-card'
import type { NotificationItemContent } from '@/components/pembeli/notification-item'
import type { ActivityStatContent } from '@/components/pembeli/activity-stat'
import { MARKETPLACE_PATH } from '@/components/pembeli/marketplace-content'
import { categoryLabel, formatRupiah, timeAgo, type Presenter } from '@/lib/catches/present'
import { getTranslations } from 'next-intl/server'
import { getPresenter } from '@/lib/i18n/presenter'
import type { Translator } from '@/lib/i18n/translator'
import { loadBatches, type Batch } from '@/lib/marketplace/batches'
import { getMyTransactions, type TransactionWithCatch } from '@/lib/supabase/transactions'
import { requireProfile } from '@/lib/supabase/auth'
import { displayNameFor } from '@/lib/supabase/display-name'
import type { Transaction } from '@/types/database'

export type PembeliDashboardData = {
    greeting: string
    user: { name: string; role: string }
    recommendations: ProductCardContent[]
    notifications: NotificationItemContent[]
    activity: ActivityStatContent[]
}

const NOTIFICATIONS_PATH = '/pembeli/notifikasi'

type HomeT = Translator<'dashboard.pembeli.home'>

/** Enam batch teratas: yang terdekat dulu, lalu yang paling segar. */
function topRecommendations(t: HomeT, batches: Batch[]): ProductCardContent[] {
    return [...batches]
        .sort((a, b) => (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity))
        .slice(0, 6)
        .map((batch) => ({ ...batch, actionLabel: t('viewDetail') }))
}

/** Perubahan dibanding periode sebelumnya, ditulis "+3" / "-2" / "0". */
function delta(now: number, before: number): string {
    const change = now - before
    return change > 0 ? `+${change}` : String(change)
}

const DAY = 24 * 60 * 60 * 1000

function activityStats(t: HomeT, transactions: TransactionWithCatch[]): ActivityStatContent[] {
    const now = Date.now()
    const since = (from: number, to: number) =>
        transactions.filter((tx) => {
            const at = new Date(tx.created_at).getTime()
            return at >= from && at < to
        })

    // "Berjalan" = sudah diklaim tapi belum selesai atau dibatalkan.
    const running = transactions.filter(
        (tx) => tx.status !== 'COMPLETED' && tx.status !== 'CANCELLED'
    )
    const runningYesterday = running.filter((tx) => new Date(tx.created_at).getTime() < now - DAY)

    const lastMonth = since(now - 30 * DAY, now)
    const monthBefore = since(now - 60 * DAY, now - 30 * DAY)

    const pending = transactions.filter((tx) => tx.status === 'ESCROW_PENDING')
    const pendingYesterday = pending.filter((tx) => new Date(tx.created_at).getTime() < now - DAY)

    return [
        {
            icon: 'tag',
            label: t('activeOffers'),
            value: String(pending.length),
            delta: delta(pending.length, pendingYesterday.length),
            caption: t('fromYesterday'),
        },
        {
            icon: 'file-text',
            label: t('runningTransactions'),
            value: String(running.length),
            delta: delta(running.length, runningYesterday.length),
            caption: t('fromYesterday'),
        },
        {
            icon: 'history',
            label: t('totalTransactions'),
            value: String(lastMonth.length),
            delta: delta(lastMonth.length, monthBefore.length),
            caption: t('fromLastMonth'),
        },
    ]
}

/**
 * Belum ada tabel notifikasi, jadi daftarnya disusun dari transaksi pembeli
 * sendiri — status terakhir tiap transaksi, terbaru di atas.
 */
const STATUS_ICON: Record<Transaction['status'], NotificationItemContent['icon']> = {
    ESCROW_PENDING: 'tag',
    ESCROW_HELD: 'file-text',
    DELIVERY_SCHEDULED: 'truck',
    WEIGHING_DONE: 'file-text',
    RECONCILED: 'file-text',
    COMPLETED: 'truck',
    CANCELLED: 'info',
}

function notifications(
    p: Presenter,
    t: HomeT,
    transactions: TransactionWithCatch[]
): NotificationItemContent[] {
    return transactions.slice(0, 4).map((tx) => {
        const name = tx.catches ? categoryLabel(p, tx.catches.species) : t('batch')
        return {
            id: tx.id,
            href: NOTIFICATIONS_PATH,
            icon: STATUS_ICON[tx.status],
            title: t(`status.${tx.status}`),
            description: `${name} · ${formatRupiah(p, Number(tx.final_total ?? tx.estimated_total))}`,
            time: timeAgo(p, tx.updated_at),
        }
    })
}

export async function loadPembeliDashboard(): Promise<PembeliDashboardData> {
    // Loaded together; RLS scopes the data, and the role check redirects if it fails.
    const [profile, batches, transactions, p] = await Promise.all([
        requireProfile('pembeli'),
        loadBatches(),
        getMyTransactions(),
        getPresenter(),
    ])
    const [name, t, nav] = await Promise.all([
        displayNameFor(profile),
        getTranslations('dashboard.pembeli.home'),
        getTranslations('nav'),
    ])

    return {
        greeting: name,
        user: { name, role: nav('roles.pembeli') },
        recommendations: topRecommendations(t, batches),
        notifications: notifications(p, t, transactions),
        activity: activityStats(t, transactions),
    }
}

/** Link "Lihat serupa" untuk batch yang sudah terjual. */
export function similarHref(category: string): string {
    return `${MARKETPLACE_PATH}?jenis=${encodeURIComponent(category)}`
}
