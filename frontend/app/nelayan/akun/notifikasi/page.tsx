import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { MainDecoration } from '@/components/nelayan/main-decoration'
import { AccountSubnav } from '@/components/pembeli/account-subnav'
import { NotificationSettingsForm } from '@/components/dashboard/notification-settings-form'
import { UnsavedChangesProvider } from '@/components/pembeli/unsaved-changes'
import { getTranslations } from 'next-intl/server'
import { akunNav, akunPage, unsavedDialog } from '@/components/nelayan/akun-content'
import { saveNotifications } from '@/app/notification-actions'
import { signOut } from '@/app/auth/actions'
import { getAccountValues } from '@/lib/nelayan/account'
import { getNotificationSettings } from '@/lib/notification-settings'
import { initialsOf } from '@/lib/nelayan/dashboard-data'
import { displayNameOf } from '@/lib/supabase/display-name'

// Akun › Notifikasi for the fisher: the same account layout as Info Pribadi, with which kinds of news show in the
// header bell. The nelayan layout already checks the role.
export default async function NelayanNotifikasiPage() {
  const [profile, settings, t] = await Promise.all([getAccountValues(), getNotificationSettings(), getTranslations('dashboard.akun')])
  const [AKUN_PAGE, AKUN_NAV, UNSAVED_DIALOG] = [akunPage(t), akunNav(t), unsavedDialog(t)]
  const name = displayNameOf({ full_name: profile.fullName, role: 'nelayan' }, { nickname: profile.nickname })

  return (
    <div className="box-border [flex:1_1_0] flex flex-col gap-0 justify-start items-start relative">
      <DashboardHeader
        title={AKUN_PAGE.title}
        subtitle={AKUN_PAGE.subtitle}
        user={{ name, initials: initialsOf(profile.fullName) }}
      />
      <MainDecoration />
      <div className="box-border w-full [flex:1_1_0] flex flex-col gap-[20px] p-[16px_16px_120px_16px] sm:p-[20px_24px_120px_24px] lg:p-[20px_32px_120px_32px] justify-start items-start relative [z-index:2]">
        <UnsavedChangesProvider dialog={UNSAVED_DIALOG}>
          <div className="box-border w-full h-fit shrink-0 flex flex-col lg:flex-row gap-[20px] justify-start items-stretch lg:items-start">
            <AccountSubnav {...AKUN_NAV} signOut={signOut} />
            <section className="box-border [flex:1_1_0] min-w-0 h-fit flex flex-col gap-[24px] p-[20px] sm:p-[28px] justify-start items-start bg-[#FFFFFF] [outline:1px_solid_#E2E8F0] [outline-offset:-0.5px] rounded-[20px]">
              <NotificationSettingsForm role="nelayan" initialValues={settings} action={saveNotifications} />
            </section>
          </div>
        </UnsavedChangesProvider>
      </div>
    </div>
  )
}
