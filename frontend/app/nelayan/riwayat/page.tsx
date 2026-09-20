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
  type StatusFilter,
} from '@/components/nelayan/riwayat-content'
import { loadRiwayat } from '@/lib/nelayan/riwayat'
import { requireProfile } from '@/lib/supabase/auth'
import { getMyCatches } from '@/lib/supabase/catches'
import { getMyTransactions } from '@/lib/supabase/transactions'
import { greetingFor, initialsOf, recentNotifications } from '@/lib/nelayan/dashboard-data'

const STATUS_VALUES = FILTERS.status.options.map(({ value }) => value)

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

  const [profile, { rows, details, range }, catches, transactions] = await Promise.all([
    requireProfile('nelayan'),
    loadRiwayat(status, TRANSACTION_DRAWER.steps),
    getMyCatches(),
    getMyTransactions(),
  ])

  const notifications = recentNotifications(catches, transactions)
  const detail = openId ? details.get(openId) : undefined
  const hrefFor = (id: string) => {
    const search = new URLSearchParams()
    if (status !== 'semua') search.set('status', status)
    if (id !== openId) search.set('transaksi', id)
    const query = search.toString()
    return query ? `${RIWAYAT_PATH}?${query}` : RIWAYAT_PATH
  }

  return (
    <div className="box-border [flex:1_1_0] flex flex-col gap-0 justify-start items-start relative">
      <DashboardHeader
        greeting={greetingFor(profile.full_name)}
        subtitle={DASHBOARD.subtitle}
        notifications={{ ...DASHBOARD.notifications, unreadCount: notifications.length }}
        user={{ name: profile.full_name, initials: initialsOf(profile.full_name) }}
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
          <RiwayatFilters
            action={RIWAYAT_PATH}
            status={status}
            dateRange={range ? `${range.from} – ${range.to}` : FILTERS.dateRange.empty}
          />
          <p className="box-border w-full h-fit shrink-0 flex flex-row gap-[6px] justify-start items-center">
            <span className="text-[13px]/[normal] box-border text-[#5B6B7C] font-inter font-normal text-left [white-space:nowrap]">
              {RIWAYAT_PAGE.resultCount(rows.length)}
            </span>
          </p>
          {rows.length > 0 ? (
            <TransactionTable rows={rows} hrefFor={hrefFor} selectedId={detail?.id} />
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
