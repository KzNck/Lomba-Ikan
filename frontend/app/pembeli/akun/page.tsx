import { TopBar } from '@/components/pembeli/top-bar'
import { AccountSubnav } from '@/components/pembeli/account-subnav'
import { ProfileHeader } from '@/components/pembeli/profile-header'
import { AccountInfoForm } from '@/components/pembeli/account-info-form'
import { UnsavedChangesProvider } from '@/components/pembeli/unsaved-changes'
import { PEMBELI_NOTIFICATIONS } from '@/components/pembeli/content'
import { AKUN_NAV, AKUN_PAGE, PROFILE_HEADER, UNSAVED_DIALOG } from '@/components/pembeli/akun-content'
import { saveAccount } from '@/app/pembeli/actions'
import { signOut } from '@/app/auth/actions'
import { getAccountValues } from '@/lib/pembeli/account'
import { PROVINSI, getKabupatenKota } from '@/lib/wilayah'

// "Kota Surabaya, Jawa Timur" → "Surabaya, Jawa Timur", as the profile header shows it.
function locationLabel(provinsiKode: string, kabKotaKode: string) {
  const provinsi = PROVINSI.find(({ kode }) => kode === provinsiKode)?.nama
  const kabKota = getKabupatenKota(provinsiKode).find(({ kode }) => kode === kabKotaKode)?.nama
  return [kabKota?.replace(/^(Kota|Kabupaten) /, ''), provinsi].filter(Boolean).join(', ')
}

// The "12 Akun (Pembeli)" frame: the account sections beside the Info Pribadi form.
export default async function PembeliAkunPage() {
  const profile = await getAccountValues()

  return (
    <div className="box-border [flex:1_1_0] flex flex-col gap-[28px] p-[32px] justify-start items-start">
      <TopBar
        greeting={AKUN_PAGE.title}
        subtitle={AKUN_PAGE.subtitle}
        notifications={PEMBELI_NOTIFICATIONS}
        user={{ name: profile.businessName || profile.contactName }}
      />
      <UnsavedChangesProvider dialog={UNSAVED_DIALOG}>
        <div className="box-border w-full h-fit shrink-0 flex flex-row gap-[20px] justify-start items-start">
          <AccountSubnav {...AKUN_NAV} signOut={signOut} />
          <section className="box-border [flex:1_1_0] min-w-0 h-fit flex flex-col gap-[24px] p-[28px] justify-start items-start bg-[#FFFFFF] [outline:1px_solid_#E2E8F0] [outline-offset:-0.5px] rounded-[20px]">
            <ProfileHeader
              name={profile.businessName || profile.contactName}
              roleLabel={PROFILE_HEADER.roleLabel}
              email={profile.email}
              location={locationLabel(profile.provinsi, profile.kabKota)}
              changePhoto={{ label: PROFILE_HEADER.changePhotoLabel, unavailable: PROFILE_HEADER.changePhotoUnavailable }}
            />
            <AccountInfoForm initialValues={profile} action={saveAccount} />
          </section>
        </div>
      </UnsavedChangesProvider>
    </div>
  )
}
