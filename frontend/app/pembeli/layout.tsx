import { Sidebar } from '@/components/dashboard/sidebar'
import { getTranslations } from 'next-intl/server'
import { PEMBELI_NAV, PEMBELI_NOTIFICATIONS } from '@/components/pembeli/content'
import { initialsOf } from '@/lib/nelayan/dashboard-data'
import { requireProfile } from '@/lib/supabase/auth'
import { displayNameFor } from '@/lib/supabase/display-name'

// The "08 Dashboard Pembeli" frame: a 260px sidebar beside a fluid main column. Designed at 1440×1100; like the
// nelayan dashboard it keeps the 1440px width as a minimum, but is only as tall as the window or its content —
// a page that fits the window doesn't scroll.
export default async function PembeliLayout({ children }: { children: React.ReactNode }) {
  // Guards the whole area, /marketplace included: no session goes to login, a nelayan to their own dashboard.
  const profile = await requireProfile('pembeli')
  const name = await displayNameFor(profile)
  const t = await getTranslations('nav')

  return (
    <div className="box-border w-full min-w-[1440px] min-h-dvh flex flex-row gap-0 justify-start items-stretch bg-[#F7F9FC] overflow-clip">
      <Sidebar
        role="pembeli"
        nav={PEMBELI_NAV}
        accountHref="/pembeli/akun"
        notifications={PEMBELI_NOTIFICATIONS}
        user={{ name, role: t('roles.pembeli'), initials: initialsOf(name) }}
      />
      {children}
    </div>
  )
}
