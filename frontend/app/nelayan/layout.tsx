import { Sidebar } from '@/components/dashboard/sidebar'
import { NELAYAN_NAV, NELAYAN_ROLE_LABEL } from '@/components/nelayan/content'
import { requireProfile } from '@/lib/supabase/auth'
import { initialsOf } from '@/lib/nelayan/dashboard-data'
import { displayNameFor } from '@/lib/supabase/display-name'

// The "06 Dashboard Nelayan" frame: a 260px sidebar beside a fluid main column. Designed at 1440×1100; it keeps
// that as its minimum size and grows to fill larger windows. overflow-clip (not hidden) so the sidebar can stick.
export default async function NelayanLayout({ children }: { children: React.ReactNode }) {
  // Guards the whole area: no session goes to login, a pembeli goes to their own dashboard.
  const profile = await requireProfile('nelayan')
  const name = await displayNameFor(profile)

  return (
    <div className="box-border w-full min-w-[1440px] min-h-[max(100dvh,1100px)] flex flex-row gap-0 justify-start items-stretch bg-[#F7F9FC] overflow-clip">
      <Sidebar
        role="nelayan"
        nav={NELAYAN_NAV}
        accountHref="/nelayan/akun"
        user={{
          name,
          role: NELAYAN_ROLE_LABEL,
          initials: initialsOf(profile.full_name),
        }}
      />
      {children}
    </div>
  )
}
