import { getTranslations } from 'next-intl/server'
import { TopBar } from '@/components/pembeli/top-bar'
import { AccountSubnav } from '@/components/pembeli/account-subnav'
import { PreferencesForm } from '@/components/pembeli/preferences-form'
import { UnsavedChangesProvider } from '@/components/pembeli/unsaved-changes'
import { PEMBELI_NOTIFICATIONS } from '@/components/pembeli/content'
import { akunNav, akunPage, unsavedDialog } from '@/components/pembeli/akun-content'
import { savePreferences } from '@/app/pembeli/actions'
import { signOut } from '@/app/auth/actions'
import { getAccountValues } from '@/lib/pembeli/account'
import { getPreferenceValues } from '@/lib/pembeli/preferences'
import { displayNameOf } from '@/lib/supabase/display-name'

// Akun › Preferensi: the account sections beside the search preferences, filled in with what was chosen in part 2
// of registration. The pembeli layout already checks the role.
export default async function PembeliPreferensiPage() {
  const [profile, preferences, t] = await Promise.all([getAccountValues(), getPreferenceValues(), getTranslations('dashboard.akun')])
  const [AKUN_PAGE, AKUN_NAV, UNSAVED_DIALOG] = [akunPage(t), akunNav(t), unsavedDialog(t)]
  const name = displayNameOf(
    { full_name: profile.contactName, role: 'pembeli' },
    { nickname: profile.nickname, business_name: profile.businessName },
  )

  return (
    <div className="box-border [flex:1_1_0] flex flex-col gap-[28px] p-[32px] justify-start items-start">
      <TopBar greeting={AKUN_PAGE.title} subtitle={AKUN_PAGE.subtitle} notifications={PEMBELI_NOTIFICATIONS} user={{ name }} />
      <UnsavedChangesProvider dialog={UNSAVED_DIALOG}>
        <div className="box-border w-full h-fit shrink-0 flex flex-row gap-[20px] justify-start items-start">
          <AccountSubnav {...AKUN_NAV} signOut={signOut} />
          <section className="box-border [flex:1_1_0] min-w-0 h-fit flex flex-col gap-[24px] p-[28px] justify-start items-start bg-[#FFFFFF] [outline:1px_solid_#E2E8F0] [outline-offset:-0.5px] rounded-[20px]">
            <PreferencesForm initialValues={preferences} action={savePreferences} />
          </section>
        </div>
      </UnsavedChangesProvider>
    </div>
  )
}
