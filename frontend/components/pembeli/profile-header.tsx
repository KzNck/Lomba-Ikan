import { Icon, type IconName } from '@/components/ui/icon'
import { UserAvatar } from '@/components/dashboard/user-avatar'
import { ChangePhotoButton } from '@/components/dashboard/change-photo-button'
import { currentAvatar } from '@/lib/supabase/avatar'

type ProfileHeaderProps = {
  // The avatar's placeholder until a photo is uploaded: a building for pembeli, a boat for nelayan.
  icon?: IconName
  name: string
  roleLabel: string
  email: string
  location: string
}

// "Profile Header" at the top of the account form card: the profile photo (or the role icon until there is one), the
// name and contact lines, then "Atur foto" (once there is a photo) and "Ubah foto".
export async function ProfileHeader({ icon = 'building-2', name, roleLabel, email, location }: ProfileHeaderProps) {
  const photo = await currentAvatar()
  return (
    <div className="box-border w-full h-fit shrink-0 flex flex-row flex-wrap sm:flex-nowrap gap-[16px] sm:gap-[20px] p-[0px_0px_24px_0px] justify-start items-center [border-width:0px_0px_1px_0px] [border-style:solid] [border-color:#E2E8F0]">
      <div className="box-border w-[64px] shrink-0 h-[64px] sm:w-[80px] sm:h-[80px] flex flex-row gap-0 justify-center items-center bg-[#DCEEFB] rounded-[999px] overflow-hidden relative">
        <UserAvatar sizes="80px" fallback={<Icon name={icon} fill="#0F6CB8" className="box-border w-[36px] shrink-0 h-[36px]" />} />
      </div>
      <div className="box-border [flex:1_1_0] min-w-0 lg:min-w-auto h-fit flex flex-col gap-[6px] justify-start items-start">
        <div className="box-border w-fit max-w-full h-fit shrink-0 flex flex-row flex-wrap sm:flex-nowrap gap-[10px] justify-start items-center">
          <p className="text-[20px]/[normal] box-border text-[#0B3B5C] font-poppins font-semibold text-left sm:[white-space:nowrap]">{name}</p>
          <span className="box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[3px_10px] justify-start items-start bg-[#DCEEFB] rounded-[999px]">
            <span className="text-[12px]/[normal] box-border text-[#0F6CB8] font-poppins font-semibold text-left [white-space:nowrap]">{roleLabel}</span>
          </span>
        </div>
        <p className="text-[14px]/[normal] box-border max-w-full text-[#5B6B7C] font-inter font-normal text-left [overflow-wrap:anywhere] sm:[overflow-wrap:normal] sm:[white-space:nowrap]">{email}</p>
        <p className="box-border w-fit max-w-full h-fit shrink sm:shrink-0 flex flex-row gap-[6px] justify-start items-center">
          <Icon name="map-pin" fill="#5B6B7C" className="box-border w-[14px] shrink-0 h-[14px]" />
          <span className="text-[13px]/[normal] box-border min-w-0 text-[#5B6B7C] font-inter font-normal text-left sm:[white-space:nowrap]">{location}</span>
        </p>
      </div>
      <ChangePhotoButton photo={photo} />
    </div>
  )
}
