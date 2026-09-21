// All copy for "Riwayat Transaksi" (/nelayan/riwayat). Edit here to swap content without touching layout.
// Text lives in messages/*.json under `dashboard.riwayat`. The transactions themselves come from Supabase — rows are
// shaped for these components in lib/nelayan/riwayat.ts.
import type { IconName } from '@/components/ui/icon'
import type { Translator } from '@/lib/i18n/translator'
import type { TransactionStatus } from '@/types/database'

export type RiwayatT = Translator<'dashboard.riwayat'>

export const RIWAYAT_PATH = '/nelayan/riwayat'

export function riwayatPage(t: RiwayatT) {
  return {
    breadcrumb: t('breadcrumb'),
    title: t('title'),
    subtitle: t('subtitle'),
    // "8 transaksi dalam rentang ini"
    resultCount: (count: number) => t('resultCount', { count }),
  }
}

// ?status= in the URL; "semua" is the default.
export const STATUS_FILTERS = ['semua', 'diproses', 'selesai', 'dibatalkan'] as const
export type StatusFilter = (typeof STATUS_FILTERS)[number]

export function filtersCopy(t: RiwayatT) {
  return {
    dateRange: {
      label: t('dateRange.label'),
      // Shown when no range is set: the button then reports what the loaded rows cover.
      empty: t('dateRange.empty'),
      // The panel is not in the export, which only draws the closed control. It follows the marketplace filters'
      // panel: two native date fields and an apply button, plus a way back to the full history.
      legend: t('dateRange.legend'),
      fromLabel: t('dateRange.from'),
      toLabel: t('dateRange.to'),
      apply: t('dateRange.apply'),
      reset: t('dateRange.reset'),
      // What the closed control reads once a range is set; an open-ended one names the bound it has.
      between: (from: string, to: string) => `${from} – ${to}`,
      since: (from: string) => t('dateRange.since', { from }),
      until: (to: string) => t('dateRange.until', { to }),
      editLabel: (value: string) => t('dateRange.edit', { value }),
    },
    status: {
      label: t('status.label'),
      options: STATUS_FILTERS.map((value) => ({ value, label: t(`status.${value}`) })),
    },
  }
}

/** ?urut= — newest first unless the URL says otherwise. */
export type SortOrder = 'baru' | 'lama'

// The three states the page lists: still in progress (claimed, not yet handed over and settled), then the two
// outcomes. Their names are under `dashboard.riwayat.status`.
export const TRANSACTION_STATES = {
  diproses: {
    icon: 'clock',
    chip: 'bg-[#DCEEFB]',
    text: 'text-[#0F6CB8]',
    fill: '#0F6CB8',
    // The timeline's latest dot while the transaction is still running.
    dot: 'bg-[#168BE5] [outline:3px_solid_#DCEEFB]',
  },
  selesai: {
    icon: 'circle-check',
    chip: 'bg-[#E8F8F2]',
    text: 'text-[#17704A]',
    fill: '#17704A',
    // The timeline's last dot, which the export draws green for a finished transaction.
    dot: 'bg-[#2FAE6E] [outline:3px_solid_#E8F8F2]',
  },
  dibatalkan: {
    icon: 'circle-x',
    chip: 'bg-[#E2E8F0]',
    text: 'text-[#0B3B5C]',
    fill: '#0B3B5C',
    // Not in the export, which only draws the finished case: green would read as success.
    dot: 'bg-[#5B6B7C] [outline:3px_solid_#E2E8F0]',
  },
} satisfies Record<string, { icon: IconName; chip: string; text: string; fill: string; dot: string }>

export type TransactionState = keyof typeof TRANSACTION_STATES

/**
 * Which state the database status belongs to. Everything between the claim and the payout is "diproses": nothing in
 * the app completes a transaction yet (the handover is confirmed by the confirm-handover Edge Function), so without it
 * a purchase would never show up.
 */
