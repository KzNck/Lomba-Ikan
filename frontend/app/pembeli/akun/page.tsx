import { getTranslations } from 'next-intl/server'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { initialsOf } from '@/lib/nelayan/dashboard-data'
import { AccountSubnav } from '@/components/pembeli/account-subnav'
import { ProfileHeader } from '@/components/pembeli/profile-header'
import { AccountInfoForm } from '@/components/pembeli/account-info-form'
import { UnsavedChangesProvider } from '@/components/pembeli/unsaved-changes'
import { PEMBELI_NOTIFICATIONS } from '@/components/pembeli/content'
import { akunNav, akunPage, profileHeader, unsavedDialog } from '@/components/pembeli/akun-content'
import { saveAccount } from '@/app/pembeli/actions'
import { signOut } from '@/app/auth/actions'
import { getAccountValues } from '@/lib/pembeli/account'
import { PROVINSI, getKabupatenKota } from '@/lib/wilayah'
import { displayNameOf } from '@/lib/supabase/display-name'

// "Kota Surabaya, Jawa Timur" → "Surabaya, Jawa Timur", as the profile header shows it.
function locationLabel(provinsiKode: string, kabKotaKode: string) {
  const provinsi = PROVINSI.find(({ kode }) => kode === provinsiKode)?.nama
  const kabKota = getKabupatenKota(provinsiKode).find(({ kode }) => kode === kabKotaKode)?.nama
  return [kabKota?.replace(/^(Kota|Kabupaten) /, ''), provinsi].filter(Boolean).join(', ')
}

// The "12 Akun (Pembeli)" frame: the account sections beside the Info Pribadi form.
export default async function PembeliAkunPage() {
  const [profile, t, nav] = await Promise.all([getAccountValues(), getTranslations('dashboard.akun'), getTranslations('nav')])
  const [AKUN_PAGE, AKUN_NAV, UNSAVED_DIALOG] = [akunPage(t), akunNav(t), unsavedDialog(t)]
  const PROFILE_HEADER = profileHeader(t, nav('roles.pembeli'))
  const name = displayNameOf(
    { full_name: profile.contactName, role: 'pembeli' },
    { nickname: profile.nickname, business_name: profile.businessName },
  )

  return (
    <div className="box-border [flex:1_1_0] flex flex-col gap-0 justify-start items-start relative">
      <DashboardHeader
        title={AKUN_PAGE.title}
        subtitle={AKUN_PAGE.subtitle}
        notifications={PEMBELI_NOTIFICATIONS}
        user={{ name, initials: initialsOf(name) }}
        accountHref="/pembeli/akun"
      />
      <div className="box-border w-full [flex:1_1_0] flex flex-col gap-[20px] p-[16px] sm:p-[24px] lg:p-[32px] justify-start items-start">
        <UnsavedChangesProvider dialog={UNSAVED_DIALOG}>
          <div className="box-border w-full h-fit shrink-0 flex flex-col lg:flex-row gap-[20px] justify-start items-stretch lg:items-start">
            <AccountSubnav {...AKUN_NAV} signOut={signOut} />
            <section className="box-border [flex:1_1_0] min-w-0 h-fit flex flex-col gap-[24px] p-[20px] sm:p-[28px] justify-start items-start bg-[#FFFFFF] [outline:1px_solid_#E2E8F0] [outline-offset:-0.5px] rounded-[20px]">
              <ProfileHeader
                name={profile.businessName || profile.contactName}
                roleLabel={PROFILE_HEADER.roleLabel}
                email={profile.email}
                location={locationLabel(profile.provinsi, profile.kabKota)}
                changePhoto={PROFILE_HEADER.changePhoto}
              />
              <AccountInfoForm initialValues={profile} action={saveAccount} />
            </section>
          </div>
        </UnsavedChangesProvider>
      </div>
    </div>
  )
}
