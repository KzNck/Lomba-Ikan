// lib/pembeli/dashboard.ts
//
// Merakit data dashboard pembeli: rekomendasi batch dan ringkasan aktivitas.

import type { ProductCardContent } from '@/components/pembeli/product-card'
import type { ActivityStatContent } from '@/components/pembeli/activity-stat'
import { MARKETPLACE_PATH } from '@/components/pembeli/marketplace-content'
import { getTranslations } from 'next-intl/server'
import type { Translator } from '@/lib/i18n/translator'
import { loadBatches, type Batch } from '@/lib/marketplace/batches'
import { getMyTransactions, type TransactionWithCatch } from '@/lib/supabase/transactions'
import { requireProfile } from '@/lib/supabase/auth'
import { displayNameFor } from '@/lib/supabase/display-name'
import { parseMarketplaceQuery, selectBatches } from '@/components/pembeli/marketplace-query'
import type { MarketplaceDefaults } from '@/components/pembeli/marketplace-content'
import { getPreferenceValues, marketplaceDefaults } from '@/lib/pembeli/preferences'

export type PembeliDashboardData = {
    greeting: string
    user: { name: string; role: string }
    recommendations: ProductCardContent[]
    activity: ActivityStatContent[]
}

type HomeT = Translator<'dashboard.pembeli.home'>

/**
 * Enam batch untuk "Rekomendasi sesuai preferensi Anda": yang lolos filter Preferensi pembeli, diurutkan seperti
 * marketplace yang terbuka dengan preferensi itu (PPI prioritas dulu, lalu yang terdekat). Tanpa satu pun yang cocok,
 * batch terdekat yang masih tersedia — panel ini tidak dibiarkan kosong selama marketplace berisi.
 */
function topRecommendations(t: HomeT, batches: Batch[], defaults: MarketplaceDefaults): ProductCardContent[] {
    const available = batches.filter((batch) => batch.status !== 'sold')
    const matching = selectBatches(available, parseMarketplaceQuery({}, defaults))
    const picks = matching.length > 0 ? matching : [...available].sort((a, b) => (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity))
    return picks.slice(0, 6).map((batch) => ({ ...batch, actionLabel: t('viewDetail') }))
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

export async function loadPembeliDashboard(): Promise<PembeliDashboardData> {
    // Loaded together; RLS scopes the data, and the role check redirects if it fails.
    const [profile, batches, transactions, preferences] = await Promise.all([
        requireProfile('pembeli'),
        loadBatches(),
        getMyTransactions(),
        getPreferenceValues(),
    ])
    const [name, t, nav] = await Promise.all([
        displayNameFor(profile),
        getTranslations('dashboard.pembeli.home'),
        getTranslations('nav'),
    ])

    return {
        greeting: name,
        user: { name, role: nav('roles.pembeli') },
        recommendations: topRecommendations(t, batches, marketplaceDefaults(preferences)),
        activity: activityStats(t, transactions),
    }
}

/** Link "Lihat serupa" untuk batch yang sudah terjual. */
export function similarHref(category: string): string {
    return `${MARKETPLACE_PATH}?jenis=${encodeURIComponent(category)}`
}
