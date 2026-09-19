import { Sidebar } from '@/components/dashboard/sidebar'
import { PEMBELI_NAV, PEMBELI_NOTIFICATIONS, PEMBELI_USER } from '@/components/pembeli/content'

// The "08 Dashboard Pembeli" frame: a 260px sidebar beside a fluid main column. Designed at 1440×1100; like the
// nelayan dashboard it keeps that as its minimum size and grows to fill larger windows.
export default function PembeliLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="box-border w-full min-w-[1440px] min-h-[max(100dvh,1100px)] flex flex-row gap-0 justify-start items-stretch bg-[#F7F9FC] overflow-clip">
      <Sidebar role="pembeli" nav={PEMBELI_NAV} notifications={PEMBELI_NOTIFICATIONS} user={PEMBELI_USER} />
      {children}
    </div>
  )
}
