'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Logo } from '@/components/ui/logo'
import { Icon } from '@/components/ui/icon'
import { AccountMenu } from '@/components/dashboard/account-menu'
import { FOCUS_RING } from '@/components/nelayan/focus-ring'
import { PRESS } from '@/components/ui/interaction'
import { SidebarNav, type SidebarNavItem, type SidebarNotifications } from '@/components/dashboard/sidebar-nav'

// Where the two role frames differ. The pembeli export's "Sea Decoration" waves have empty paths (they render
// nothing), so only the nelayan sidebar draws them.
const ROLE_STYLES = {
  nelayan: { waves: true },
  pembeli: { waves: false },
}

type SidebarProps = {
  role: keyof typeof ROLE_STYLES
  nav: SidebarNavItem[]
  notifications?: SidebarNotifications
  user: { name: string; role: string; initials: string }
  // Where the card's account menu sends "Akun".
  accountHref: string
}

const MENU_ID = 'sidebar-menu'

// The dashboard sidebar shared by both roles. Sticky and viewport-tall, so it stays in place while the main column
// scrolls. The sea decoration is pinned to the bottom (the export's top-[700px] in a 1100px frame). Below lg it is a
// bar across the top instead: the logo and a menu button, which opens the nav and the account card beneath it. At lg
// the row and the panel are `display: contents`, so their children lay out in the column as before.
export function Sidebar({ role, nav, notifications, user, accountHref }: SidebarProps) {
  const style = ROLE_STYLES[role]
  const t = useTranslations('nav.menu')
  const pathname = usePathname()
  // Remembers the page the menu was opened on, so moving to another page closes it.
  const [openOn, setOpenOn] = useState<string | null>(null)
  const open = openOn === pathname
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    // Focus goes back to the button, since the link it was on disappears with the panel.
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      setOpenOn(null)
      buttonRef.current?.focus()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open])

  return (
    <aside className="box-border w-full lg:w-[260px] shrink-0 sticky top-0 max-h-dvh lg:max-h-none lg:h-dvh lg:self-start z-40 lg:z-auto flex flex-col gap-0 lg:gap-[32px] p-[16px] lg:p-[24px_16px] justify-start items-start [background-image:linear-gradient(180deg,_#0B3B5C_0%,_#0F5C82_100%)] bg-no-repeat bg-[length:100%_100%] overflow-y-auto lg:overflow-hidden relative">
      {style.waves && <SeaDecoration />}
      <div className="box-border w-full h-fit shrink-0 flex flex-row justify-between items-center lg:contents">
        <div className="box-border w-fit h-fit shrink-0 flex flex-row gap-0 p-[4px_0px] lg:p-[4px_12px] justify-start items-start relative [z-index:1]">
          <Logo tone="light" />
        </div>
        <button
          ref={buttonRef}
          type="button"
          aria-expanded={open}
          aria-controls={MENU_ID}
          aria-label={open ? t('close') : t('open')}
          onClick={() => setOpenOn(open ? null : pathname)}
          className={`lg:hidden box-border w-[44px] shrink-0 h-[44px] flex justify-center items-center rounded-[12px] cursor-pointer hover:bg-[#FFFFFF14] relative [z-index:1] ${PRESS} ${FOCUS_RING}`}
        >
          {open ? (
            <Icon name="x" fill="#FFFFFF" className="box-border w-[24px] h-[24px]" />
          ) : (
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" className="w-[24px] h-[24px]">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>
      <div id={MENU_ID} className={`${open ? 'flex' : 'hidden'} lg:contents box-border w-full flex-col gap-[16px] pt-[16px]`}>
        <SidebarNav items={nav} notifications={notifications} />
        {/* The card opens the account menu: on a narrow screen it is the only way to reach "Keluar". The nelayan
            frame draws no chevron, but the card is a control now, so it gets one in both roles. */}
        <div className="box-border w-full h-fit shrink-0 relative [z-index:5]">
          <AccountMenu
            name={user.name}
            accountHref={accountHref}
            placement="above"
            chevronFill="#D6E9F5"
            triggerClassName={`box-border w-full h-fit flex flex-row gap-[12px] p-[12px] justify-start items-center bg-[#FFFFFF14] hover:bg-[#FFFFFF24] [border:1px_solid_#FFFFFF1F] rounded-[12px] cursor-pointer transition-colors duration-200 ease-out ${FOCUS_RING}`}
          >
            <span className="box-border w-[40px] shrink-0 h-[40px] flex flex-row gap-0 justify-center items-center bg-[#168BE5] rounded-[999px]">
              <span aria-hidden="true" className="text-[14px]/[normal] box-border text-[#FFFFFF] font-poppins font-semibold text-left [white-space:nowrap]">
                {user.initials}
              </span>
            </span>
            <span className="box-border [flex:1_1_0] min-w-0 h-fit flex flex-col gap-[2px] justify-start items-start">
              {/* One line: a name longer than the card ends in an ellipsis, with the full name on hover. */}
              <span className="text-[14px]/[normal] box-border w-full text-[#FFFFFF] font-inter font-semibold text-left truncate" title={user.name}>
                {user.name}
              </span>
              <span className="text-[13px]/[normal] box-border w-full text-[#D6E9F5] font-inter font-normal text-left">{user.role}</span>
            </span>
          </AccountMenu>
        </div>
      </div>
    </aside>
  )
}

function SeaDecoration() {
  return (
    <div aria-hidden="true" className="hidden lg:block box-border w-[420px] h-[260px] absolute left-[-80px] bottom-[140px] [z-index:0]">
      <svg
        viewBox="0 0 1440 160"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        className="box-border w-[420px] h-[120px] absolute left-0 top-[40px] overflow-visible [z-index:0]"
      >
        <path d="M0 60c300-60 620 30 920-5 240-27 400-35 520-15l0 120-1440 0z" fill="#FFFFFF0D" />
      </svg>
      <svg
        viewBox="0 0 1440 110"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        className="box-border w-[420px] h-[170px] absolute left-0 top-[90px] overflow-visible [z-index:1]"
      >
        <path d="M0 50c260 50 600-40 900-5 250 30 410-5 540-20l0 85-1440 0z" fill="#FFFFFF12" />
      </svg>
    </div>
  )
}
