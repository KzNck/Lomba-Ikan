// All copy for the pembeli purchase history (/pembeli/riwayat). The page reuses the nelayan "Riwayat Transaksi"
// components and their copy (components/nelayan/riwayat-content.ts); only what reads differently from the buyer's side
// is swapped here. Rows come from lib/nelayan/riwayat.ts, loaded with PEMBELI_SIDE.
import { EMPTY_STATE as NELAYAN_EMPTY_STATE, TABLE, TRANSACTION_DRAWER } from '@/components/nelayan/riwayat-content'
import type { RiwayatSide } from '@/lib/nelayan/riwayat'

export const RIWAYAT_PATH = '/pembeli/riwayat'

export const RIWAYAT_PAGE = {
  title: 'Riwayat Pembelian',
  subtitle: 'Semua pembelian yang sudah selesai atau dibatalkan.',
  // "8 pembelian dalam rentang ini"
  resultCount: (count: number) => `${count} pembelian dalam rentang ini`,
}

// The fisher's profile isn't readable from a buyer's session (see lib/nelayan/riwayat.ts), so the partner column
// names the role and shows the PPI the catch was collected from underneath.
export const PEMBELI_SIDE: RiwayatSide = { role: 'pembeli', partner: { name: 'Nelayan', icon: 'sailboat' }, withPpi: true }

export const TABLE_COPY: typeof TABLE = {
  ...TABLE,
  label: 'Riwayat pembelian',
  columns: { ...TABLE.columns, partner: 'Penjual' },
  detailLabel: (partner: string) => `Lihat detail pembelian dari ${partner}`,
  unknownPartner: PEMBELI_SIDE.partner.name,
}

export const EMPTY_STATE: typeof NELAYAN_EMPTY_STATE & { action: { href: string; label: string } } = {
  title: 'Belum ada pembelian selesai',
  description: 'Pembelian yang sudah selesai atau dibatalkan akan muncul di sini.',
  action: { href: '/marketplace', label: 'Cari tangkapan di Marketplace' },
}

export const DRAWER_COPY: typeof TRANSACTION_DRAWER = {
  ...TRANSACTION_DRAWER,
  title: 'Detail Pembelian',
  closeLabel: 'Tutup detail pembelian',
  // The same four steps, told from the buyer's side: the fisher listed it, you claimed it, you collected it.
  steps: { listed: 'Dipasang nelayan', sold: 'Anda klaim', handover: 'Diambil', done: 'Selesai', cancelled: 'Dibatalkan' },
  infoLabels: { ...TRANSACTION_DRAWER.infoLabels, partner: 'Penjual' },
  // For the buyer "paid" means the escrow was settled; until then the payment is still being processed.
  paymentPending: 'Sedang diproses',
  note: {
    selesai: 'Pembelian ini sudah selesai dan tidak bisa diubah. Kalau ada kendala, hubungi kami lewat menu Bantuan.',
    dibatalkan: 'Pembelian ini dibatalkan dan tidak bisa diubah. Kalau ada kendala, hubungi kami lewat menu Bantuan.',
  },
}
