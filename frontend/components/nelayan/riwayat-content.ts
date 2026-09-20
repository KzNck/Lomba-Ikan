// All copy for "Riwayat Transaksi" (/nelayan/riwayat). Edit here to swap content without touching layout.
// The transactions themselves come from Supabase — rows are shaped for these components in lib/nelayan/riwayat.ts.
import type { IconName } from '@/components/ui/icon'
import type { TransactionStatus } from '@/types/database'

export const RIWAYAT_PATH = '/nelayan/riwayat'

export const RIWAYAT_PAGE = {
  breadcrumb: 'Riwayat',
  title: 'Riwayat Transaksi',
  subtitle: 'Semua transaksi yang sudah selesai atau dibatalkan.',
  // "8 transaksi dalam rentang ini"
  resultCount: (count: number) => `${count} transaksi dalam rentang ini`,
}

export const FILTERS = {
  dateRange: {
    label: 'Rentang tanggal',
    // Shown when no range is set: the button then reports what the loaded rows cover.
    empty: 'Semua tanggal',
    // The panel is not in the export, which only draws the closed control. It follows the marketplace filters'
    // panel: two native date fields and an apply button, plus a way back to the full history.
    legend: 'Tampilkan transaksi antara',
    fromLabel: 'Dari',
    toLabel: 'Sampai',
    apply: 'Terapkan',
    reset: 'Semua tanggal',
    // What the closed control reads once a range is set; an open-ended one names the bound it has.
    between: (from: string, to: string) => `${from} – ${to}`,
    since: (from: string) => `Sejak ${from}`,
    until: (to: string) => `Sampai ${to}`,
    editLabel: (value: string) => `Ubah rentang tanggal: ${value}`,
  },
  status: {
    label: 'Status',
    // ?status= in the URL; "semua" is the default.
    options: [
      { value: 'semua', label: 'Semua' },
      { value: 'selesai', label: 'Selesai' },
      { value: 'dibatalkan', label: 'Dibatalkan' },
    ],
  },
}

export type StatusFilter = (typeof FILTERS.status.options)[number]['value']

/** ?urut= — newest first unless the URL says otherwise. */
export type SortOrder = 'baru' | 'lama'

// The two outcomes the page lists. Everything still in flight is left out, as the subtitle says.
export const TRANSACTION_STATES = {
  selesai: {
    label: 'Selesai',
    icon: 'circle-check',
    chip: 'bg-[#E8F8F2]',
    text: 'text-[#17704A]',
    fill: '#17704A',
    // The timeline's last dot, which the export draws green for a finished transaction.
    dot: 'bg-[#2FAE6E] [outline:3px_solid_#E8F8F2]',
  },
  dibatalkan: {
    label: 'Dibatalkan',
    icon: 'circle-x',
    chip: 'bg-[#E2E8F0]',
    text: 'text-[#0B3B5C]',
    fill: '#0B3B5C',
    // Not in the export, which only draws the finished case: green would read as success.
    dot: 'bg-[#5B6B7C] [outline:3px_solid_#E2E8F0]',
  },
} satisfies Record<string, { label: string; icon: IconName; chip: string; text: string; fill: string; dot: string }>

export type TransactionState = keyof typeof TRANSACTION_STATES

/** Which of the two the database status belongs to; anything still running is not history yet. */
export const STATE_OF: Partial<Record<TransactionStatus, TransactionState>> = {
  COMPLETED: 'selesai',
  CANCELLED: 'dibatalkan',
}

export const TABLE = {
  label: 'Riwayat transaksi',
  columns: {
    date: 'Tanggal',
    partner: 'Mitra transaksi',
    grade: 'Grade',
    weight: 'Berat',
    total: 'Harga total',
    status: 'Status',
    // The chevron column; the header is blank in the export.
    action: '',
  },
  // The export draws a down arrow on "Tanggal"; it toggles the order through ?urut=.
  sort: {
    baru: { caption: 'Diurutkan dari yang terbaru', icon: 'arrow-down', action: 'Urutkan dari yang terlama', aria: 'descending' },
    lama: { caption: 'Diurutkan dari yang terlama', icon: 'arrow-up', action: 'Urutkan dari yang terbaru', aria: 'ascending' },
  } satisfies Record<string, { caption: string; icon: IconName; action: string; aria: 'descending' | 'ascending' }>,
  detailLabel: (partner: string) => `Lihat detail transaksi dengan ${partner}`,
  // The buyer's profile is not readable under the current RLS policy (see lib/nelayan/riwayat.ts).
  unknownPartner: 'Pembeli',
}

// Not in the export, which only draws the filled table. Wording follows the design reference image.
export const EMPTY_STATE = {
  title: 'Belum ada transaksi selesai',
  description: 'Transaksi yang sudah selesai akan muncul di sini.',
}

export const TRANSACTION_DRAWER = {
  title: 'Detail Transaksi',
  closeLabel: 'Tutup detail transaksi',
  banner: {
    selesai: (at: string) => `Selesai pada ${at}`,
    dibatalkan: (at: string) => `Dibatalkan pada ${at}`,
  },
  timelineTitle: 'Perjalanan Transaksi',
  // The four steps the export lists, in order. A step with no timestamp yet is left out.
  steps: { listed: 'Dipasang', sold: 'Terjual', handover: 'Diambil', done: 'Selesai', cancelled: 'Dibatalkan' },
  infoTitle: 'Informasi Transaksi',
  infoLabels: { id: 'ID transaksi', date: 'Tanggal', partner: 'Mitra transaksi', grade: 'Grade' },
  catchTitle: 'Detail Tangkapan',
  catchLabels: { category: 'Kategori', volume: 'Volume', hauledAt: 'Waktu ditarik', ice: 'Kondisi es', photo: 'Foto' },
  photoLink: 'Lihat foto',
  paymentTitle: 'Harga & Pembayaran',
  paymentLabels: {
    pricePerKg: 'Harga per kg',
    total: 'Total harga',
    method: 'Metode pembayaran',
    status: 'Status pembayaran',
  },
  // The schema has no payment-method column; disbursement goes to the fisher's bank account (profiles.bank_account).
  paymentMethod: 'Transfer bank',
  paymentPaid: 'Lunas',
  paymentPending: 'Menunggu pencairan',
  note: {
    selesai: 'Transaksi ini sudah selesai dan tidak bisa diubah. Kalau ada kendala, hubungi mitra lewat menu Bantuan.',
    // Not in the export, which only draws the finished case.
    dibatalkan: 'Transaksi ini dibatalkan dan tidak bisa diubah. Kalau ada kendala, hubungi mitra lewat menu Bantuan.',
  },
}
