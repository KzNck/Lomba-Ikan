// lib/nelayan/riwayat.ts
//
// Merakit data halaman riwayat dari Supabase: row `transactions` yang sudah
// COMPLETED atau CANCELLED, beserta tangkapannya. Dipakai dua sisi: nelayan
// (/nelayan/riwayat, mitranya pembeli) dan pembeli (/pembeli/riwayat, mitranya
// nelayan) — lihat `RiwayatSide`.
//
// Nama mitra belum bisa ditampilkan: policy "profiles: self access" di
// supabase/schema.sql hanya mengizinkan tiap user membaca profilnya sendiri,
// jadi profil pihak lain tidak terbaca. Kolomnya memakai label pengganti sampai
// ada policy (atau view) yang membuka nama mitra secukupnya.
//
// Pembeli hanya bisa membaca tangkapan yang dibelinya setelah policy di
// supabase/catches-purchased.sql dijalankan; tanpa itu kategori, grade, dan
// berat estimasinya tampil kosong.

import { FILTERS, STATE_OF, TABLE, type SortOrder, type StatusFilter, type TransactionState } from '@/components/nelayan/riwayat-content'
import { categoryLabel, formatRupiah, gradeLabel, storageLabel, type Presenter } from '@/lib/catches/present'
import { getPresenter } from '@/lib/i18n/presenter'
import { getMyTransactions } from '@/lib/supabase/transactions'
import { requireProfile } from '@/lib/supabase/auth'
import type { Catch, FreshnessGrade, Transaction } from '@/types/database'

