import { Sidebar } from '@/components/dashboard/sidebar'
import { getTranslations } from 'next-intl/server'
import { NELAYAN_NAV } from '@/components/nelayan/content'
import { requireProfile } from '@/lib/supabase/auth'
import { initialsOf } from '@/lib/nelayan/dashboard-data'
import { displayNameFor } from '@/lib/supabase/display-name'

// The "06 Dashboard Nelayan" frame: a 260px sidebar beside a fluid main column. Designed at 1440×1100; it keeps the
// 1440px width as a minimum, but is only as tall as the window or its content, so a page that fits the window (a
// short "Listing Saya", say) doesn't scroll. overflow-clip (not hidden) so the sidebar can stick.
export default async function NelayanLayout({ children }: { children: React.ReactNode }) {
  // Guards the whole area: no session goes to login, a pembeli goes to their own dashboard.
  const profile = await requireProfile('nelayan')
  const name = await displayNameFor(profile)
  const t = await getTranslations('nav')

  return (
    <div className="box-border w-full min-w-[1440px] min-h-dvh flex flex-row gap-0 justify-start items-stretch bg-[#F7F9FC] overflow-clip">
      <Sidebar
        role="nelayan"
        nav={NELAYAN_NAV}
        accountHref="/nelayan/akun"
        user={{
          name,
          role: t('roles.nelayan'),
          initials: initialsOf(profile.full_name),
        }}
      />
      {children}
    </div>
  )
}
