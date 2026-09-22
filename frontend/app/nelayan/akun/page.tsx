import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { MainDecoration } from '@/components/nelayan/main-decoration'
import { AccountInfoForm } from '@/components/nelayan/account-info-form'
import { AccountSubnav } from '@/components/pembeli/account-subnav'
import { ProfileHeader } from '@/components/pembeli/profile-header'
import { UnsavedChangesProvider } from '@/components/pembeli/unsaved-changes'
import { getTranslations } from 'next-intl/server'
import { akunNav, akunPage, profileHeader, unsavedDialog } from '@/components/nelayan/akun-content'
import { saveAccount } from '@/app/nelayan/actions'
import { signOut } from '@/app/auth/actions'
import { getAccountValues } from '@/lib/nelayan/account'
import { initialsOf } from '@/lib/nelayan/dashboard-data'
import { displayNameOf } from '@/lib/supabase/display-name'
import { getLokasiPelabuhan, getPelabuhanById } from '@/lib/wilayah'

// "PPI Muncar · Banyuwangi, Jawa Timur", as the profile header shows the landing site.
function ppiLabel(ppiId: string, noPpi: string) {
  const pelabuhan = getPelabuhanById(ppiId)
  if (!pelabuhan) return noPpi
  return `${pelabuhan.nama} · ${getLokasiPelabuhan(pelabuhan).replace(/^(Kota|Kabupaten) /, '')}`
}

// The nelayan account page. No frame of its own yet: the pembeli "12 Akun" layout (sections beside the Info Pribadi
// card) inside the fisher's dashboard chrome, with the fisher's fields.
export default async function NelayanAkunPage() {
  const [profile, t, nav] = await Promise.all([
    getAccountValues(),
    getTranslations('dashboard.akun'),
    getTranslations('nav'),
  ])
  const [AKUN_PAGE, AKUN_NAV, UNSAVED_DIALOG] = [akunPage(t), akunNav(t), unsavedDialog(t)]
  const PROFILE_HEADER = profileHeader(t, nav('roles.nelayan'))
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
              <ProfileHeader
                icon="sailboat"
                name={profile.fullName}
                roleLabel={PROFILE_HEADER.roleLabel}
                email={profile.email}
                location={ppiLabel(profile.ppi, PROFILE_HEADER.noPpi)}
              />
              <AccountInfoForm initialValues={profile} action={saveAccount} />
            </section>
          </div>
        </UnsavedChangesProvider>
      </div>
    </div>
  )
}
