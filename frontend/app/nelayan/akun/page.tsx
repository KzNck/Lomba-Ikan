import { DashboardHeader } from '@/components/nelayan/dashboard-header'
import { Breadcrumb } from '@/components/nelayan/breadcrumb'
import { MainDecoration } from '@/components/nelayan/main-decoration'
import { AccountInfoForm } from '@/components/nelayan/account-info-form'
import { AccountSubnav } from '@/components/pembeli/account-subnav'
import { ProfileHeader } from '@/components/pembeli/profile-header'
import { UnsavedChangesProvider } from '@/components/pembeli/unsaved-changes'
import { DASHBOARD } from '@/components/nelayan/content'
import { AKUN_NAV, AKUN_PAGE, PROFILE_HEADER, UNSAVED_DIALOG } from '@/components/nelayan/akun-content'
import { saveAccount } from '@/app/nelayan/actions'
import { signOut } from '@/app/auth/actions'
import { getAccountValues } from '@/lib/nelayan/account'
import { getMyCatches } from '@/lib/supabase/catches'
import { getMyTransactions } from '@/lib/supabase/transactions'
import { greetingFor, initialsOf, recentNotifications } from '@/lib/nelayan/dashboard-data'
import { displayNameOf } from '@/lib/supabase/display-name'
import { getLokasiPelabuhan, getPelabuhanById } from '@/lib/wilayah'

// "PPI Muncar · Banyuwangi, Jawa Timur", as the profile header shows the landing site.
function ppiLabel(ppiId: string) {
  const pelabuhan = getPelabuhanById(ppiId)
  if (!pelabuhan) return PROFILE_HEADER.noPpi
  return `${pelabuhan.nama} · ${getLokasiPelabuhan(pelabuhan).replace(/^(Kota|Kabupaten) /, '')}`
}

// The nelayan account page. No frame of its own yet: the pembeli "12 Akun" layout (sections beside the Info Pribadi
// card) inside the fisher's dashboard chrome, with the fisher's fields.
export default async function NelayanAkunPage() {
  const [profile, catches, transactions] = await Promise.all([getAccountValues(), getMyCatches(), getMyTransactions()])
  const notifications = recentNotifications(catches, transactions)
  const name = displayNameOf({ full_name: profile.fullName, role: 'nelayan' }, { nickname: profile.nickname })

  return (
    <div className="box-border [flex:1_1_0] flex flex-col gap-0 justify-start items-start relative">
      <DashboardHeader
        greeting={greetingFor(name)}
        subtitle={DASHBOARD.subtitle}
        notifications={{ ...DASHBOARD.notifications, unreadCount: notifications.length }}
        user={{ name, initials: initialsOf(profile.fullName) }}
      />
      <MainDecoration />
      <div className="box-border w-full [flex:1_1_0] flex flex-col gap-[20px] p-[20px_32px_32px_32px] justify-start items-start relative [z-index:2]">
        <Breadcrumb current={AKUN_PAGE.breadcrumb} />
        <div className="box-border w-full h-fit shrink-0 flex flex-col gap-[6px] justify-start items-start">
          <h2 className="text-[28px]/[32px] box-border text-[#0B3B5C] font-poppins font-bold text-left [white-space:nowrap]">{AKUN_PAGE.title}</h2>
          <p className="text-[15px]/[normal] box-border w-full text-[#5B6B7C] font-inter font-normal text-left">{AKUN_PAGE.subtitle}</p>
        </div>
        <UnsavedChangesProvider dialog={UNSAVED_DIALOG}>
          <div className="box-border w-full h-fit shrink-0 flex flex-row gap-[20px] justify-start items-start">
            <AccountSubnav {...AKUN_NAV} signOut={signOut} />
            <section className="box-border [flex:1_1_0] min-w-0 h-fit flex flex-col gap-[24px] p-[28px] justify-start items-start bg-[#FFFFFF] [outline:1px_solid_#E2E8F0] [outline-offset:-0.5px] rounded-[20px]">
              <ProfileHeader
                icon="sailboat"
                name={profile.fullName}
                roleLabel={PROFILE_HEADER.roleLabel}
                email={profile.email}
                location={ppiLabel(profile.ppi)}
                changePhoto={{ label: PROFILE_HEADER.changePhotoLabel, unavailable: PROFILE_HEADER.changePhotoUnavailable }}
              />
              <AccountInfoForm initialValues={profile} action={saveAccount} />
            </section>
          </div>
        </UnsavedChangesProvider>
      </div>
    </div>
  )
}
