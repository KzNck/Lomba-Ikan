import { getTranslations } from 'next-intl/server'
import { TopBar } from '@/components/pembeli/top-bar'
import { EmptyState } from '@/components/nelayan/empty-state'
import { RiwayatFilters } from '@/components/nelayan/riwayat-filters'
import { TransactionTable } from '@/components/nelayan/transaction-table'
import { TransactionDrawer } from '@/components/nelayan/transaction-drawer'
import { PEMBELI_NOTIFICATIONS } from '@/components/pembeli/content'
import {
  drawerCopy,
  emptyState,
  pembeliSide,
  riwayatPage,
  RIWAYAT_PATH,
  tableCopyPembeli,
} from '@/components/pembeli/riwayat-content'
import { dateLabelFor, loadRiwayat, parseRiwayatView, riwayatHref } from '@/lib/nelayan/riwayat'
import { getPresenter } from '@/lib/i18n/presenter'
import { requireProfile } from '@/lib/supabase/auth'
import { displayNameFor } from '@/lib/supabase/display-name'

// The pembeli purchase history, built from the nelayan "13 Riwayat Transaksi" frame: the same filters, table and
// drawer, inside the pembeli top bar. The URL holds the view the same way — ?status=, ?dari= / ?sampai=, ?urut=, and
// ?transaksi=<id> for the open drawer.
export default async function PembeliRiwayatPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const view = parseRiwayatView(await searchParams)
  const { status, range, order, openId } = view
  const t = await getTranslations('dashboard.riwayat')
  const DRAWER_COPY = drawerCopy(t)
  const RIWAYAT_PAGE = riwayatPage(t)
  const EMPTY_STATE = emptyState(t)

  const [profile, { rows, details, range: shownRange }, p] = await Promise.all([
    requireProfile('pembeli'),
    loadRiwayat(status, range, order, DRAWER_COPY.steps, pembeliSide(t)),
    getPresenter(),
  ])
  const name = await displayNameFor(profile)

  const detail = openId ? details.get(openId) : undefined
  const hrefWith = (change: Parameters<typeof riwayatHref>[2]) => riwayatHref(RIWAYAT_PATH, view, change)
  // Clicking the open row's chevron closes its drawer.
  const hrefFor = (id: string) => hrefWith(id === openId ? {} : { transaksi: id })

  return (
    <div className="box-border [flex:1_1_0] flex flex-col gap-0 justify-start items-start relative">
      <div className="box-border w-full h-fit shrink-0 p-[32px_32px_0px_32px]">
        <TopBar greeting={RIWAYAT_PAGE.title} subtitle={RIWAYAT_PAGE.subtitle} notifications={PEMBELI_NOTIFICATIONS} user={{ name }} />
      </div>
      {/* The drawer docks to the right of this area, under the top bar; the content makes room for it (400px + 24px). */}
      <div className="box-border w-full [flex:1_1_0] flex flex-col gap-0 justify-start items-start relative">
        <div
          className={`box-border w-full [flex:1_1_0] flex flex-col gap-[20px] ${detail ? 'p-[28px_424px_32px_32px]' : 'p-[28px_32px_32px_32px]'} justify-start items-start`}
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
              copy={tableCopyPembeli(t)}
            />
          ) : (
            <div className="box-border w-full h-fit shrink-0 flex flex-col gap-0 p-[20px] justify-start items-start bg-[#FFFFFF] [outline:1px_solid_#E2E8F0] [outline-offset:-0.5px] rounded-[16px]">
              <EmptyState
                icon="history"
                title={EMPTY_STATE.title}
                description={EMPTY_STATE.description}
                action={EMPTY_STATE.action}
                actionIcon="store"
              />
            </div>
          )}
        </div>
        {detail && <TransactionDrawer detail={detail} closeHref={hrefFor(detail.id)} copy={DRAWER_COPY} />}
      </div>
    </div>
  )
}
