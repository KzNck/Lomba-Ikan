import { Sidebar } from '@/components/dashboard/sidebar'
import { PEMBELI_NAV, PEMBELI_NOTIFICATIONS, PEMBELI_ROLE_LABEL } from '@/components/pembeli/content'
import { requireProfile } from '@/lib/supabase/auth'
import { createClient } from '@/lib/supabase/server'
import { displayName } from '@/lib/pembeli/account'

// The "08 Dashboard Pembeli" frame: a 260px sidebar beside a fluid main column. Designed at 1440×1100; like the
// nelayan dashboard it keeps that as its minimum size and grows to fill larger windows.
export default async function PembeliLayout({ children }: { children: React.ReactNode }) {
  // Guards the whole area, /marketplace included: no session goes to login, a nelayan to their own dashboard.
  const profile = await requireProfile('pembeli')
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="box-border w-full min-w-[1440px] min-h-[max(100dvh,1100px)] flex flex-row gap-0 justify-start items-stretch bg-[#F7F9FC] overflow-clip">
      <Sidebar
        role="pembeli"
        nav={PEMBELI_NAV}
        accountHref="/pembeli/akun"
        notifications={PEMBELI_NOTIFICATIONS}
        user={{ name: displayName(profile, user?.user_metadata), role: PEMBELI_ROLE_LABEL }}
      />
      {children}
    </div>
  )
}
