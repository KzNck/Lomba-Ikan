import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Icon } from '@/components/ui/icon'
import { AccountMenu } from '@/components/dashboard/account-menu'
import { LanguageSwitcher } from '@/components/ui/language-switcher'
import { initialsOf } from '@/lib/nelayan/dashboard-data'
import { FOCUS_RING } from '@/components/nelayan/focus-ring'
import { OUTLINE_HOVER, PRESS } from '@/components/ui/interaction'

type TopBarActionsProps = {
  notifications: { href: string; unreadCount: number }
  user: { name: string }
}

type TopBarProps = TopBarActionsProps & {
  greeting: string
  subtitle: string
}

export function TopBar({ greeting, subtitle, notifications, user }: TopBarProps) {
  return (
    <header className="box-border w-full h-fit shrink-0 flex flex-row gap-[20px] justify-start items-center">
      <div className="box-border [flex:1_1_0] h-fit flex flex-col gap-[6px] justify-start items-start">
        <h1 className="text-[26px]/[33px] box-border w-full text-[#0B3B5C] font-poppins font-bold text-left">{greeting}</h1>
        <p className="text-[15px]/[normal] box-border w-full text-[#5B6B7C] font-inter font-normal text-left">{subtitle}</p>
      </div>
      <TopBarActions notifications={notifications} user={user} />
    </header>
  )
}

// The language switcher, notification bell and account pill at the right of the pembeli top bars (dashboard and marketplace), drawn
// the same as the nelayan header's.
export function TopBarActions({ notifications, user }: TopBarActionsProps) {
  const t = useTranslations('nav')
  return (
    <>
      {/* The same switcher as the landing navbar. */}
      <LanguageSwitcher />
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
      {/* It opens the account menu (Akun, then Keluar). */}
      <div className="box-border w-fit shrink-0 h-fit">
        <AccountMenu
          name={user.name}
          accountHref="/pembeli/akun"
          placement="below"
          chevronFill="#5B6B7C"
          triggerClassName={`box-border w-fit shrink-0 h-fit flex flex-row gap-[12px] p-[4px] m-[-4px] justify-start items-center rounded-[999px] cursor-pointer hover:bg-[#F3FAFF] transition-colors duration-200 ease-out ${FOCUS_RING}`}
        >
          <span className="box-border w-[40px] shrink-0 h-[40px] [border:1px_solid_#0000001A] rounded-[999px] overflow-hidden relative flex flex-row gap-0 justify-center items-center bg-[#DCEEFB]">
            <span aria-hidden="true" className="text-[14px]/[normal] box-border text-[#0F6CB8] font-poppins font-semibold text-left [white-space:nowrap]">
              {initialsOf(user.name)}
            </span>
          </span>
          <span title={user.name} className="text-[14px]/[normal] box-border max-w-[220px] text-[#0B3B5C] font-inter font-semibold text-left truncate">
            {user.name}
          </span>
        </AccountMenu>
      </div>
    </>
  )
}
