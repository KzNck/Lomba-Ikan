import { DashboardHeader } from '@/components/nelayan/dashboard-header'
import { Breadcrumb } from '@/components/nelayan/breadcrumb'
import { MainDecoration } from '@/components/nelayan/main-decoration'
import { EmptyState } from '@/components/nelayan/empty-state'
import { RiwayatFilters } from '@/components/nelayan/riwayat-filters'
import { TransactionTable } from '@/components/nelayan/transaction-table'
import { TransactionDrawer } from '@/components/nelayan/transaction-drawer'
import { DASHBOARD } from '@/components/nelayan/content'
import {
  EMPTY_STATE,
  FILTERS,
  RIWAYAT_PAGE,
  RIWAYAT_PATH,
  TRANSACTION_DRAWER,
  type SortOrder,
  type StatusFilter,
} from '@/components/nelayan/riwayat-content'
import { formatDay, loadRiwayat } from '@/lib/nelayan/riwayat'
import { requireProfile } from '@/lib/supabase/auth'
import { displayNameFor } from '@/lib/supabase/display-name'
import { getMyCatches } from '@/lib/supabase/catches'
import { getMyTransactions } from '@/lib/supabase/transactions'
import { greetingFor, initialsOf, recentNotifications } from '@/lib/nelayan/dashboard-data'

const STATUS_VALUES = FILTERS.status.options.map(({ value }) => value)

// The closed date control: the chosen range when there is one, otherwise what the listed rows cover.
function dateLabel(range: { from?: string; to?: string }, shown: { from: string; to: string } | null) {
  const { between, since, until, empty } = FILTERS.dateRange
  if (range.from && range.to) return between(formatDay(range.from), formatDay(range.to))
  if (range.from) return since(formatDay(range.from))
  if (range.to) return until(formatDay(range.to))
  return shown ? between(shown.from, shown.to) : empty
}

// The "13 Riwayat Transaksi" frame: the history table beside the fisher's own dashboard chrome. The URL holds the
// view — ?status= filters the rows, ?transaksi=<id> opens that row's drawer.
export default async function RiwayatPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const requested = typeof params.status === 'string' ? params.status : ''
  const status = (STATUS_VALUES.includes(requested as StatusFilter) ? requested : 'semua') as StatusFilter
  const openId = typeof params.transaksi === 'string' ? params.transaksi : undefined
  // Only "YYYY-MM-DD" counts; anything else reads as no bound.
  const dateParam = (value: string | string[] | undefined) =>
    typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : undefined
  const range = { from: dateParam(params.dari), to: dateParam(params.sampai) }
  const order: SortOrder = params.urut === 'lama' ? 'lama' : 'baru'

  const [profile, { rows, details, range: shownRange }, catches, transactions] = await Promise.all([
    requireProfile('nelayan'),
    loadRiwayat(status, range, order, TRANSACTION_DRAWER.steps),
    getMyCatches(),
    getMyTransactions(),
  ])

  const notifications = recentNotifications(catches, transactions)
  const name = await displayNameFor(profile)
  const detail = openId ? details.get(openId) : undefined
  // Every link keeps the rest of the view; only the part it changes differs.
  const hrefWith = (change: { transaksi?: string; urut?: SortOrder }) => {
    const search = new URLSearchParams()
    if (status !== 'semua') search.set('status', status)
    if (range.from) search.set('dari', range.from)
    if (range.to) search.set('sampai', range.to)
    const urut = change.urut ?? order
    if (urut === 'lama') search.set('urut', urut)
    if (change.transaksi) search.set('transaksi', change.transaksi)
    const query = search.toString()
    return query ? `${RIWAYAT_PATH}?${query}` : RIWAYAT_PATH
  }
  // Clicking the open row's chevron closes its drawer.
  const hrefFor = (id: string) => hrefWith(id === openId ? {} : { transaksi: id })

  return (
    <div className="box-border [flex:1_1_0] flex flex-col gap-0 justify-start items-start relative">
      <DashboardHeader
        greeting={greetingFor(name)}
        subtitle={DASHBOARD.subtitle}
        notifications={{ ...DASHBOARD.notifications, unreadCount: notifications.length }}
        user={{ name, initials: initialsOf(profile.full_name) }}
      />
      <MainDecoration />
      <div className="box-border w-full [flex:1_1_0] flex flex-col gap-0 justify-start items-start relative">
        {/* The export pads the content by 424px on the right to leave room for the open drawer. */}
        <div
          className={`box-border w-full [flex:1_1_0] flex flex-col gap-[20px] ${detail ? 'p-[20px_424px_32px_32px]' : 'p-[20px_32px_32px_32px]'} justify-start items-start relative [z-index:2]`}
        >
          <Breadcrumb current={RIWAYAT_PAGE.breadcrumb} />
          <div className="box-border w-full h-fit shrink-0 flex flex-col gap-[6px] justify-start items-start">
            <h2 className="text-[28px]/[32px] box-border text-[#0B3B5C] font-poppins font-bold text-left [white-space:nowrap]">{RIWAYAT_PAGE.title}</h2>
            <p className="text-[15px]/[normal] box-border w-full text-[#5B6B7C] font-inter font-normal text-left">{RIWAYAT_PAGE.subtitle}</p>
          </div>
          <RiwayatFilters action={RIWAYAT_PATH} status={status} range={range} dateLabel={dateLabel(range, shownRange)} />
          <p className="box-border w-full h-fit shrink-0 flex flex-row gap-[6px] justify-start items-center">
            <span className="text-[13px]/[normal] box-border text-[#5B6B7C] font-inter font-normal text-left [white-space:nowrap]">
              {RIWAYAT_PAGE.resultCount(rows.length)}
            </span>
          </p>
          {rows.length > 0 ? (
            <TransactionTable
              rows={rows}
              order={order}
              toggleSortHref={hrefWith({ urut: order === 'baru' ? 'lama' : 'baru', transaksi: openId })}
              hrefFor={hrefFor}
              selectedId={detail?.id}
            />
          ) : (
            <div className="box-border w-full h-fit shrink-0 flex flex-col gap-0 p-[20px] justify-start items-start bg-[#FFFFFF] [outline:1px_solid_#E2E8F0] [outline-offset:-0.5px] rounded-[16px]">
              <EmptyState icon="history" title={EMPTY_STATE.title} description={EMPTY_STATE.description} />
            </div>
          )}
        </div>
        {detail && <TransactionDrawer detail={detail} closeHref={hrefFor(detail.id)} />}
      </div>
    </div>
  )
}