/** Satu baris tabel, sudah dalam bentuk teks siap tampil. */
export type TransactionRowContent = {
    id: string
    date: string
    time: string
    partner: { name: string; type?: string; icon: PartnerIcon }
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

type PartnerIcon = 'factory' | 'building-2' | 'sailboat'

/**
 * Sisi yang sedang melihat riwayatnya. Menentukan transaksi mana yang miliknya
 * dan bagaimana pihak lawannya ditampilkan.
 */
export type RiwayatSide = {
    role: 'nelayan' | 'pembeli'
    partner: { name: string; icon: PartnerIcon }
    // Pembeli melihat PPI tempat tangkapan diambil di bawah nama mitranya.
    withPpi?: boolean
}

/** Sisi nelayan, seperti halaman ini sebelum ada riwayat pembeli. */
export const NELAYAN_SIDE: RiwayatSide = { role: 'nelayan', partner: { name: TABLE.unknownPartner, icon: 'building-2' } }

/** Filter tanggal dari URL: batas bawah dan atas, masing-masing "YYYY-MM-DD" dan boleh kosong. */
export type DateRange = { from?: string; to?: string }

export type RiwayatData = {
    rows: TransactionRowContent[]
    details: Map<string, TransactionDetailContent>
    /** Rentang tanggal yang tercakup data, untuk label filter tanggal. */
    range: { from: string; to: string } | null
}

type TransactionWithCatch = Transaction & { catches: Catch | null }

/** "2025-06-01" → "1 Jun 2025", untuk label filter tanggal. */
export const formatDay = ({ format }: Presenter, day: string) => format.dateTime(new Date(`${day}T00:00:00`), 'day')

const dateOf = ({ format }: Presenter, iso: string) => format.dateTime(new Date(iso), 'day')
const timeOf = ({ format }: Presenter, iso: string) => format.dateTime(new Date(iso), 'time')
const dateTimeOf = (p: Presenter, iso: string) => `${dateOf(p, iso)}, ${timeOf(p, iso)}`

/** Berat yang ditagihkan: hasil timbang di dermaga kalau sudah ada, kalau belum estimasi dari tangkapan. */
const weightOf = (entry: TransactionWithCatch) => Number(entry.final_weight_kg ?? entry.catches?.weight_kg ?? 0)

/** "5 kg", or "—" when neither weight is readable (a buyer without access to the catch row). */
const weightText = (kg: number) => (kg > 0 ? `${kg} kg` : '—')

/** Nilai transaksi: hasil rekonsiliasi kalau sudah ada, kalau belum nilai saat klaim. */
const totalOf = (entry: TransactionWithCatch) => Number(entry.final_total ?? entry.estimated_total)

/** Mitra transaksi dari sisi yang melihat; pembeli melihat PPI pengambilannya sebagai baris kedua. */
function partnerOf(entry: TransactionWithCatch, side: RiwayatSide): TransactionRowContent['partner'] {
    const ppi = side.withPpi ? (entry.ppi_location ?? entry.catches?.catch_location ?? undefined) : undefined
    return { ...side.partner, type: ppi }
}

function toRow(p: Presenter, entry: TransactionWithCatch, state: TransactionState, side: RiwayatSide): TransactionRowContent {
    const grade = entry.catches?.freshness_grade ?? null
    return {
        id: entry.id,
        date: dateOf(p, entry.created_at),
        time: timeOf(p, entry.created_at),
        partner: partnerOf(entry, side),
        gradeLetter: grade ? grade[0] : '—',
        grade,
        weight: weightText(weightOf(entry)),
        total: formatRupiah(p, totalOf(entry)),
        state,
    }
}

/** Langkah-langkah "Perjalanan Transaksi", dari stempel waktu yang sudah terisi. */
function stepsOf(p: Presenter, entry: TransactionWithCatch, state: TransactionState, labels: Record<string, string>) {
    const steps: { label: string; time: string }[] = []
    if (entry.catches?.listed_at) steps.push({ label: labels.listed, time: dateTimeOf(p, entry.catches.listed_at) })
    steps.push({ label: labels.sold, time: dateTimeOf(p, entry.created_at) })
    if (entry.handover_confirmed_at) steps.push({ label: labels.handover, time: dateTimeOf(p, entry.handover_confirmed_at) })
    const closedAt = entry.disbursed_at ?? entry.updated_at
    steps.push({ label: state === 'selesai' ? labels.done : labels.cancelled, time: dateTimeOf(p, closedAt) })
    return steps
}

function toDetail(
    p: Presenter,
    entry: TransactionWithCatch,
    state: TransactionState,
    labels: Record<string, string>,
    side: RiwayatSide
): TransactionDetailContent {
    const catchRow = entry.catches
    const weight = weightOf(entry)
    const total = totalOf(entry)
    return {
        id: entry.id,
        state,
        bannerAt: dateTimeOf(p, entry.disbursed_at ?? entry.updated_at),
        steps: stepsOf(p, entry, state, labels),
        date: dateTimeOf(p, entry.created_at),
        partner: partnerOf(entry, side),
        gradeLabel: gradeLabel(p, catchRow?.freshness_grade ?? null),
        grade: catchRow?.freshness_grade ?? null,
        category: catchRow ? categoryLabel(p, catchRow.species) : '—',
        volume: weightText(weight),
        hauledAt: catchRow ? dateTimeOf(p, catchRow.catch_time) : '—',
        ice: catchRow ? storageLabel(p, catchRow.storage_method) : '—',
        photoUrl: catchRow?.photo_url ?? null,
        // Harga satuan diturunkan dari nilai transaksi supaya cocok dengan totalnya,
        // termasuk setelah berat final berbeda dari estimasi.
        pricePerKg:
            weight > 0
                ? formatRupiah(p, total / weight)
                : catchRow?.price_per_kg != null
                  ? formatRupiah(p, Number(catchRow.price_per_kg))
                  : '—',
        total: formatRupiah(p, total),
        paid: entry.disbursed_at !== null,
    }
}

/**
 * Apakah stempel waktu transaksi masuk rentang yang dipilih. Batasnya
 * inklusif dan dibaca sebagai hari penuh di zona waktu perangkat: "sampai
 * 12 Jul" berarti sampai 12 Jul pukul 23:59.
 */
export function withinRange(iso: string, { from, to }: DateRange): boolean {
    const at = Date.parse(iso)
    if (Number.isNaN(at)) return false
    if (from) {
        const start = new Date(`${from}T00:00:00`)
        if (!Number.isNaN(start.getTime()) && at < start.getTime()) return false
    }
    if (to) {
        const end = new Date(`${to}T23:59:59.999`)
        if (!Number.isNaN(end.getTime()) && at > end.getTime()) return false
    }
    return true
}

/**
 * Riwayat transaksi user yang sedang login di sisi `side`, terbaru lebih dulu,
 * disaring menurut pilihan filter status dan rentang tanggal.
 */
export async function loadRiwayat(
    status: StatusFilter,
    range: DateRange,
    order: SortOrder,
    stepLabels: Record<string, string>,
    side: RiwayatSide = NELAYAN_SIDE
): Promise<RiwayatData> {
    const [profile, transactions, p] = await Promise.all([requireProfile(side.role), getMyTransactions(), getPresenter()])

    const history = transactions
        .filter((entry) => (side.role === 'pembeli' ? entry.pembeli_id : entry.nelayan_id) === profile.id)
        .map((entry) => ({ entry, state: STATE_OF[entry.status] }))
        .filter((item): item is { entry: TransactionWithCatch; state: TransactionState } => item.state !== undefined)
        .filter((item) => status === 'semua' || item.state === status)
        .filter((item) => withinRange(item.entry.created_at, range))
        // getMyTransactions mengurutkan dari yang terbaru; "lama" tinggal membalik.
        .sort((a, b) =>
            order === 'lama'
                ? Date.parse(a.entry.created_at) - Date.parse(b.entry.created_at)
                : Date.parse(b.entry.created_at) - Date.parse(a.entry.created_at)
        )

    const rows = history.map(({ entry, state }) => toRow(p, entry, state, side))
    const details = new Map(history.map(({ entry, state }) => [entry.id, toDetail(p, entry, state, stepLabels, side)]))
    // Ujung-ujung daftar adalah rentang yang tampil — urutannya bisa dari salah satu ujung.
    const ends = rows.length > 0 ? [rows[0].date, rows[rows.length - 1].date] : null
    const shown = ends ? { from: order === 'lama' ? ends[0] : ends[1], to: order === 'lama' ? ends[1] : ends[0] } : null

    return { rows, details, range: shown }
}

/** The page's view, read from its URL: ?status=, ?dari= / ?sampai=, ?urut=, and ?transaksi= for the open drawer. */
export type RiwayatView = { status: StatusFilter; range: DateRange; order: SortOrder; openId?: string }

type SearchParams = { [key: string]: string | string[] | undefined }

const STATUS_VALUES: readonly string[] = FILTERS.status.options.map(({ value }) => value)

export function parseRiwayatView(params: SearchParams): RiwayatView {
    const requested = typeof params.status === 'string' ? params.status : ''
    // Only "YYYY-MM-DD" counts; anything else reads as no bound.
    const day = (value: string | string[] | undefined) =>
        typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : undefined
    return {
        status: (STATUS_VALUES.includes(requested) ? requested : 'semua') as StatusFilter,
        range: { from: day(params.dari), to: day(params.sampai) },
        order: params.urut === 'lama' ? 'lama' : 'baru',
        openId: typeof params.transaksi === 'string' ? params.transaksi : undefined,
    }
}

/** A link to `path` that keeps the rest of the view; only what `change` names differs. */
export function riwayatHref(path: string, view: RiwayatView, change: { transaksi?: string; urut?: SortOrder }): string {
    const search = new URLSearchParams()
    if (view.status !== 'semua') search.set('status', view.status)
    if (view.range.from) search.set('dari', view.range.from)
    if (view.range.to) search.set('sampai', view.range.to)
    const urut = change.urut ?? view.order
    if (urut === 'lama') search.set('urut', urut)
    if (change.transaksi) search.set('transaksi', change.transaksi)
    const query = search.toString()
    return query ? `${path}?${query}` : path
}

/** The closed date control: the chosen range when there is one, otherwise what the listed rows cover. */
export function dateLabelFor(p: Presenter, range: DateRange, shown: { from: string; to: string } | null): string {
    const { between, since, until, empty } = FILTERS.dateRange
    if (range.from && range.to) return between(formatDay(p, range.from), formatDay(p, range.to))
    if (range.from) return since(formatDay(p, range.from))
    if (range.to) return until(formatDay(p, range.to))
    return shown ? between(shown.from, shown.to) : empty
}
