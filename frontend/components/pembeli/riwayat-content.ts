// All copy for the pembeli purchase history (/pembeli/riwayat). The page reuses the nelayan "Riwayat Transaksi"
// components and their copy (components/nelayan/riwayat-content.ts); only what reads differently from the buyer's side
// is swapped here, from `dashboard.riwayat.pembeli`. Rows come from lib/nelayan/riwayat.ts, loaded with pembeliSide().
import {
  emptyState as nelayanEmptyState,
  tableCopy,
  transactionDrawer,
  type RiwayatT,
  type TableCopy,
  type TransactionDrawerCopy,
} from '@/components/nelayan/riwayat-content'
import type { RiwayatSide } from '@/lib/nelayan/riwayat'

export const RIWAYAT_PATH = '/pembeli/riwayat'

export function riwayatPage(t: RiwayatT) {
  return {
    title: t('pembeli.title'),
    subtitle: t('pembeli.subtitle'),
    // "8 pembelian dalam rentang ini"
    resultCount: (count: number) => t('pembeli.resultCount', { count }),
  }
}

// The fisher's profile isn't readable from a buyer's session (see lib/nelayan/riwayat.ts), so the partner column
// names the role and shows the PPI the catch was collected from underneath.
export function pembeliSide(t: RiwayatT): RiwayatSide {
  return { role: 'pembeli', partner: { name: t('pembeli.partnerName'), icon: 'sailboat' }, withPpi: true }
}

export function tableCopyPembeli(t: RiwayatT): TableCopy {
  const table = tableCopy(t)
  return {
    ...table,
    label: t('pembeli.tableLabel'),
    columns: { ...table.columns, partner: t('pembeli.seller') },
    detailLabel: (partner: string) => t('pembeli.detail', { partner }),
    unknownPartner: t('pembeli.partnerName'),
  }
}

export function emptyState(t: RiwayatT): ReturnType<typeof nelayanEmptyState> & { action: { href: string; label: string } } {
  return {
    title: t('pembeli.emptyTitle'),
    description: t('pembeli.emptyDescription'),
    action: { href: '/marketplace', label: t('pembeli.emptyAction') },
  }
}

export function drawerCopy(t: RiwayatT): TransactionDrawerCopy {
  const drawer = transactionDrawer(t)
  return {
    ...drawer,
    title: t('pembeli.drawerTitle'),
    closeLabel: t('pembeli.drawerClose'),
    // The same four steps, told from the buyer's side: the fisher listed it, you claimed it, you collected it.
    steps: {
      listed: t('pembeli.steps.listed'),
      sold: t('pembeli.steps.sold'),
      handover: t('pembeli.steps.handover'),
      done: t('pembeli.steps.done'),
      cancelled: t('pembeli.steps.cancelled'),
    },
    infoLabels: { ...drawer.infoLabels, partner: t('pembeli.seller') },
    // Paid once the fisher confirms the handover; until then the buyer still pays the fisher directly.
    paymentPending: t('pembeli.pending'),
    banner: { ...drawer.banner, diproses: (at: string) => t('pembeli.inProgressSince', { at }) },
    note: {
      diproses: t('pembeli.noteInProgress'),
      selesai: t('pembeli.noteCompleted'),
      dibatalkan: t('pembeli.noteCancelled'),
    },
  }
}
