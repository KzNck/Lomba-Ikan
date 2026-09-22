import { DashboardHeader } from '@/components/nelayan/dashboard-header'
import { Breadcrumb } from '@/components/nelayan/breadcrumb'
import { MainDecoration } from '@/components/nelayan/main-decoration'
import { EmptyState } from '@/components/nelayan/empty-state'
import { RiwayatFilters } from '@/components/nelayan/riwayat-filters'
import { TransactionTable } from '@/components/nelayan/transaction-table'
import { TransactionDrawer } from '@/components/nelayan/transaction-drawer'
import { HandoverForm } from '@/components/nelayan/handover-form'
import { confirmHandover } from '@/app/nelayan/actions'
import { getTranslations } from 'next-intl/server'
import { dashboardCopy } from '@/components/nelayan/content'
import { emptyState, riwayatPage, RIWAYAT_PATH, tableCopy, transactionDrawer } from '@/components/nelayan/riwayat-content'
import { dateLabelFor, loadRiwayat, nelayanSide, parseRiwayatView, riwayatHref } from '@/lib/nelayan/riwayat'
import { getPresenter } from '@/lib/i18n/presenter'
import { transactionChat } from '@/lib/contact/transaction-chat'
import { CancelReservationForm } from '@/components/nelayan/cancel-reservation-form'
import { cancelReservation } from '@/app/transaction-actions'
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
  const t = await getTranslations('dashboard.riwayat')
  const drawerCopy = transactionDrawer(t)
  const RIWAYAT_PAGE = riwayatPage(t)
  const EMPTY_STATE = emptyState(t)

  const [profile, { rows, details, range: shownRange }, catches, transactions, p] = await Promise.all([
    requireProfile('nelayan'),
    loadRiwayat(status, range, order, drawerCopy.steps, nelayanSide(t)),
    getMyCatches(),
    getMyTransactions(),
    getPresenter(),
  ])

  const home = await getTranslations('dashboard.nelayan.home')
  const DASHBOARD = dashboardCopy(home)
  const notifications = recentNotifications(p, home, catches, transactions)
  const name = await displayNameFor(profile)
  const detail = openId ? details.get(openId) : undefined
  const chat = detail && (await transactionChat(detail, 'nelayan', name))
  // Every link keeps the rest of the view; only the part it changes differs.
  const hrefWith = (change: Parameters<typeof riwayatHref>[2]) => riwayatHref(RIWAYAT_PATH, view, change)
  // Clicking the open row's chevron closes its drawer.
  const hrefFor = (id: string) => hrefWith(id === openId ? {} : { transaksi: id })

  return (
    <div className="box-border [flex:1_1_0] flex flex-col gap-0 justify-start items-start relative">
      <DashboardHeader
        greeting={greetingFor(home, name)}
        subtitle={DASHBOARD.subtitle}
        notifications={{ ...DASHBOARD.notifications, unreadCount: notifications.length }}
        user={{ name, initials: initialsOf(profile.full_name) }}
      />
      <MainDecoration />
      <div className="box-border w-full [flex:1_1_0] flex flex-col gap-0 justify-start items-start relative">
        {/* The export pads the content by 424px on the right to leave room for the open drawer. */}
        <div
          className={`box-border w-full [flex:1_1_0] flex flex-col gap-[20px] ${detail ? 'p-[20px_424px_120px_32px]' : 'p-[20px_32px_120px_32px]'} justify-start items-start relative [z-index:2]`}
        >
          <Breadcrumb current={RIWAYAT_PAGE.breadcrumb} />
          <div className="box-border w-full h-fit shrink-0 flex flex-col gap-[6px] justify-start items-start">
            <h2 className="text-[28px]/[32px] box-border text-[#0B3B5C] font-poppins font-bold text-left [white-space:nowrap]">{RIWAYAT_PAGE.title}</h2>
            <p className="text-[15px]/[normal] box-border w-full text-[#5B6B7C] font-inter font-normal text-left">{RIWAYAT_PAGE.subtitle}</p>
          </div>
          <RiwayatFilters action={RIWAYAT_PATH} status={status} range={range} dateLabel={dateLabelFor(p, t, range, shownRange)} />
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
              copy={tableCopy(t)}
            />
          ) : (
            <div className="box-border w-full h-fit shrink-0 flex flex-col gap-0 p-[20px] justify-start items-start bg-[#FFFFFF] [outline:1px_solid_#E2E8F0] [outline-offset:-0.5px] rounded-[16px]">
              <EmptyState icon="history" title={EMPTY_STATE.title} description={EMPTY_STATE.description} />
            </div>
          )}
        </div>
        {detail && (
          <TransactionDrawer
            detail={detail}
            closeHref={hrefFor(detail.id)}
            copy={drawerCopy}
            chat={chat}
            cancel={
              detail.state === 'diproses' && (
                <CancelReservationForm
                  key={`cancel-${detail.id}`}
                  transactionId={detail.id}
                  role="nelayan"
                  returnHref={hrefWith({ transaksi: detail.id })}
                  action={cancelReservation}
                />
              )
            }
            handover={
              detail.state === 'diproses' && (
                // Keyed by transaction so opening another row starts a fresh form.
                <HandoverForm
                  key={`handover-${detail.id}`}
                  transactionId={detail.id}
                  weightKg={detail.weightKg}
                  returnHref={hrefWith({ transaksi: detail.id })}
                  action={confirmHandover}
                />
              )
            }
          />
        )}
      </div>
    </div>
  )
}
