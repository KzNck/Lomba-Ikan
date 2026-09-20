// lib/nelayan/riwayat.ts
//
// Merakit data halaman "Riwayat Transaksi" dari Supabase: row `transactions`
// milik nelayan yang sudah COMPLETED atau CANCELLED, beserta tangkapannya.
//
// Nama mitra belum bisa ditampilkan: policy "profiles: self access" di
// supabase/schema.sql hanya mengizinkan tiap user membaca profilnya sendiri,
// jadi profil pembeli tidak terbaca dari sesi nelayan. Kolomnya memakai label
// pengganti sampai ada policy (atau view) yang membuka nama mitra secukupnya.

import { STATE_OF, TABLE, type StatusFilter, type TransactionState } from '@/components/nelayan/riwayat-content'
import { categoryLabel, gradeLabel, STORAGE_LABEL } from '@/lib/catches/present'
import { getMyTransactions } from '@/lib/supabase/transactions'
import { requireProfile } from '@/lib/supabase/auth'
import type { Catch, FreshnessGrade, Transaction } from '@/types/database'

/** Satu baris tabel, sudah dalam bentuk teks siap tampil. */
export type TransactionRowContent = {
    id: string
    date: string
    time: string
    partner: { name: string; type?: string; icon: 'factory' | 'building-2' }
    // Huruf di badge bulat; tangkapan yang belum dinilai tampil sebagai "—".
    gradeLetter: string
    grade: FreshnessGrade | null
    weight: string
    total: string
    state: TransactionState
}

/** Isi drawer "Detail Transaksi" untuk satu baris. */
export type TransactionDetailContent = {
    id: string
    state: TransactionState
    bannerAt: string
    steps: { label: string; time: string }[]
    date: string
    partner: TransactionRowContent['partner']
    gradeLabel: string
    grade: FreshnessGrade | null
    category: string
    volume: string
    hauledAt: string
    ice: string
    photoUrl: string | null
    pricePerKg: string
    total: string
    paid: boolean
}

export type RiwayatData = {
    rows: TransactionRowContent[]
    details: Map<string, TransactionDetailContent>
    /** Rentang tanggal yang tercakup data, untuk label filter tanggal. */
    range: { from: string; to: string } | null
}

type TransactionWithCatch = Transaction & { catches: Catch | null }

const DATE = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
const TIME = new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false })

const rupiah = (amount: number) => `Rp ${new Intl.NumberFormat('id-ID').format(Math.round(amount))}`
const dateOf = (iso: string) => DATE.format(new Date(iso))
const timeOf = (iso: string) => TIME.format(new Date(iso))
const dateTimeOf = (iso: string) => `${dateOf(iso)}, ${timeOf(iso)}`

/** Berat yang ditagihkan: hasil timbang di dermaga kalau sudah ada, kalau belum estimasi dari tangkapan. */
const weightOf = (entry: TransactionWithCatch) => Number(entry.final_weight_kg ?? entry.catches?.weight_kg ?? 0)

/** Nilai transaksi: hasil rekonsiliasi kalau sudah ada, kalau belum nilai saat klaim. */
const totalOf = (entry: TransactionWithCatch) => Number(entry.final_total ?? entry.estimated_total)

function toRow(entry: TransactionWithCatch, state: TransactionState): TransactionRowContent {
    const grade = entry.catches?.freshness_grade ?? null
    return {
        id: entry.id,
        date: dateOf(entry.created_at),
        time: timeOf(entry.created_at),
        partner: { name: TABLE.unknownPartner, icon: 'building-2' },
        gradeLetter: grade ? grade[0] : '—',
        grade,
        weight: `${weightOf(entry)} kg`,
        total: rupiah(totalOf(entry)),
        state,
    }
}

/** Langkah-langkah "Perjalanan Transaksi", dari stempel waktu yang sudah terisi. */
function stepsOf(entry: TransactionWithCatch, state: TransactionState, labels: Record<string, string>) {
    const steps: { label: string; time: string }[] = []
    if (entry.catches?.listed_at) steps.push({ label: labels.listed, time: dateTimeOf(entry.catches.listed_at) })
    steps.push({ label: labels.sold, time: dateTimeOf(entry.created_at) })
    if (entry.handover_confirmed_at) steps.push({ label: labels.handover, time: dateTimeOf(entry.handover_confirmed_at) })
    const closedAt = entry.disbursed_at ?? entry.updated_at
    steps.push({ label: state === 'selesai' ? labels.done : labels.cancelled, time: dateTimeOf(closedAt) })
    return steps
}

function toDetail(
    entry: TransactionWithCatch,
    state: TransactionState,
    labels: Record<string, string>
): TransactionDetailContent {
    const catchRow = entry.catches
    const weight = weightOf(entry)
    const total = totalOf(entry)
    return {
        id: entry.id,
        state,
        bannerAt: dateTimeOf(entry.disbursed_at ?? entry.updated_at),
        steps: stepsOf(entry, state, labels),
        date: dateTimeOf(entry.created_at),
        partner: { name: TABLE.unknownPartner, icon: 'building-2' },
        gradeLabel: gradeLabel(catchRow?.freshness_grade ?? null),
        grade: catchRow?.freshness_grade ?? null,
        category: catchRow ? categoryLabel(catchRow.species) : '—',
        volume: `${weight} kg`,
        hauledAt: catchRow ? dateTimeOf(catchRow.catch_time) : '—',
        ice: catchRow ? STORAGE_LABEL[catchRow.storage_method] : '—',
        photoUrl: catchRow?.photo_url ?? null,
        // Harga satuan diturunkan dari nilai transaksi supaya cocok dengan totalnya,
        // termasuk setelah berat final berbeda dari estimasi.
        pricePerKg: rupiah(weight > 0 ? total / weight : Number(catchRow?.price_per_kg ?? 0)),
        total: rupiah(total),
        paid: entry.disbursed_at !== null,
    }
}

/**
 * Riwayat transaksi nelayan yang sedang login, terbaru lebih dulu, disaring
 * menurut pilihan filter status.
 */
export async function loadRiwayat(status: StatusFilter, stepLabels: Record<string, string>): Promise<RiwayatData> {
    const profile = await requireProfile('nelayan')
    const transactions = await getMyTransactions()

    const history = transactions
        .filter((entry) => entry.nelayan_id === profile.id)
        .map((entry) => ({ entry, state: STATE_OF[entry.status] }))
        .filter((item): item is { entry: TransactionWithCatch; state: TransactionState } => item.state !== undefined)
        .filter((item) => status === 'semua' || item.state === status)

    const rows = history.map(({ entry, state }) => toRow(entry, state))
    const details = new Map(history.map(({ entry, state }) => [entry.id, toDetail(entry, state, stepLabels)]))
    // getMyTransactions sudah mengurutkan dari yang terbaru, jadi ujung-ujungnya adalah rentangnya.
    const range = rows.length > 0 ? { from: rows[rows.length - 1].date, to: rows[0].date } : null

    return { rows, details, range }
}
