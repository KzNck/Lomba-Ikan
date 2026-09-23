import { getTranslations } from 'next-intl/server'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { initialsOf } from '@/lib/nelayan/dashboard-data'
import { AccountSubnav } from '@/components/pembeli/account-subnav'
import { NotificationSettingsForm } from '@/components/dashboard/notification-settings-form'
import { UnsavedChangesProvider } from '@/components/pembeli/unsaved-changes'
import { akunNav, akunPage, unsavedDialog } from '@/components/pembeli/akun-content'
import { saveNotifications } from '@/app/notification-actions'
import { signOut } from '@/app/auth/actions'
import { getAccountValues } from '@/lib/pembeli/account'
import { getNotificationSettings } from '@/lib/notification-settings'
import { displayNameOf } from '@/lib/supabase/display-name'

// Akun › Notifikasi: which kinds of news show in the buyer's header bell. The pembeli layout already checks the role.
export default async function PembeliNotifikasiPage() {
  const [profile, settings, t] = await Promise.all([getAccountValues(), getNotificationSettings(), getTranslations('dashboard.akun')])
  const [AKUN_PAGE, AKUN_NAV, UNSAVED_DIALOG] = [akunPage(t), akunNav(t), unsavedDialog(t)]
  const name = displayNameOf(
    { full_name: profile.contactName, role: 'pembeli' },
    { nickname: profile.nickname, business_name: profile.businessName },
  )

  return (
    <div className="box-border [flex:1_1_0] flex flex-col gap-0 justify-start items-start relative">
      <DashboardHeader
        title={AKUN_PAGE.title}
        subtitle={AKUN_PAGE.subtitle}
        user={{ name, initials: initialsOf(name) }}
        accountHref="/pembeli/akun"
      />
      <div className="box-border w-full [flex:1_1_0] flex flex-col gap-[20px] p-[16px] sm:p-[24px] lg:p-[32px] justify-start items-start">
        <UnsavedChangesProvider dialog={UNSAVED_DIALOG}>
          <div className="box-border w-full h-fit shrink-0 flex flex-col lg:flex-row gap-[20px] justify-start items-stretch lg:items-start">
            <AccountSubnav {...AKUN_NAV} signOut={signOut} />
            <section className="box-border [flex:1_1_0] min-w-0 h-fit flex flex-col gap-[24px] p-[20px] sm:p-[28px] justify-start items-start bg-[#FFFFFF] [outline:1px_solid_#E2E8F0] [outline-offset:-0.5px] rounded-[20px]">
              <NotificationSettingsForm role="pembeli" initialValues={settings} action={saveNotifications} />
            </section>
          </div>
        </UnsavedChangesProvider>
      </div>
    </div>
  )
}
