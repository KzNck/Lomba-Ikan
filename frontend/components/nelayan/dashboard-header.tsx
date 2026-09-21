import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Icon } from '@/components/ui/icon'
import { AccountMenu } from '@/components/dashboard/account-menu'
import { FOCUS_RING } from '@/components/nelayan/focus-ring'
import type { ImageContent } from '@/components/home/hero'
import { OUTLINE_HOVER, PRESS } from '@/components/ui/interaction'

type DashboardHeaderProps = {
  greeting: string
  subtitle: string
  notifications: { href: string; unreadCount: number }
  // Profiles carry no photo, so the avatar falls back to initials like the sidebar's.
  user: { name: string; initials: string; avatar?: ImageContent }
  // Where the account menu's "Akun" item goes.
  accountHref?: string
}

// The export sizes this bar as content-box w-[1180px] plus 64px padding, which overflows the 1180px column and
// pushes the right-hand cards off-frame; it's border-box full width here, which is what the design shows.
// No z-index of its own: that would trap the account menu below the main column (z-index 2) and the drawers (3).
export function DashboardHeader({
  greeting,
  subtitle,
  notifications,
  user,
  accountHref = '/nelayan/akun',
}: DashboardHeaderProps) {
  const t = useTranslations('nav')
  return (
    <header className="box-border w-full h-fit shrink-0 flex flex-row gap-0 p-[20px_32px] justify-between items-center bg-[#FFFFFF] [border-width:0px_0px_1px_0px] [border-style:solid] [border-color:#E2E8F0] [margin:0px_0px_-0.5px_0px] relative">
      <div className="box-border w-fit shrink-0 h-fit flex flex-col gap-[4px] justify-start items-start">
        <div className="box-border w-fit h-fit shrink-0 flex flex-row gap-[8px] justify-start items-center motion-safe:animate-fade-up">
          <h1 className="text-[22px]/[normal] box-border text-[#0B3B5C] font-poppins font-semibold text-left [white-space:nowrap]">
            {greeting}
          </h1>
          <span aria-hidden="true" className="text-[20px]/[normal] box-border text-[#0B3B5C] font-inter font-normal text-left [white-space:nowrap]">
            👋
          </span>
        </div>
        <p
          className="text-[14px]/[normal] box-border text-[#5B6B7C] font-inter font-normal text-left [white-space:nowrap] motion-safe:animate-fade-up"
          style={{ animationDelay: '80ms' }}
        >
          {subtitle}
        </p>
      </div>
      <div className="box-border w-fit shrink-0 h-fit flex flex-row gap-[20px] justify-start items-center">
        <Link
          href={notifications.href}
          aria-label={t('unread', { label: t('notifications'), count: notifications.unreadCount })}
          className={`box-border w-[40px] shrink-0 h-[40px] rounded-[999px] relative ${OUTLINE_HOVER} ${PRESS} ${FOCUS_RING}`}
        >
          <Icon name="bell" fill="#0B3B5C" className="box-border w-[22px] h-[22px] absolute left-[9px] top-[9px] [z-index:0]" />
          {notifications.unreadCount > 0 && (
            <span className="box-border w-[18px] h-[18px] absolute left-[22px] top-[2px] flex flex-row gap-0 justify-center items-center bg-[#C23B35] [outline:2px_solid_#FFFFFF] [outline-offset:-1px] rounded-[999px] [z-index:1]">
              <span className="text-[11px]/[normal] box-border text-[#FFFFFF] font-inter font-bold text-left [white-space:nowrap]">
                {notifications.unreadCount}
              </span>
            </span>
          )}
        </Link>
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
              {user.avatar ? (
                <Image src={user.avatar.src} alt={user.avatar.alt} fill sizes="40px" className="object-cover object-center" />
              ) : (
                <span aria-hidden="true" className="text-[14px]/[normal] box-border text-[#0F6CB8] font-poppins font-semibold text-left [white-space:nowrap]">
                  {user.initials}
                </span>
              )}
            </span>
            <span title={user.name} className="text-[14px]/[normal] box-border max-w-[220px] text-[#0B3B5C] font-inter font-semibold text-left truncate">
              {user.name}
            </span>
          </AccountMenu>
        </div>
      </div>
    </header>
  )
}
