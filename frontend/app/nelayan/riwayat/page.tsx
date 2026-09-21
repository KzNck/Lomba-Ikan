import { DashboardHeader } from '@/components/nelayan/dashboard-header'
import { Breadcrumb } from '@/components/nelayan/breadcrumb'
import { MainDecoration } from '@/components/nelayan/main-decoration'
import { EmptyState } from '@/components/nelayan/empty-state'
import { RiwayatFilters } from '@/components/nelayan/riwayat-filters'
import { TransactionTable } from '@/components/nelayan/transaction-table'
import { TransactionDrawer } from '@/components/nelayan/transaction-drawer'
import { DASHBOARD } from '@/components/nelayan/content'
import { EMPTY_STATE, RIWAYAT_PAGE, RIWAYAT_PATH, TRANSACTION_DRAWER } from '@/components/nelayan/riwayat-content'
import { dateLabelFor, loadRiwayat, parseRiwayatView, riwayatHref } from '@/lib/nelayan/riwayat'
import { getPresenter } from '@/lib/i18n/presenter'
import { requireProfile } from '@/lib/supabase/auth'
import { displayNameFor } from '@/lib/supabase/display-name'
import { getMyCatches } from '@/lib/supabase/catches'
import { getMyTransactions } from '@/lib/supabase/transactions'
import { greetingFor, initialsOf, recentNotifications } from '@/lib/nelayan/dashboard-data'

// The "13 Riwayat Transaksi" frame: the history table beside the fisher's own dashboard chrome. The URL holds the
// view — ?status= filters the rows, ?transaksi=<id> opens that row's drawer.
export default async function RiwayatPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const view = parseRiwayatView(await searchParams)
  const { status, range, order, openId } = view

  const [profile, { rows, details, range: shownRange }, catches, transactions, p] = await Promise.all([
    requireProfile('nelayan'),
    loadRiwayat(status, range, order, TRANSACTION_DRAWER.steps),
    getMyCatches(),
    getMyTransactions(),
    getPresenter(),
  ])

  const notifications = recentNotifications(p, catches, transactions)
  const name = await displayNameFor(profile)
  const detail = openId ? details.get(openId) : undefined
  // Every link keeps the rest of the view; only the part it changes differs.
  const hrefWith = (change: Parameters<typeof riwayatHref>[2]) => riwayatHref(RIWAYAT_PATH, view, change)
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
          <RiwayatFilters action={RIWAYAT_PATH} status={status} range={range} dateLabel={dateLabelFor(p, range, shownRange)} />
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
