import { AccountMenu } from '@/components/dashboard/account-menu'
import { LanguageSwitcher } from '@/components/ui/language-switcher'
import { FOCUS_RING } from '@/components/nelayan/focus-ring'
import { UserAvatar } from '@/components/dashboard/user-avatar'
import { NotificationBell } from '@/components/dashboard/notification-bell'

type DashboardHeaderProps = {
  // The time-of-day greeting on the Dashboard; the page's own title everywhere else.
  title: string
  subtitle: string
  // The waving hand, which belongs to the Dashboard's greeting only.
  wave?: boolean
  // The avatar shows the profile photo when there is one (UserAvatar reads it from the session), else the initials.
  user: { name: string; initials: string }
  // Where the account menu's "Akun" item goes.
  accountHref?: string
}

// The export sizes this bar as content-box w-[1180px] plus 64px padding, which overflows the 1180px column and
// pushes the right-hand cards off-frame; it's border-box full width here, which is what the design shows.
// No z-index of its own: that would trap the account menu below the main column (z-index 2) and the drawers (3).
export function DashboardHeader({
  title,
  subtitle,
  wave = false,
  user,
  accountHref = '/nelayan/akun',
}: DashboardHeaderProps) {
  // Below lg the title takes its own line and the controls wrap under it.
  return (
    <header className="box-border w-full h-fit shrink-0 flex flex-row flex-wrap lg:flex-nowrap gap-x-[12px] gap-y-[14px] lg:gap-0 p-[16px] sm:p-[20px_24px] lg:p-[20px_32px] justify-between items-center bg-[#FFFFFF] [border-width:0px_0px_1px_0px] [border-style:solid] [border-color:#E2E8F0] [margin:0px_0px_-0.5px_0px] relative">
      <div className="box-border w-full lg:w-fit shrink-0 h-fit flex flex-col gap-[4px] justify-start items-start">
        <div className="box-border w-fit h-fit shrink-0 flex flex-row gap-[8px] justify-start items-center motion-safe:animate-fade-up">
          <h1 className="text-[20px]/[normal] sm:text-[22px]/[normal] box-border text-[#0B3B5C] font-poppins font-semibold text-left lg:[white-space:nowrap]">
            {title}
          </h1>
          {wave && (
            <span aria-hidden="true" className="text-[20px]/[normal] box-border text-[#0B3B5C] font-inter font-normal text-left [white-space:nowrap]">
              👋
            </span>
          )}
        </div>
        <p
          className="text-[14px]/[20px] lg:text-[14px]/[normal] box-border text-[#5B6B7C] font-inter font-normal text-left lg:[white-space:nowrap] motion-safe:animate-fade-up"
          style={{ animationDelay: '80ms' }}
        >
          {subtitle}
        </p>
      </div>
      {/* Below lg the row spans the header: the switcher on the left edge, the bell and account on the right. */}
      <div className="box-border w-full lg:w-fit shrink-0 h-fit flex flex-row gap-[12px] lg:gap-[20px] justify-start items-center">
        {/* The same switcher as the landing navbar. */}
        <LanguageSwitcher startBelowLg />
        {/* The feed comes from the role layout (see NotificationsProvider). */}
        <NotificationBell />
        <div className="box-border w-[1px] shrink-0 h-[36px] bg-[#E2E8F0]" />
        {/* The design draws a pill with a chevron; it opens the account menu (Akun, then Keluar). */}
        <div className="box-border w-fit shrink-0 h-fit">
          <AccountMenu
            name={user.name}
            accountHref={accountHref}
            placement="below"
            chevronFill="#5B6B7C"
            triggerClassName={`box-border w-fit shrink-0 h-fit flex flex-row gap-[12px] p-[4px] m-[-4px] justify-start items-center rounded-[999px] cursor-pointer hover:bg-[#F3FAFF] transition-colors duration-200 ease-out ${FOCUS_RING}`}
          >
            <span className="box-border w-[40px] shrink-0 h-[40px] [border:1px_solid_#0000001A] rounded-[999px] overflow-hidden relative flex flex-row gap-0 justify-center items-center bg-[#DCEEFB]">
              <UserAvatar
                sizes="40px"
                fallback={
                  <span aria-hidden="true" className="text-[14px]/[normal] box-border text-[#0F6CB8] font-poppins font-semibold text-left [white-space:nowrap]">
                    {user.initials}
                  </span>
                }
              />
            </span>
            <span title={user.name} className="hidden sm:block text-[14px]/[normal] box-border max-w-[220px] text-[#0B3B5C] font-inter font-semibold text-left truncate">
              {user.name}
            </span>
          </AccountMenu>
        </div>
      </div>
    </header>
  )
}
