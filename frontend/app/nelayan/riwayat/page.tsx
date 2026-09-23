import { Icon } from '@/components/ui/icon'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { MainDecoration } from '@/components/nelayan/main-decoration'
import { EmptyState } from '@/components/nelayan/empty-state'
import { RiwayatFilters } from '@/components/nelayan/riwayat-filters'
import { TransactionTable } from '@/components/nelayan/transaction-table'
import { TransactionDrawer } from '@/components/nelayan/transaction-drawer'
import { HandoverForm } from '@/components/nelayan/handover-form'
import { confirmHandover } from '@/app/nelayan/actions'
import { getTranslations } from 'next-intl/server'
import { emptyState, riwayatPage, RIWAYAT_PATH, tableCopy, transactionDrawer } from '@/components/nelayan/riwayat-content'
import { dateLabelFor, loadRiwayat, nelayanSide, parseRiwayatView, riwayatHref } from '@/lib/nelayan/riwayat'
import { getPresenter } from '@/lib/i18n/presenter'
import { transactionChat } from '@/lib/contact/transaction-chat'
import { CancelReservationForm } from '@/components/nelayan/cancel-reservation-form'
import { cancelReservation } from '@/app/transaction-actions'
import { requireProfile } from '@/lib/supabase/auth'
import { displayNameFor } from '@/lib/supabase/display-name'
import { initialsOf } from '@/lib/nelayan/dashboard-data'

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

  const [profile, { rows, details, range: shownRange }, p] = await Promise.all([
    requireProfile('nelayan'),
    loadRiwayat(status, range, order, drawerCopy.steps, nelayanSide(t)),
    getPresenter(),
  ])

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
        title={RIWAYAT_PAGE.title}
        subtitle={RIWAYAT_PAGE.subtitle}
        user={{ name, initials: initialsOf(profile.full_name) }}
      />
      <MainDecoration />
      <div className="box-border w-full [flex:1_1_0] flex flex-col gap-0 justify-start items-start relative">
        {/* The export pads the content by 424px on the right to leave room for the open drawer. */}
        <div
          className={`box-border w-full [flex:1_1_0] flex flex-col gap-[20px] p-[16px_16px_120px_16px] sm:p-[20px_24px_120px_24px] ${detail ? 'lg:p-[20px_424px_120px_32px]' : 'lg:p-[20px_32px_120px_32px]'} justify-start items-start relative [z-index:2]`}
        >
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
              detail.state === 'diproses' &&
              (detail.pickup.receipt === 'pending' ? (
                // Both sides confirm the pickup: the buyer's "Batch sudah diterima" comes first.
                <p className="box-border w-full h-fit shrink-0 flex flex-row gap-[10px] p-[12px_14px] justify-start items-start bg-[#FFF4E0] rounded-[12px]">
                  <Icon name="clock-3" fill="#8A5100" className="box-border w-[16px] shrink-0 h-[16px] mt-[1px]" />
                  <span className="text-[12px]/[18px] box-border [flex:1_1_0] text-[#8A5100] font-inter font-medium text-left">
                    {t('handover.awaitingBuyer')}
                  </span>
                </p>
              ) : (
                // Keyed by transaction so opening another row starts a fresh form.
                <HandoverForm
                  key={`handover-${detail.id}`}
                  transactionId={detail.id}
                  weightKg={detail.weightKg}
                  returnHref={hrefWith({ transaksi: detail.id })}
                  action={confirmHandover}
                />
              ))
            }
          />
        )}
      </div>
    </div>
  )
}