export const STATE_OF: Record<TransactionStatus, TransactionState> = {
  ESCROW_PENDING: 'diproses',
  ESCROW_HELD: 'diproses',
  DELIVERY_SCHEDULED: 'diproses',
  WEIGHING_DONE: 'diproses',
  RECONCILED: 'diproses',
  COMPLETED: 'selesai',
  CANCELLED: 'dibatalkan',
}

export function tableCopy(t: RiwayatT) {
  return {
    label: t('table.label'),
    columns: {
      date: t('table.date'),
      partner: t('table.partner'),
      grade: t('table.grade'),
      weight: t('table.weight'),
      total: t('table.total'),
      status: t('table.status'),
      // The chevron column; the header is blank in the export.
      action: '',
    },
    states: {
      diproses: t('status.diproses'),
      selesai: t('status.selesai'),
      dibatalkan: t('status.dibatalkan'),
    } satisfies Record<TransactionState, string>,
    // The export draws a down arrow on "Tanggal"; it toggles the order through ?urut=.
    sort: {
      baru: { caption: t('table.sortedNewest'), icon: 'arrow-down', action: t('table.sortOldest'), aria: 'descending' },
      lama: { caption: t('table.sortedOldest'), icon: 'arrow-up', action: t('table.sortNewest'), aria: 'ascending' },
    } satisfies Record<SortOrder, { caption: string; icon: IconName; action: string; aria: 'descending' | 'ascending' }>,
    detailLabel: (partner: string) => t('table.detail', { partner }),
    // The buyer's profile is not readable under the current RLS policy (see lib/nelayan/riwayat.ts).
    unknownPartner: t('table.unknownPartner'),
  }
}

// Not in the export, which only draws the filled table. Wording follows the design reference image.
export function emptyState(t: RiwayatT) {
  return {
    title: t('emptyTitle'),
    description: t('emptyDescription'),
  }
}

export function transactionDrawer(t: RiwayatT) {
  return {
    title: t('drawer.title'),
    closeLabel: t('drawer.close'),
    banner: {
      diproses: (at: string) => t('drawer.inProgressSince', { at }),
      selesai: (at: string) => t('drawer.completedAt', { at }),
      dibatalkan: (at: string) => t('drawer.cancelledAt', { at }),
    },
    timelineTitle: t('drawer.timelineTitle'),
    // The four steps the export lists, in order. A step with no timestamp yet is left out.
    steps: {
      listed: t('drawer.steps.listed'),
      sold: t('drawer.steps.sold'),
      handover: t('drawer.steps.handover'),
      done: t('drawer.steps.done'),
      cancelled: t('drawer.steps.cancelled'),
    },
    infoTitle: t('drawer.infoTitle'),
    infoLabels: { id: t('drawer.id'), date: t('drawer.date'), partner: t('drawer.partner'), grade: t('drawer.grade') },
    catchTitle: t('drawer.catchTitle'),
    catchLabels: {
      category: t('drawer.category'),
      volume: t('drawer.volume'),
      hauledAt: t('drawer.hauledAt'),
      ice: t('drawer.ice'),
      photo: t('drawer.photo'),
    },
    photoLink: t('drawer.photoLink'),
    photoAlt: (category: string) => t('drawer.photoAlt', { category }),
    paymentTitle: t('drawer.paymentTitle'),
    paymentLabels: {
      pricePerKg: t('drawer.pricePerKg'),
      total: t('drawer.total'),
      method: t('drawer.method'),
      status: t('drawer.paymentStatus'),
    },
    // Buyers pay the fisher directly (cash or transfer), arranged over WhatsApp; the app holds no money.
    paymentMethod: t('drawer.paidDirect'),
    paymentPaid: t('drawer.paid'),
    paymentPending: t('drawer.pending'),
    note: {
      diproses: t('drawer.noteInProgress'),
      selesai: t('drawer.noteCompleted'),
      // Not in the export, which only draws the finished case.
      dibatalkan: t('drawer.noteCancelled'),
    },
  }
}

export type TableCopy = ReturnType<typeof tableCopy>
export type TransactionDrawerCopy = ReturnType<typeof transactionDrawer>
