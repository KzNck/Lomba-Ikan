// lib/pembeli/dashboard.ts
//
// Merakit data dashboard pembeli: rekomendasi batch, notifikasi dari transaksi,
// dan ringkasan aktivitas.

import type { ProductCardContent } from '@/components/pembeli/product-card'
import type { NotificationItemContent } from '@/components/pembeli/notification-item'
import type { ActivityStatContent } from '@/components/pembeli/activity-stat'
import { MARKETPLACE_PATH } from '@/components/pembeli/marketplace-content'
import { categoryLabel, formatRupiah, timeAgo, type Presenter } from '@/lib/catches/present'
import { getPresenter } from '@/lib/i18n/presenter'
import { loadBatches, type Batch } from '@/lib/marketplace/batches'
import { getMyTransactions } from '@/lib/supabase/transactions'
import { requireProfile } from '@/lib/supabase/auth'
import { displayNameFor } from '@/lib/supabase/display-name'
import type { Catch, Transaction } from '@/types/database'

export type PembeliDashboardData = {
    greeting: string
    user: { name: string; role: string }
    recommendations: ProductCardContent[]
    notifications: NotificationItemContent[]
    activity: ActivityStatContent[]
}

const NOTIFICATIONS_PATH = '/pembeli/notifikasi'

/** Enam batch teratas: yang terdekat dulu, lalu yang paling segar. */
function topRecommendations(batches: Batch[]): ProductCardContent[] {
    return [...batches]
        .sort((a, b) => (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity))
        .slice(0, 6)
        .map((batch) => ({ ...batch, actionLabel: 'Lihat detail' }))
}

/** Perubahan dibanding periode sebelumnya, ditulis "+3" / "-2" / "0". */
function delta(now: number, before: number): string {
    const change = now - before
    return change > 0 ? `+${change}` : String(change)
}

const DAY = 24 * 60 * 60 * 1000

function activityStats(transactions: (Transaction & { catches: Catch | null })[]): ActivityStatContent[] {
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
            label: 'Penawaran Aktif',
            value: String(pending.length),
            delta: delta(pending.length, pendingYesterday.length),
            caption: 'dari kemarin',
        },
        {
            icon: 'file-text',
            label: 'Transaksi Berjalan',
            value: String(running.length),
            delta: delta(running.length, runningYesterday.length),
            caption: 'dari kemarin',
        },
        {
            icon: 'history',
            label: 'Total Transaksi (30 hari)',
            value: String(lastMonth.length),
            delta: delta(lastMonth.length, monthBefore.length),
            caption: 'dari bulan lalu',
        },
    ]
}

/**
 * Belum ada tabel notifikasi, jadi daftarnya disusun dari transaksi pembeli
 * sendiri — status terakhir tiap transaksi, terbaru di atas.
 */
const STATUS_NOTE: Record<Transaction['status'], { icon: NotificationItemContent['icon']; title: string }> = {
    ESCROW_PENDING: { icon: 'tag', title: 'Menunggu Escrow' },
    ESCROW_HELD: { icon: 'file-text', title: 'Dana Escrow Ditahan' },
    DELIVERY_SCHEDULED: { icon: 'truck', title: 'Pengiriman Dijadwalkan' },
    WEIGHING_DONE: { icon: 'file-text', title: 'Penimbangan Selesai' },
    RECONCILED: { icon: 'file-text', title: 'Rekonsiliasi Selesai' },
    COMPLETED: { icon: 'truck', title: 'Transaksi Selesai' },
    CANCELLED: { icon: 'info', title: 'Transaksi Dibatalkan' },
}

function notifications(
    p: Presenter,
    transactions: (Transaction & { catches: Catch | null })[]
): NotificationItemContent[] {
    return transactions.slice(0, 4).map((tx) => {
        const note = STATUS_NOTE[tx.status]
        const name = tx.catches ? categoryLabel(p, tx.catches.species) : 'Batch'
        return {
            href: NOTIFICATIONS_PATH,
            icon: note.icon,
            title: note.title,
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
    const name = await displayNameFor(profile)

    return {
        greeting: name,
        user: { name, role: 'Pembeli' },
        recommendations: topRecommendations(batches),
        notifications: notifications(p, transactions),
        activity: activityStats(transactions),
    }
}

/** Link "Lihat serupa" untuk batch yang sudah terjual. */
export function similarHref(category: string): string {
    return `${MARKETPLACE_PATH}?jenis=${encodeURIComponent(category)}`
}
