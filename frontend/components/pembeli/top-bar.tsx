import Link from 'next/link'
import { Icon } from '@/components/ui/icon'
import { FOCUS_RING } from '@/components/nelayan/focus-ring'
import { OUTLINE_HOVER, PRESS } from '@/components/ui/interaction'

type TopBarActionsProps = {
  notifications: { href: string; label: string; unreadCount: number }
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

// The notification bell and account pill at the right of the pembeli top bars (dashboard and marketplace).
export function TopBarActions({ notifications, user }: TopBarActionsProps) {
  return (
    <>
      <Link
        href={notifications.href}
        aria-label={`${notifications.label}, ${notifications.unreadCount} belum dibaca`}
        className={`box-border w-[44px] shrink-0 h-[44px] flex flex-row gap-0 justify-center items-center bg-[#FFFFFF] [outline:1px_solid_#E2E8F0] [outline-offset:-0.5px] rounded-[999px] relative ${OUTLINE_HOVER} ${PRESS} ${FOCUS_RING}`}
      >
        <Icon name="bell" fill="#0B3B5C" className="box-border w-[22px] shrink-0 h-[22px] relative [z-index:0]" />
        {notifications.unreadCount > 0 && (
          <span className="box-border w-[18px] h-[18px] absolute left-[24px] top-[2px] flex flex-row gap-0 justify-center items-center bg-[#C23B35] [outline:2px_solid_#FFFFFF] [outline-offset:-1px] rounded-[999px] [z-index:1]">
            <span className="text-[11px]/[normal] box-border text-[#FFFFFF] font-poppins font-semibold text-left [white-space:nowrap]">
              {notifications.unreadCount}
            </span>
          </span>
        )}
      </Link>
      {/* The chevron hints at a menu the design doesn't specify yet, so this stays non-interactive. */}
      <div className="box-border w-fit shrink-0 h-fit flex flex-row gap-[10px] p-[6px_12px_6px_6px] justify-start items-center bg-[#FFFFFF] [outline:1px_solid_#E2E8F0] [outline-offset:-0.5px] rounded-[999px]">
        <div className="box-border w-[36px] shrink-0 h-[36px] flex flex-row gap-0 justify-center items-center bg-[#DCEEFB] rounded-[999px]">
          <Icon name="fish" fill="#0F6CB8" className="box-border w-[18px] shrink-0 h-[18px]" />
        </div>
        <span className="text-[14px]/[18px] box-border w-[180px] shrink-0 text-[#0B3B5C] font-poppins font-semibold text-left">{user.name}</span>
        <Icon name="chevron-down" fill="#5B6B7C" className="box-border w-[16px] shrink-0 h-[16px]" />
      </div>
    </>
  )
}
