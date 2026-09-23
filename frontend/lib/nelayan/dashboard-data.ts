// Angka dan daftar untuk dashboard nelayan, dihitung dari row `catches` dan
// `transactions` milik user yang login.

import type { SummaryStatContent } from '@/components/nelayan/summary-stat'
import { formatRupiah, type Presenter } from '@/lib/catches/present'
import type { Translator } from '@/lib/i18n/translator'
import type { Catch, Transaction } from '@/types/database'

/** Pesan `dashboard.nelayan.home` bahasa aktif. */
export type HomeT = Translator<'dashboard.nelayan.home'>

/** Selisih hari ini vs kemarin, misalnya "20% dari kemarin". */
function trendNote(t: HomeT, today: number, yesterday: number): Pick<SummaryStatContent, 'note' | 'trend'> {
    if (yesterday === 0) {
        return { note: today > 0 ? t('stats.firstToday') : t('stats.noneToday') }
    }
    const change = Math.round(((today - yesterday) / yesterday) * 100)
    if (change === 0) return { note: t('stats.sameAsYesterday') }
    return change > 0
        ? { note: t('stats.upFromYesterday', { percent: change }), trend: 'up' }
        : { note: t('stats.downFromYesterday', { percent: Math.abs(change) }) }
}

const startOfDay = (date: Date) => {
    const copy = new Date(date)
    copy.setHours(0, 0, 0, 0)
    return copy
}

/** Baris yang selesai pada hari kalender tertentu. */
function on(day: Date, iso: string): boolean {
    const start = startOfDay(day).getTime()
    const time = new Date(iso).getTime()
    return time >= start && time < start + 24 * 60 * 60 * 1000
}

export function summaryStats(
    p: Presenter,
    t: HomeT,
    catches: Catch[],
    transactions: Transaction[],
    now: Date = new Date()
): SummaryStatContent[] {
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    const sold = catches.filter((entry) => entry.status === 'COMPLETED')

    const weightOn = (day: Date) =>
        sold.filter((entry) => on(day, entry.updated_at)).reduce((total, entry) => total + Number(entry.weight_kg), 0)

    const settled = transactions.filter((tx) => tx.status === 'COMPLETED')
    const revenueOn = (day: Date) =>
        settled
            .filter((tx) => on(day, tx.updated_at))
            // Nilai akhir baru ada setelah rekonsiliasi; sebelum itu pakai estimasi.
            .reduce((total, tx) => total + Number(tx.final_total ?? tx.estimated_total), 0)

    const soldToday = weightOn(now)
    const revenueToday = revenueOn(now)

    // By-catch yang berhasil masuk pasar, bukan dibuang — jadi semua yang pernah
    // sampai tahap listing dihitung, bukan cuma yang laku.
    const rescued = catches
        .filter((entry) => entry.status !== 'WAITING_FOR_SYNC')
        .reduce((total, entry) => total + Number(entry.weight_kg), 0)

    return [
        {
            icon: 'fish',
            value: p.format.number(Math.round(soldToday)),
            unit: 'kg',
            label: t('stats.sold'),
            ...trendNote(t, soldToday, weightOn(yesterday)),
        },
        {
            icon: 'coins',
            value: formatRupiah(p, revenueToday),
            label: t('stats.revenue'),
            ...trendNote(t, revenueToday, revenueOn(yesterday)),
        },
        {
            icon: 'recycle',
            value: p.format.number(Math.round(rescued)),
            unit: 'kg',
            label: t('stats.rescued'),
            note: t('stats.rescuedNote'),
        },
    ]
}

/**
 * "Selamat pagi" / "siang" / "sore" / "malam" menurut jam WIB — server Vercel
 * berjalan di UTC, jadi jam lokal servernya tidak bisa dipakai.
 */
export function greetingFor(t: HomeT, name: string, now: Date = new Date()): string {
    const hour = Number(
        new Intl.DateTimeFormat('en-GB', { hour: 'numeric', hourCycle: 'h23', timeZone: 'Asia/Jakarta' }).format(now)
    )
    const part = hour < 11 ? 'morning' : hour < 15 ? 'midday' : hour < 19 ? 'afternoon' : 'evening'
    return t('greeting', { part, name })
}

/** "Pak Dul" → "PD", untuk avatar di sidebar. */
export function initialsOf(name: string): string {
    return name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word[0]?.toUpperCase() ?? '')
        .join('')
}
