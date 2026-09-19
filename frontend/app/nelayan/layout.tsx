import { Sidebar } from '@/components/nelayan/sidebar'
import { NELAYAN_NAV, NELAYAN_USER } from '@/components/nelayan/content'

// The "06 Dashboard Nelayan" frame: a 260px sidebar beside a fluid main column. Designed at 1440×1100; it keeps
// that as its minimum size and grows to fill larger windows. overflow-clip (not hidden) so the sidebar can stick.
export default function NelayanLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="box-border w-full min-w-[1440px] min-h-[max(100dvh,1100px)] flex flex-row gap-0 justify-start items-stretch bg-[#F7F9FC] overflow-clip">
      <Sidebar nav={NELAYAN_NAV} user={NELAYAN_USER} />
      {children}
    </div>
  )
}
